#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { access, copyFile, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const DRAFTS_DIR = path.join(ROOT, 'drafts');

function parseArgs(argv) {
  const opts = {
    files: [],
    slug: '',
    tags: [],
    date: '',
    overwrite: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--slug' && argv[i + 1]) {
      opts.slug = argv[++i].trim();
    } else if (arg === '--tags' && argv[i + 1]) {
      opts.tags = argv[++i]
        .split(/[,，\s]+/)
        .map(s => s.replace(/^#/, '').trim())
        .filter(Boolean);
    } else if (arg === '--date' && argv[i + 1]) {
      opts.date = argv[++i].trim();
    } else if (arg === '--overwrite' || arg === '-f') {
      opts.overwrite = true;
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith('-')) {
      opts.files.push(arg);
    }
  }
  return opts;
}

function printHelp() {
  console.log(`Kyanite 文章转换器

用法:
  pnpm run convert <markdown文件...> [选项]
  pnpm run convert                      # 批量转换 drafts/ 目录下的 .md 文件

选项:
  --slug <name>     指定生成的文章目录名（默认自动生成）
  --tags <a,b>      指定标签（逗号或空格分隔）
  --date <YYYY-MM-DD> 指定发布日期（默认取输入文件最后修改日期）
  --overwrite, -f   若目标目录已存在则覆盖
  --dry-run         仅预览转换结果，不写入文件
`);
}

function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function parseFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: normalized };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, val] = kv;
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      meta[key] = trimmed
        .slice(1, -1)
        .split(/[,，]/)
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    } else {
      meta[key] = trimmed.replace(/^['"]|['"]$/g, '');
    }
  }
  return { meta, body: match[2] };
}

function slugify(title, fallbackName, dateStr) {
  const normalize = value => value
    .normalize('NFKC')
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const readable = normalize(title);
  if (readable.length >= 1) return readable.slice(0, 60).replace(/-+$/, '');

  const fallback = normalize(fallbackName.replace(/\.md$/i, ''));
  if (fallback.length >= 1) return fallback.slice(0, 60).replace(/-+$/, '');

  const hash = createHash('sha1').update(title || fallbackName).digest('hex').slice(0, 6);
  return `${dateStr}-${hash}`;
}

function validateSlug(value) {
  const slug = value
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, '-');

  if (!/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(slug)) {
    throw new Error(`无效 slug: ${value}。只能使用文字、数字和单个短横线。`);
  }

  return slug.slice(0, 60).replace(/-+$/, '');
}

function validateDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`无效日期: ${value}。格式应为 YYYY-MM-DD。`);
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`无效日期: ${value}。`);
  }

  return value;
}

