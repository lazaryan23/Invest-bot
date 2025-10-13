import { useState, useEffect } from 'react';
import { User } from '@investment-bot/shared';

export const useAuth = () => {
  const [user] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    isLoading,
    login: () => {},
    logout: () => {},
    isAuthenticated: !!user,
  };
};