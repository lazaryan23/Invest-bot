// API Configuration
// Helper to normalize BASE_URL to include /api
function normalizeBaseUrl(raw?: string): string {
  const base = raw || 'http://localhost:5000';
  const trimmed = base.replace(/\/$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

export const API_CONFIG = {
  // Base API URL - normalized to ensure it ends with /api
  BASE_URL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  
  // API version
  VERSION: 'v1',
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    TELEGRAM: '/auth/telegram',
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITIES: '/dashboard/recent-activities',
  },
  
  // Investments
  INVESTMENTS: {
    PLANS: '/investments/plans',
    CREATE: '/investments/create',
    HISTORY: '/investments/history',
    DETAILS: '/investments/{id}',
  },
  
  // Wallet
  WALLET: {
    BALANCE: '/wallet/balance',
    TRANSACTIONS: '/wallet/transactions',
    DEPOSIT: '/wallet/deposit',
    WITHDRAW: '/wallet/withdraw',
    ADDRESS: '/wallet/address',
  },
  
  // Transactions
  TRANSACTIONS: {
    LIST: '/transactions',
    DETAILS: '/transactions/{id}',
  },
  
  // Referrals
  REFERRALS: {
    STATS: '/referrals/stats',
    CODE: '/referrals/code',
    REFERRED_USERS: '/referrals/users',
    GENERATE_CODE: '/referrals/generate',
  },
} as const;