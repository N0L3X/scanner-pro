import React, { createContext, useContext, useState } from 'react';

interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
}

const themes: Record<string, Theme> = {
  cyberpunk: {
    name: 'Cyberpunk',
    colors: {
      primary: '#f72585',
      secondary: '#4cc9f0',
      background: '#10002b',
      surface: '#240046',
      text: '#ffffff',
      accent: '#7209b7'
    }
  },
  dracula: {
    name: 'Dracula',
    colors: {
      primary: '#bd93f9',
      secondary: '#50fa7b',
      background: '#282a36',
      surface: '#44475a',
      text: '#f8f8f2',
      accent: '#ff79c6'
    }
  }
};

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (name: string) => void;
}>({
  theme: themes.dracula,
  setTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(themes.dracula);

  const setTheme = (name: string) => {
    const newTheme = themes[name];
    if (newTheme) {
      setThemeState(newTheme);
      document.documentElement.style.setProperty('--color-primary', newTheme.colors.primary);
      document.documentElement.style.setProperty('--color-secondary', newTheme.colors.secondary);
      document.documentElement.style.setProperty('--color-background', newTheme.colors.background);
      document.documentElement.style.setProperty('--color-surface', newTheme.colors.surface);
      document.documentElement.style.setProperty('--color-text', newTheme.colors.text);
      document.documentElement.style.setProperty('--color-accent', newTheme.colors.accent);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);