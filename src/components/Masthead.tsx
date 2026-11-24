import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';

export default function Masthead() {
  const [dark, setDark] = useState(false);
  const [toggled, setToggled] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const [splashOn, setSplashOn] = useState(true);

  useEffect(() => {
    const saved = document.documentElement.dataset.splash;
    if (saved === 'off') setSplashOn(false);
  }, []);

  useEffect(() => {
    const syncProgress = () => {
      const root = document.scrollingElement;
      if (!root || !progressRef.current) return;
      const range = root.scrollHeight - root.clientHeight;
      const fraction = range > 2 ? Math.min(1, Math.max(0, root.scrollTop / range)) : 0;
      progressRef.current.style.transform = `scaleX(${fraction})`;
    };
    syncProgress();
    const observer = new ResizeObserver(syncProgress);
    observer.observe(document.documentElement);
    window.addEventListener('scroll', syncProgress, { passive: true });
    window.addEventListener('resize', syncProgress);
    document.addEventListener('astro:after-swap', syncProgress);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', syncProgress);
      window.removeEventListener('resize', syncProgress);
      document.removeEventListener('astro:after-swap', syncProgress);
    };
  }, []);

  useEffect(() => {
    const system = matchMedia('(prefers-color-scheme: dark)');
    function sync() {
      const choice = document.documentElement.dataset.theme;
      const resolved = choice ? choice === 'dark' : system.matches;
      setDark(resolved);
      document.querySelector<HTMLLinkElement>('link[rel="icon"]')!.href = `/favicon_${resolved ? 'white' : 'black'}.ico`;
    }
    sync();
    system.addEventListener('change', sync);
    return () => system.removeEventListener('change', sync);
  }, []);

  function toggle() {
    const theme = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('kyanite-theme', theme); } catch {}
    document.querySelector<HTMLLinkElement>('link[rel="icon"]')!.href = `/favicon_${dark ? 'black' : 'white'}.ico`;
    setToggled(true);
    setDark(!dark);
  }

  function toggleSplash() {
    const next = !splashOn;
    const mode = next ? 'on' : 'off';
    setSplashOn(next);
    document.documentElement.dataset.splash = mode;
    try { localStorage.setItem('kyanite-splash', mode); } catch {}
    window.dispatchEvent(new CustomEvent('kyanite:splash-change', { detail: { mode } }));
  }

  const themeLabel = dark ? '切换到浅色主题' : '切换到深色主题';
  const splashLabel = splashOn ? '关闭鼠标效果' : '开启鼠标效果';

  return (
    <MotionConfig reducedMotion="user">
      <div ref={progressRef} className="scroll-line" aria-hidden="true" />
      <header className="mast">
        <nav className="wrap nav" aria-label="主导航">
          <div className="brand-cluster">
            <a href="/" className="brand" aria-label="Kyanite 首页">
              <img className="black-mark" src="/assets/Logo_black.png" alt="" />
              <img className="white-mark" src="/assets/Logo_white.png" alt="" />
              <span>Kyanite</span>
            </a>
            <div className="brand-theme">
              <button
                id="theme"
                type="button"
                aria-label={themeLabel}
                title={themeLabel}
                aria-pressed={dark}
                onClick={toggle}
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.span
                    key={dark ? 'dark' : 'light'}
                    initial={toggled ? { y: -20, opacity: 0 } : false}
                    animate={{ y: 0, opacity: 1 }}
                    exit={toggled ? { y: 20, opacity: 0 } : {}}
                    transition={toggled ? { type: 'spring', stiffness: 500, damping: 25 } : { duration: 0 }}
                  >
                    {dark ? 'Dark' : 'Light'}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
          <div className="mast-actions">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('kyanite:open-cmd'))}
              aria-label="搜索文章"
              title="搜索文章 (⌘K)"
            >
              ⌘K
            </button>
            <button
              type="button"
              className="mast-splash"
              onClick={toggleSplash}
              aria-label={splashLabel}
              title={splashLabel}
              aria-pressed={splashOn}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3l1.6 4.8L18.4 9.4l-4.8 1.6L12 15.8l-1.6-4.8L5.6 9.4l4.8-1.6Z" />
                <path className="splash-on-mark" d="M19 16l.7 2.1 2.1.7-2.1.7L19 21.6l-.7-2.1-2.1-.7 2.1-.7Z" />
                <line className="splash-off-mark" x1="4" y1="20" x2="20" y2="4" />
              </svg>
            </button>
          </div>
        </nav>
      </header>
    </MotionConfig>
  );
}
