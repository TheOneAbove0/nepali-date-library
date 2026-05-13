import { useEffect, useState } from 'react';

const STORAGE_KEY = 'docs-theme';

export function useDocsTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
}
