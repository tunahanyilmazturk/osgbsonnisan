import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') return true;
      if (savedTheme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Add smooth transition
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    return () => {
      document.documentElement.style.transition = '';
    };
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsTransitioning(true);
    setIsDark(!isDark);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return { isDark, toggleDarkMode, isTransitioning };
}
