import { ReactNode } from 'react';
import { MantineProvider, MantineColorScheme } from '@mantine/core';
import { useSettings } from '@/contexts/SettingsContext';

// Enhanced theme configuration
const getTheme = (darkMode: boolean) => ({
  primaryColor: 'blue',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  },
  colors: {
    // Use proper Mantine color tuples with exactly 10 colors
    brand: [
      '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5',
      '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1'
    ] as const,
  },
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
  // Enhanced dark theme customization
  ...(darkMode && {
    colors: {
      dark: [
        '#C1C2C5',
        '#A6A7AB',
        '#909296',
        '#5c5f66',
        '#373A40',
        '#2C2E33',
        '#25262b',
        '#1A1B1E',
        '#141517',
        '#101113',
      ] as const,
      brand: [
        '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5',
        '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1'
      ] as const,
    },
    // Dark theme specific customizations
    components: {
      AppShell: {
        styles: {
          main: {
            backgroundColor: 'var(--mantine-color-dark-8)',
          },
        },
      },
      Card: {
        styles: {
          root: {
            backgroundColor: 'var(--mantine-color-dark-6)',
            borderColor: 'var(--mantine-color-dark-4)',
          },
        },
      },
    },
  }),
});

interface ThemeWrapperProps {
  children: ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { darkMode } = useSettings();
  
  const colorScheme: MantineColorScheme = darkMode ? 'dark' : 'light';
  const theme = getTheme(darkMode);

  return (
    <MantineProvider theme={theme} defaultColorScheme={colorScheme} forceColorScheme={colorScheme}>
      {children}
    </MantineProvider>
  );
}