import { useSyncExternalStore } from 'react';
export type Theme = 'light' | 'dark';
const key = 'scond-running-theme';
function snapshot(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}
function subscribe(notify: () => void) {
  window.addEventListener('scond-theme', notify);
  return () => window.removeEventListener('scond-theme', notify);
}
export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    snapshot,
    () => 'light' as Theme
  );
  return {
    theme,
    toggleTheme() {
      const next = snapshot() === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', next === 'dark' ? '#181e1b' : '#fdfdfb');
      try {
        localStorage.setItem(key, next);
      } catch {
        /* Private browsing can deny storage. */
      }
      window.dispatchEvent(new Event('scond-theme'));
    },
  };
}
