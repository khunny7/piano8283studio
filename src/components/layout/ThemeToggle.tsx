import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} style={{ padding: '0.4rem 0.75rem' }}>
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
