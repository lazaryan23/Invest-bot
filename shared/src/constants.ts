// API Routes
export const API_ROUTES = {
  // Authentication
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  
  // Users
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    DASHBOARD: '/api/users/dashboard',
  },
  
  // Investments
  INVESTMENTS: {
    LIST: '/api/investments',
    CREATE: '/api/investments',
    DETAILS: '/api/investments/:id',
    PLANS: '/api/investments/plans',
  },
  
  // Transactions
  TRANSACTIONS: {
    LIST: '/api/transactions',
    CREATE: '/api/transactions',
    DETAILS: '/api/transactions/:id',
  },
  
  // Wallet
  WALLET: {
    BALANCE: '/api/wallet/balance',
    DEPOSIT: '/api/wallet/deposit',
    WITHDRAW: '/api/wallet/withdraw',
    HISTORY: '/api/wallet/history',
  },
  
  // Referrals
  REFERRALS: {
    STATS: '/api/referrals/stats',
    LIST: '/api/referrals',
  },
  
  // Telegram
  TELEGRAM: {
    WEBHOOK: '/api/telegram/webhook',
    AUTH: '/api/telegram/auth',
  },
} as const;

// Investment Plan Settings
export const INVESTMENT_SETTINGS = {
  MIN_INVESTMENT: 10,
  MAX_INVESTMENT: 1000000,
  DECIMAL_PLACES: 6,
  INTEREST_CALCULATION_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
} as const;

// Wallet Settings
export const WALLET_SETTINGS = {
  USDT_DECIMALS: 6,
  MIN_WITHDRAWAL: 10,
  WITHDRAWAL_FEE_PERCENTAGE: 0.5, // 0.5%
  NETWORK: 'TRC20',
  CONFIRMATION_BLOCKS: 6,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Security
export const SECURITY = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  JWT_EXPIRES_IN: '7d',
  REFRESH_TOKEN_EXPIRES_IN: '30d',
} as const;

// Telegram Bot Messages
export const BOT_MESSAGES = {
  WELCOME: `🎉 Welcome to Investment Bot!

Your secure cryptocurrency investment platform with competitive returns.

💰 **Investment Plans:**
• Daily: 1.2% daily returns
• Weekly: 10% weekly returns  
• Monthly: 45% monthly returns
• Quarterly: 150% quarterly returns

🎁 **Referral Bonus:** Earn 3% of your friends' investments!

Use the buttons below to get started:`,

  HELP: `ℹ️ **Investment Bot Help**

**Commands:**
/start - Welcome message
/help - Show this help
/dashboard - View your dashboard
/invest - Make an investment
/wallet - Manage your wallet
/referral - Referral information
/support - Contact support

**Quick Actions:**
Use the menu buttons for easy navigation!`,

  INVEST_MENU: `💰 **Choose Your Investment Plan:**

📅 **Daily Plan** - 1.2% daily returns (30 days)
• Min: $10 | Max: $10,000

📊 **Weekly Plan** - 10% weekly returns (12 weeks)  
• Min: $50 | Max: $50,000

📈 **Monthly Plan** - 45% monthly returns (12 months)
• Min: $100 | Max: $100,000

🚀 **Quarterly Plan** - 150% quarterly returns (4 quarters)
• Min: $500 | Max: $500,000

Select a plan to continue:`,

  WALLET_MENU: `💼 **Wallet Management**

💰 Balance: {{balance}} USDT
📥 Total Deposits: {{totalDeposits}} USDT
📤 Total Withdrawals: {{totalWithdrawals}} USDT

Choose an action:`,

  REFERRAL_INFO: `👥 **Referral Program**

🔗 Your referral code: \`{{referralCode}}\`
👥 Total referrals: {{totalReferrals}}
💰 Referral earnings: {{referralEarnings}} USDT

📢 **How it works:**
• Share your referral link with friends
• Earn 3% of their investments as bonus
• Payments are instant!

🔗 **Your referral link:**
https://t.me/{{botUsername}}?start={{referralCode}}`,

} as const;

