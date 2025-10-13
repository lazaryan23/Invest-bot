import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import WebApp from '@twa-dev/sdk';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramContextType {
  // Web App instance
  webApp: typeof WebApp;
  
  // User data
  user: TelegramUser | null;
  
  // Web App state
  isInitialized: boolean;
  isExpanded: boolean;
  colorScheme: 'light' | 'dark';
  
  // Methods
  close: () => void;
  expand: () => void;
  ready: () => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string) => Promise<boolean>;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  impactOccurred: (style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  
  // Main button control
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  
  // Back button control
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Initialize Telegram Web App
    try {
      WebApp.ready();
      setIsInitialized(true);
      
      // Get user data
      if (WebApp.initDataUnsafe?.user) {
        setUser(WebApp.initDataUnsafe.user as TelegramUser);
      }
      
      // Set initial state
      setIsExpanded(WebApp.isExpanded);
      setColorScheme(WebApp.colorScheme);
      
      // Expand the web app by default
      WebApp.expand();
      
      // Set theme colors
      WebApp.setHeaderColor('#667eea');
      WebApp.setBackgroundColor('#f8fafc');
      
      // Listen for theme changes
      WebApp.onEvent('themeChanged', () => {
        setColorScheme(WebApp.colorScheme);
      });
      
      // Listen for viewport changes
      WebApp.onEvent('viewportChanged', () => {
        setIsExpanded(WebApp.isExpanded);
      });
      
      console.log('Telegram Web App initialized:', {
        user: WebApp.initDataUnsafe?.user,
        platform: WebApp.platform,
        version: WebApp.version,
        colorScheme: WebApp.colorScheme,
      });
      
    } catch (error) {
      console.error('Failed to initialize Telegram Web App:', error);
      // Still allow the app to work outside of Telegram for development
      setIsInitialized(true);
    }
  }, []);

  const contextValue: TelegramContextType = {
    webApp: WebApp,
    user,
    isInitialized,
    isExpanded,
    colorScheme,
    
    close: () => WebApp.close(),
    expand: () => WebApp.expand(),
    ready: () => WebApp.ready(),
    
    showAlert: (message: string) => WebApp.showAlert(message),
    showConfirm: (message: string) => {
      return new Promise((resolve) => {
        WebApp.showConfirm(message, resolve);
      });
    },
    
    setHeaderColor: (color: string) => {
      try {
        WebApp.setHeaderColor(color as any);
      } catch (e) { console.log('Failed to set header color'); }
    },
    setBackgroundColor: (color: string) => {
      try {
        WebApp.setBackgroundColor(color as any);
      } catch (e) { console.log('Failed to set background color'); }
    },
    
    impactOccurred: (style = 'light') => {
      if (WebApp.HapticFeedback) {
        WebApp.HapticFeedback.impactOccurred(style);
      }
    },
    
    showMainButton: (text: string, onClick: () => void) => {
      WebApp.MainButton.text = text;
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(onClick);
    },
    
    hideMainButton: () => {
      WebApp.MainButton.hide();
      try {
        WebApp.MainButton.offClick(() => {});
      } catch (e) { console.log('Failed to remove main button click handler'); }
    },
    
    showBackButton: (onClick: () => void) => {
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(onClick);
    },
    
    hideBackButton: () => {
      WebApp.BackButton.hide();
      try {
        WebApp.BackButton.offClick(() => {});
      } catch (e) { console.log('Failed to remove back button click handler'); }
    },
  };

  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
}

// Hook to check if running inside Telegram
export function useTelegramAuth() {
  const telegram = useTelegram();
  
  return {
    user: telegram.user,
    isInTelegram: telegram.user !== null,
    isAuthenticated: telegram.user !== null,
    userId: telegram.user?.id,
    username: telegram.user?.username,
    firstName: telegram.user?.first_name,
    lastName: telegram.user?.last_name,
    languageCode: telegram.user?.language_code || 'en',
    isPremium: telegram.user?.is_premium || false,
  };
}