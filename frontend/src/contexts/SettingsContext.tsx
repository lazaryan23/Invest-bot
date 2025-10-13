import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslations, TranslationKey } from '@/i18n/translations';
import { useTelegram } from './TelegramContext';

export interface SettingsContextType {
  // Theme
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  
  // Language (locked to 'en')
  language: string;
  setLanguage: (language: string) => void;
  
  // Currency (locked to 'USDT')
  currency: string;
  setCurrency: (currency: string) => void;
  
  // Helper function to format currency
  formatCurrency: (amount: number) => string;
  
  // Helper function to get currency symbol
  getCurrencySymbol: () => string;
  
  // Translation function
  t: (key: TranslationKey) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Default settings
const DEFAULT_SETTINGS = {
  darkMode: false,
  language: 'en',
  currency: 'USDT',
};

// Language options (kept for potential future use)
export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ru', label: 'Русский' },
];

// Currency options (kept for potential future use)
export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'USDT', label: 'USDT', symbol: '₮' },
  { value: 'BTC', label: 'BTC (₿)', symbol: '₿' },
  { value: 'ETH', label: 'ETH (Ξ)', symbol: 'Ξ' },
];

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState<boolean>(DEFAULT_SETTINGS.darkMode);
  // language and currency are locked; states exist to avoid breaking consumers
  const [language] = useState<string>(DEFAULT_SETTINGS.language);
  const [currency] = useState<string>(DEFAULT_SETTINGS.currency);
  
  // Get Telegram context (may be null outside of Telegram)
  let telegram;
  try {
    telegram = useTelegram();
  } catch {
    telegram = null;
  }
  
  // Get translation function (locked to English)
  const { t } = useTranslations('en');

  // Load settings from localStorage on mount (only darkMode)
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setDarkModeState(settings.darkMode ?? DEFAULT_SETTINGS.darkMode);
      }
      
      // If running in Telegram, sync with Telegram's theme
      if (telegram?.colorScheme) {
        setDarkModeState(telegram.colorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
  }, [telegram]);

  // Persist only darkMode in localStorage
  const saveSettings = (newSettings: Partial<typeof DEFAULT_SETTINGS>) => {
    try {
      const currentSettings = {
        darkMode: newSettings.darkMode ?? darkMode,
      };
      localStorage.setItem('app-settings', JSON.stringify(currentSettings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  };

  const setDarkMode = (newDarkMode: boolean) => {
    setDarkModeState(newDarkMode);
    saveSettings({ darkMode: newDarkMode });
  };

  // No-ops to keep API stable
  const setLanguage = (_newLanguage: string) => {
    // language is locked to 'en'
    return;
  };

  const setCurrency = (_newCurrency: string) => {
    // currency is locked to 'USDT'
    return;
  };

  const getCurrencySymbol = () => {
    const currencyOption = CURRENCY_OPTIONS.find(opt => opt.value === currency);
    return currencyOption?.symbol || '$';
  };

  const formatCurrency = (amount: number) => {
    const symbol = getCurrencySymbol();
    
    // Format based on currency type
    if (currency === 'BTC') {
      return `${symbol}${amount.toFixed(8)}`;
    } else if (currency === 'ETH') {
      return `${symbol}${amount.toFixed(6)}`;
    } else if (currency === 'USDT') {
      return `${amount.toFixed(2)} ${currency}`;
    } else {
      // For fiat currencies (not used now, but kept for compatibility)
      try {
        const locale = 'en-US';
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
        }).format(amount);
      } catch {
        return `${symbol}${amount.toFixed(2)}`;
      }
    }
  };

  const contextValue: SettingsContextType = {
    darkMode,
    setDarkMode,
    language,
    setLanguage,
    currency,
    setCurrency,
    formatCurrency,
    getCurrencySymbol,
    t,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
