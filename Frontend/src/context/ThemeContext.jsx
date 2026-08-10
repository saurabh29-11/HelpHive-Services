import React, { createContext, useEffect } from 'react';
import useTheme from '../hooks/useTheme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, toggleTheme] = useTheme();

  // This effect ensures the class is applied on the client after initial render
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'light' || theme === 'dark') {
      root.classList.add(theme);
    }
  }, [theme]);


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};