import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import { TelegramProvider } from './contexts/TelegramContext';

// Import Mantine styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/spotlight/styles.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    },
  },
});

import { ThemeWrapper } from './components/ThemeWrapper/ThemeWrapper';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TelegramProvider>
          <SettingsProvider>
            <ThemeWrapper>
              <ModalsProvider>
                <Notifications position="top-right" />
                <App />
              </ModalsProvider>
            </ThemeWrapper>
          </SettingsProvider>
        </TelegramProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
