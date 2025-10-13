// Common types
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type TransactionType = 'deposit' | 'withdraw' | 'investment' | 'profit' | 'referral';
export type InvestmentStatus = 'active' | 'completed' | 'cancelled';

// User and Authentication
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  referralCode?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Dashboard
export interface DashboardStats {
  totalBalance: number;
  totalInvested: number;
  totalProfit: number;
  activeInvestments: number;
  referralEarnings: number;
  portfolioGrowth: number; // percentage
}

export interface RecentActivity {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  portfolioChart?: {
    labels: string[];
    values: number[];
  };
}

// Investment Plans and Investments
export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  duration: number; // in days
  profitPercentage: number;
  totalReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  isActive: boolean;
  features: string[];
}

export interface Investment {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  profitAmount: number;
  status: InvestmentStatus;
  startDate: string;
  endDate: string;
  duration: number; // in days
  expectedProfit: number;
  currentProfit: number;
  profitPercentage: number;
  daysRemaining?: number;
}

export interface CreateInvestmentRequest {
  planId: string;
  amount: number;
}

// Wallet
export interface WalletBalance {
  available: number;
  locked: number;
  total: number;
  currency: string;
}

export interface WalletAddress {
  address: string;
  network: string;
  currency: string;
  qrCode?: string;
}

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  fee?: number;
  status: TransactionStatus;
  hash?: string;
  confirmations?: number;
  requiredConfirmations?: number;
  fromAddress?: string;
  toAddress?: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface DepositRequest {
  amount: number;
  network?: string;
  paymentMethod?: string;
}

export interface WithdrawRequest {
  amount: number;
  address: string;
  network?: string;
  password?: string;
  twoFactorCode?: string;
}

export interface WalletData {
  balance: WalletBalance;
  address: WalletAddress;
  transactions: WalletTransaction[];
  pendingTransactions: number;
}

// Transactions
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  fee?: number;
  status: TransactionStatus;
  hash?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  relatedId?: string; // investment ID, referral ID, etc.
}

export interface TransactionFilters {
  type?: TransactionType[];
  status?: TransactionStatus[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Referrals
export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  currentMonthEarnings: number;
  conversionRate: number; // percentage
  availableBalance: number;
}

export interface ReferralUser {
  id: string;
  username: string;
  email?: string;
  registeredAt: string;
  totalInvested: number;
  yourEarnings: number;
  isActive: boolean;
  level: number;
}

export interface ReferralCode {
  code: string;
  url: string;
  clicks: number;
  registrations: number;
  createdAt: string;
  isActive: boolean;
}

export interface ReferralData {
  stats: ReferralStats;
  referralCode: ReferralCode;
  referredUsers: ReferralUser[];
  earningsHistory: {
    date: string;
    amount: number;
    source: string;
  }[];
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Error Response
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
  statusCode: number;
}

// Generic API Response wrapper
export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
  success: true;
}