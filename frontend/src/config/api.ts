// API Configuration
export const API_CONFIG = {
  // Base API URL - update this to your backend URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
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