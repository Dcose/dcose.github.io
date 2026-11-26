import { useEffect, useMemo, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { matchesPost } from '../lib/catalog';

export interface CommandPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags: readonly string[];
}

export interface CommandTag {
  tag: string;
  count: number;
}

interface Props {
  posts: readonly CommandPost[];
  tags: readonly CommandTag[];
}

export default function CommandPalette({ posts, tags }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const openRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onOpen = () => {
      setQuery('');
      setOpen(true);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(prev => {
          if (!prev) setQuery('');
          return !prev;
        });
      }
    };
    window.addEventListener('kyanite:open-cmd', onOpen);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('kyanite:open-cmd', onOpen);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    openRef.current = open;
    const modal = modalRef.current;
    if (!modal) return;
    if (open) {
      if (!modal.open) modal.showModal();
      inputRef.current?.focus();
    }
  }, [open]);

  const term = query.trim().replace(/^#/, '');
  const matchedPosts = useMemo(
    () => posts.filter(post => matchesPost(post, '', term)),
    [posts, term],
  );
  const matchedTags = useMemo(() => {
    if (!term) return [];
    const lower = term.toLowerCase();
    return tags.filter(item => item.tag.toLowerCase().includes(lower));
  }, [tags, term]);

  function selectTag(tag: string) {
    setOpen(false);
    if (location.pathname === '/') {
      window.dispatchEvent(new CustomEvent('kyanite:filter-tag', { detail: { tag } }));
    } else {
      navigate(`/?tag=${encodeURIComponent(tag)}`);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <dialog
        ref={modalRef}
        className="cmd-modal"
        aria-label="搜索文章或标签"
        onClose={() => setOpen(false)}
        onCancel={event => { event.preventDefault(); setOpen(false); }}
        onKeyDown={event => {
          if (event.key === 'Escape' && !event.nativeEvent.isComposing) {
            event.preventDefault();
            setOpen(false);
            return;
          }
          if (event.key !== 'Tab') return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>('input, button, a[href]');
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey ? document.activeElement === first : document.activeElement === last) {
            event.preventDefault();
            (event.shiftKey ? last : first)?.focus();
          }
        }}
      >
      <AnimatePresence
        onExitComplete={() => {
          if (!openRef.current && modalRef.current?.open) {
            modalRef.current.close();
          }
        }}
      >
        {open && (
          <motion.div
            className="cmd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            onClick={event => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              className="cmd-dialog"
              initial={{ opacity: 0, scale: 0.96, y: -8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{
                opacity: 0,
                scale: 0.975,
                y: -4,
                filter: 'blur(5px)',
                transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
              }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="cmd-input-wrap">
                <input
                  ref={inputRef}
                  type="search"
                  aria-label="搜索文章或标签"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="搜索文章或 #标签…"
                  autoComplete="off"
                />
                <button type="button" className="cmd-esc" aria-label="关闭搜索" title="关闭搜索" onClick={() => setOpen(false)}>ESC</button>
              </div>
              <div className="cmd-results">
                {matchedPosts.map(post => (
                  <a
                    key={post.id}
                    href={`/posts/${post.id}/`}
                    className="cmd-item"
                    onClick={() => setOpen(false)}
                  >
                    <span>{post.title}</span>
                    <small>{post.date}</small>
                  </a>
                ))}
                {matchedTags.map(item => (
                  <button
                    key={item.tag}
                    type="button"
                    className="cmd-item"
                    onClick={() => selectTag(item.tag)}
                  >
                    <span>#{item.tag}</span>
                    <small>{item.count} 篇</small>
                  </button>
                ))}
                {matchedPosts.length === 0 && matchedTags.length === 0 && (
                  <div className="cmd-empty">没有匹配的文章或标签</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </dialog>
    </MotionConfig>
  );
}