// Status Messages
export const STATUS_MESSAGES = {
  SUCCESS: {
    REGISTRATION: 'Account created successfully!',
    INVESTMENT: 'Investment created successfully!',
    DEPOSIT: 'Deposit processed successfully!',
    WITHDRAWAL: 'Withdrawal processed successfully!',
    PROFILE_UPDATE: 'Profile updated successfully!',
  },
  ERROR: {
    INVALID_AMOUNT: 'Invalid amount specified',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    INVALID_ADDRESS: 'Invalid wallet address',
    USER_NOT_FOUND: 'User not found',
    INVESTMENT_NOT_FOUND: 'Investment not found',
    TRANSACTION_FAILED: 'Transaction failed',
    UNAUTHORIZED: 'Unauthorized access',
    SERVER_ERROR: 'Internal server error',
  },
  INFO: {
    PROCESSING: 'Processing your request...',
    PENDING_CONFIRMATION: 'Waiting for blockchain confirmation...',
    MAINTENANCE: 'System under maintenance',
  },
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  INVESTMENT_CREATED: 'investment_created',
  INTEREST_EARNED: 'interest_earned',
  INVESTMENT_COMPLETED: 'investment_completed',
  DEPOSIT_CONFIRMED: 'deposit_confirmed',
  WITHDRAWAL_PROCESSED: 'withdrawal_processed',
  REFERRAL_BONUS: 'referral_bonus',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
} as const;

// File Upload
export const UPLOAD_SETTINGS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  UPLOAD_PATH: '/uploads',
} as const;

// Cache Settings
export const CACHE_SETTINGS = {
  DEFAULT_TTL: 300, // 5 minutes
  LONG_TTL: 3600, // 1 hour
  USER_DASHBOARD_TTL: 60, // 1 minute
  INVESTMENT_PLANS_TTL: 3600, // 1 hour
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  GENERAL: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 10,
  },
  INVESTMENT: {
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MAX_REQUESTS: 5,
  },
  WITHDRAWAL: {
    WINDOW_MS: 24 * 60 * 60 * 1000, // 24 hours
    MAX_REQUESTS: 3,
  },
} as const;

// Blockchain Networks
export const NETWORKS = {
  TRC20: {
    name: 'TRON (TRC20)',
    symbol: 'TRX',
    explorerUrl: 'https://tronscan.org/#/transaction/',
    rpcUrl: 'https://api.trongrid.io',
  },
  ERC20: {
    name: 'Ethereum (ERC20)',
    symbol: 'ETH',
    explorerUrl: 'https://etherscan.io/tx/',
    rpcUrl: 'https://mainnet.infura.io/v3/',
  },
} as const;

// Investment Plans Configuration
export const INVESTMENT_PLANS = [
  {
    name: 'Daily Plan',
    plan: 'daily',
    interestRate: 1.2,
    duration: 30,
    minAmount: 10,
    maxAmount: 10000,
    description: '1.2% daily returns for 30 days',
  },
  {
    name: 'Weekly Plan',
    plan: 'weekly',
    interestRate: 10,
    duration: 84, // 12 weeks
    minAmount: 50,
    maxAmount: 50000,
    description: '10% weekly returns for 12 weeks',
  },
  {
    name: 'Monthly Plan',
    plan: 'monthly',
    interestRate: 45,
    duration: 365, // 12 months
    minAmount: 100,
    maxAmount: 100000,
    description: '45% monthly returns for 12 months',
  },
  {
    name: 'Quarterly Plan',
    plan: 'quarterly',
    interestRate: 150,
    duration: 1460, // 4 years
    minAmount: 500,
    maxAmount: 500000,
    description: '150% quarterly returns for 4 quarters',
  },
] as const;

export const REFERRAL_BONUS_PERCENTAGE = 3;
