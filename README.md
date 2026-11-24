# Kyanite

基于 Astro 的静态个人博客。文章使用 Markdown 编写，构建时生成静态页面，不需要数据库。

## 本地开发

项目要求 Node.js `>=24.18.1 <25`。
项目使用 pnpm `11.22.0` 管理依赖。

```bash
pnpm install
pnpm run dev
```

其他命令：

```bash
pnpm run check     # 类型与 Astro 检查
pnpm run build     # 构建到 dist/
pnpm run preview   # 预览构建结果
pnpm run convert -- ./note.md --dry-run  # 预览 Markdown 转换结果
```

### 转换文章

`scripts/convert.mjs` 用于把外部 Markdown 转成站点文章目录。默认日期取输入文件的最后修改日期；标题、标签和简单 frontmatter 会被转换，正文中的相对路径图片会复制到文章的 `images/` 目录。

```bash
# 预览单篇文章，不写入文件
pnpm run convert -- ./note.md --dry-run

# 指定稳定的 URL slug、标签和发布日期
pnpm run convert -- ./note.md \
  --slug prompt-engineering \
  --tags 提示词,写作 \
  --date 2026-11-24

# 批量转换 drafts/ 下的 Markdown 文件
pnpm run convert
```

`--slug` 只能用于单个输入文件，只允许文字、数字和短横线。中文标题默认会保留为中文 slug；如果需要更短或更稳定的 URL，可以显式指定 `--slug`。`drafts/` 是本地草稿目录，已被 Git 忽略，不会进入发布内容。

## 编写文章

文章放在 `content/posts/`。每篇文章使用一个目录，正文文件名为 `index.md`，配图放在同目录的 `images/` 中。

```text
content/posts/my-note/index.md
```

文章目录名就是 URL slug，例如上面的文件会生成 `/posts/my-note/`。

Frontmatter 示例：

```yaml
---
title: 我的笔记
date: 2026-11-20
tags: [写作]
summary: 可选摘要
---
```

`title`、`date` 和 `tags` 必填。省略 `summary` 时，首页会使用正文的第一个普通段落作为摘要。

在正文用 `[文章标题](/posts/my-note/)` 引用另一篇文章，也可以在链接末尾加章节锚点。文章页底的「本文引用」按首次出现顺序列出实际引用的站内文章，没有引用时不显示。首页图谱仍将两篇文章之间的互引画成一条线。

图片使用相对路径：

```markdown
![示意图](./images/diagram.png)
```

### 扩展语法

文章正文除了标准 Markdown，还支持以下渲染增强：

- **旁注**：使用 `> [!NOTE]`、`> [!TIP]`、`> [!IMPORTANT]`、`> [!WARNING]`、`> [!CAUTION]` 或 `> [!SIDENOTE]`（可附加自定义标题，如 `> [!NOTE] 补充说明`），宽屏下会渲染为左侧旁注并关联到前一个区块。
- **行内高亮**：使用 `==高亮文本==` 渲染波浪线高亮（不支持跨加粗、行内代码等嵌套格式）。
- **日志块**：语言标识为 `text`、`log` 或 `plaintext` 的代码块会转为带行号的日志视图；包含 `data:` 行时会自动标记为 `sse · stream log`。
- **对比流程图**：连续两个「`> **标题｜标签**` + 有序列表」格式的引用块会自动合并为交互式对比流程图。

## 发布

当前配置按域名根路径发布，适用于 `用户名.github.io` 或独立域名。如果使用 `用户名.github.io/仓库名/` 这样的项目站点，需要先配置 Astro 的 `base`，并调整站内链接和资源路径。

GitHub Pages 使用 GitHub Actions 发布。将仓库 Pages 的 Source 设置为 **GitHub Actions**，推送到 `main` 即可触发发布，也可以手动运行 `Publish Kyanite` 工作流。

工作流会执行 `pnpm install --frozen-lockfile`、`pnpm run check` 和 `pnpm run build`，然后部署 `dist/`。
