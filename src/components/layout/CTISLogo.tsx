'use client';

import { ModeSwitcher } from './ModeSwitcher';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * CTIS Logo Component
 *
 * Displays the CTIS (Customer Technology & Information Services) branding
 * with mode switcher in the application sidebar.
 *
 * V17 Mode Switcher - Government/Project mode toggle
 * V19 - Theme-aware logo switching (dark mode uses ctis-logo-dark.png)
 */

export const CTISLogo = () => {
  const { theme, mounted } = useTheme();

  // Use dark logo for dark theme, light logo for light theme
  const logoSrc = mounted && theme === 'dark' ? '/ctis-logo-dark.png' : '/ctis-logo.png';

  return (
    <div className="flex-shrink-0 px-3 pt-3 pb-3 space-y-2">
      {/* CTIS Logo */}
      <div className="flex items-center justify-center py-2">
        <img
          src={logoSrc}
          alt="CTIS Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Mode Switcher - Government vs Project */}
      <ModeSwitcher />
    </div>
  );
};

export default CTISLogo;