function transformContent(rawBody, fallbackTitle) {
  const lines = rawBody.replace(/\r\n/g, '\n').split('\n');
  const outLines = [];

  let inFence = false;
  let title = '';
  const extractedTags = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      outLines.push(line);
      continue;
    }

    if (inFence) {
      outLines.push(line);
      continue;
    }

    // 提取第一条一级标题（支持 `# 标题` 或 `#标题`）
    if (!title) {
      const h1 = line.match(/^#(?!#)\s*(.+?)\s*$/);
      if (h1) {
        title = h1[1].trim();
        continue;
      }
    }

    // 识别独立标签行：`tags: a, b` / `标签：a, b` / `#标签1 #标签2`
    const labelLine = line.match(/^(?:tags|标签)\s*[:：]\s*(.+)$/i);
    if (labelLine) {
      labelLine[1]
        .split(/[,，\s]+/)
        .map(s => s.replace(/^#/, '').trim())
        .filter(Boolean)
        .forEach(t => extractedTags.push(t));
      continue;
    }

    if (/^(?:#[^\s#]+\s*)+$/.test(line.trim()) && outLines.every(l => !l.trim())) {
      line
        .trim()
        .split(/\s+/)
        .map(s => s.replace(/^#/, '').trim())
        .filter(Boolean)
        .forEach(t => extractedTags.push(t));
      continue;
    }

    // 规范化未加空格的二级及以上标题（如 `##小节` -> `## 小节`）
    const heading = line.match(/^(#{2,6})([^\s#].*)$/);
    if (heading) {
      outLines.push(`${heading[1]} ${heading[2].trim()}`);
      continue;
    }

    outLines.push(line);
  }

  // 去掉首尾多余空行
  while (outLines.length && !outLines[0].trim()) outLines.shift();
  while (outLines.length && !outLines[outLines.length - 1].trim()) outLines.pop();

  return {
    title: title || fallbackTitle,
    tags: [...new Set(extractedTags)],
    body: outLines.join('\n'),
  };
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function rewriteAndCopyImages(body, sourceDir, targetPostDir, dryRun) {
  const imageRegex = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;
  const copied = [];
  const replacements = [];

  for (const match of body.matchAll(imageRegex)) {
    const [full, alt, rawSrc, titlePart] = match;
    if (/^(?:https?:|data:|\/)/i.test(rawSrc)) continue;

    const decodedSrc = decodeURIComponent(rawSrc);
    const absSrc = path.resolve(sourceDir, decodedSrc);
    if (!(await exists(absSrc))) continue;

    const filename = path.basename(absSrc);
    const destDir = path.join(targetPostDir, 'images');
    const destPath = path.join(destDir, filename);

    if (!dryRun) {
      await mkdir(destDir, { recursive: true });
      await copyFile(absSrc, destPath);
    }
    copied.push(filename);

    const newRef = `./images/${filename}`;
    const rebuilt = titlePart ? `![${alt}](${newRef} "${titlePart}")` : `![${alt}](${newRef})`;
    replacements.push({ full, rebuilt });
  }

  let nextBody = body;
  for (const { full, rebuilt } of replacements) {
    nextBody = nextBody.replace(full, rebuilt);
  }
  return { body: nextBody, copied };
}

function buildYamlFrontmatter({ title, date, tags, summary }) {
  const escapeYaml = s => `'${String(s).replace(/'/g, "''")}'`;
  const lines = ['---', `title: ${escapeYaml(title)}`, `date: ${date}`, `tags: [${tags.map(escapeYaml).join(', ')}]`];
  if (summary) lines.push(`summary: ${escapeYaml(summary)}`);
  lines.push('---', '');
  return lines.join('\n');
}

async function convertFile(inputPath, opts) {
  const absInput = path.resolve(ROOT, inputPath);
  const raw = await readFile(absInput, 'utf8');
  const fileStat = await stat(absInput);
  const baseName = path.basename(absInput, path.extname(absInput));

  const { meta, body: rawBody } = parseFrontmatter(raw);
  const parsed = transformContent(rawBody, baseName);

  const title = (typeof meta.title === 'string' && meta.title.trim()) || parsed.title;
  const date = validateDate(
    opts.date ||
      (typeof meta.date === 'string' && meta.date.trim()) ||
      formatDate(fileStat.mtime || new Date()),
  );
  const tags =
    opts.tags.length > 0
      ? opts.tags
      : Array.isArray(meta.tags) && meta.tags.length > 0
        ? meta.tags
        : parsed.tags.length > 0
          ? parsed.tags
          : ['随笔'];
  const summary = typeof meta.summary === 'string' && meta.summary.trim() ? meta.summary.trim() : '';

  const slug = opts.slug ? validateSlug(opts.slug) : slugify(title, baseName, date);
  const targetDir = path.join(POSTS_DIR, slug);
  const targetFile = path.join(targetDir, 'index.md');

  if (!opts.overwrite && !opts.dryRun && (await exists(targetFile))) {
    console.log(`- 跳过（已存在）: ${path.relative(ROOT, targetFile)}`);
    return;
  }

  const { body: finalBody, copied } = await rewriteAndCopyImages(
    parsed.body,
    path.dirname(absInput),
    targetDir,
    opts.dryRun,
  );

  const output = `${buildYamlFrontmatter({ title, date, tags, summary })}\n${finalBody}\n`;

  if (opts.dryRun) {
    console.log(`\n[预览] -> ${path.relative(ROOT, targetFile)}`);
    console.log(output);
    return;
  }

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetFile, output, 'utf8');
  const imgNote = copied.length ? `（已复制 ${copied.length} 张图片）` : '';
  console.log(`✓ 已转换: ${path.relative(ROOT, absInput)} -> ${path.relative(ROOT, targetFile)}${imgNote}`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  let targets = opts.files;

  if (targets.length === 0) {
    if (!(await exists(DRAFTS_DIR))) {
      await mkdir(DRAFTS_DIR, { recursive: true });
      console.log(`已创建草稿目录 ${path.relative(ROOT, DRAFTS_DIR)}/`);
      console.log('请把写好的 .md 文件放进 drafts/ 后再次运行 `pnpm run convert`，或直接传入文件路径：');
      console.log('  pnpm run convert ./path/to/note.md');
      return;
    }
    const entries = await readdir(DRAFTS_DIR, { withFileTypes: true });
    targets = entries
      .filter(e => e.isFile() && e.name.toLowerCase().endsWith('.md'))
      .map(e => path.join(DRAFTS_DIR, e.name));

    if (targets.length === 0) {
      console.log('drafts/ 目录中暂无 .md 文件。');
      console.log('用法: pnpm run convert ./path/to/note.md 或将草稿放入 drafts/ 后运行 pnpm run convert');
      return;
    }
  }

  if (opts.slug && targets.length > 1) {
    throw new Error('--slug 只能用于单个输入文件；批量转换请让脚本自动生成 slug。');
  }

  for (const file of targets) {
    await convertFile(file, opts);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
