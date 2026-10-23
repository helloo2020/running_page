import { useTheme } from '@/hooks/useTheme';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="site-header">
      <Link to="/" className="site-brand" aria-label="Scond 跑步首页">
        Scond<span>跑步</span>
      </Link>
      <nav aria-label="主导航" className="site-nav">
        <a href="https://scond.me/" target="_self">
          主页
        </a>
        <NavLink to="/" end>
          足迹
        </NavLink>
        <NavLink to="/summary">统计</NavLink>
        <a href="https://blog.scond.me/" target="_self">
          文章
        </a>
      </nav>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? '切换浅色模式' : '切换深色模式'}
        title={theme === 'dark' ? '切换浅色模式' : '切换深色模式'}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {theme === 'dark' ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
            </>
          ) : (
            <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />
          )}
        </svg>
      </button>
    </header>
  );
};
export default Header;
