import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { useTelegram } from '@/contexts/TelegramContext';

interface TelegramBackButtonProps {
  enabled?: boolean;
}

export function TelegramBackButton({ enabled = true }: TelegramBackButtonProps) {
  const telegram = useTelegram();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;

    // Show back button if not on home page
    const isHomePage = location.pathname === '/' || location.pathname === '/dashboard';
    
    if (!isHomePage) {
      telegram.showBackButton(() => {
        navigate(-1);
      });
    } else {
      telegram.hideBackButton();
    }

    // Cleanup on unmount
    return () => {
      telegram.hideBackButton();
    };
  }, [location.pathname, enabled, telegram, navigate]);

  return null; // This component doesn't render anything visible
}

interface TelegramMainButtonProps {
  text: string;
  onClick: () => void;
  show?: boolean;
  disabled?: boolean;
}

export function TelegramMainButton({ 
  text, 
  onClick, 
  show = false, 
  disabled = false 
}: TelegramMainButtonProps) {
  const telegram = useTelegram();

  useEffect(() => {
    if (show && !disabled) {
      telegram.showMainButton(text, onClick);
    } else {
      telegram.hideMainButton();
    }

    // Cleanup on unmount
    return () => {
      telegram.hideMainButton();
    };
  }, [text, onClick, show, disabled, telegram]);

  return null; // This component doesn't render anything visible
}

interface HapticButtonProps extends React.ComponentProps<typeof Button> {
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function HapticButton({ 
  hapticStyle = 'light', 
  onClick, 
  children, 
  ...props 
}: HapticButtonProps) {
  const telegram = useTelegram();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger haptic feedback
    telegram.impactOccurred(hapticStyle);
    
    // Call the original onClick handler
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

export function useTelegramAlert() {
  const telegram = useTelegram();

  return {
    showAlert: (message: string) => {
      telegram.showAlert(message);
    },
    showConfirm: async (message: string): Promise<boolean> => {
      return telegram.showConfirm(message);
    },
  };
}

// Component to handle Telegram Web App lifecycle
export function TelegramWebAppManager() {
  const telegram = useTelegram();

  useEffect(() => {
    // Set initial colors based on your app theme
    telegram.setHeaderColor('#667eea');
    telegram.setBackgroundColor('#f8fafc');
    
    // Expand the web app
    telegram.expand();
    
    // Mark as ready
    telegram.ready();

    console.log('Telegram Web App Manager initialized');
  }, [telegram]);

  return null;
}

// Hook for easy access to Telegram-specific UI functions
export function useTelegramUI() {
  const telegram = useTelegram();
  
  return {
    showAlert: telegram.showAlert,
    showConfirm: telegram.showConfirm,
    hapticFeedback: telegram.impactOccurred,
    setColors: (headerColor: string, backgroundColor: string) => {
      telegram.setHeaderColor(headerColor);
      telegram.setBackgroundColor(backgroundColor);
    },
    close: telegram.close,
    expand: telegram.expand,
  };
}