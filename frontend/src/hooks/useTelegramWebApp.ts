import { useEffect, useState } from 'react';

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        close: () => void;
        expand: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
          };
          start_param?: string;
          auth_date: number;
          hash: string;
        };
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
      };
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface UseTelegramWebAppReturn {
  isAvailable: boolean;
  user: TelegramUser | null;
  startParam: string | null;
  colorScheme: 'light' | 'dark';
  themeParams: any;
  isLoading: boolean;
  ready: () => void;
  close: () => void;
  expand: () => void;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
}

export const useTelegramWebApp = (): UseTelegramWebAppReturn => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [startParam, setStartParam] = useState<string | null>(null);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [themeParams, setThemeParams] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTelegramWebApp = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;
        
        setIsAvailable(true);
        setUser(webApp.initDataUnsafe.user || null);
        setStartParam(webApp.initDataUnsafe.start_param || null);
        setColorScheme(webApp.colorScheme);
        setThemeParams(webApp.themeParams);
        
        // Initialize the WebApp
        webApp.ready();
        webApp.expand();
        
        setIsLoading(false);
      } else {
        // Fallback for development/testing
        setIsAvailable(false);
        setIsLoading(false);
      }
    };

    // Check immediately
    checkTelegramWebApp();
    
    // Also check after a short delay in case the script loads later
    const timeout = setTimeout(checkTelegramWebApp, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  const ready = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }
  };

  const close = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  };

  const expand = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  };

  const showMainButton = (text: string, onClick: () => void) => {
    if (window.Telegram?.WebApp?.MainButton) {
      const button = window.Telegram.WebApp.MainButton;
      button.text = text;
      button.show();
      button.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    if (window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.hide();
    }
  };

  const showBackButton = (onClick: () => void) => {
    if (window.Telegram?.WebApp?.BackButton) {
      const button = window.Telegram.WebApp.BackButton;
      button.show();
      button.onClick(onClick);
    }
  };

  const hideBackButton = () => {
    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.hide();
    }
  };

  return {
    isAvailable,
    user,
    startParam,
    colorScheme,
    themeParams,
    isLoading,
    ready,
    close,
    expand,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
  };
};