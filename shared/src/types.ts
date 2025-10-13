import { z } from 'zod';

// User Types
export const UserSchema = z.object({
  id: z.string(),
  telegramId: z.number(),
  username: z.string().optional(),
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  walletAddress: z.string(),
  referralCode: z.string(),
  referredBy: z.string().optional(),
  totalInvested: z.number().default(0),
  totalEarned: z.number().default(0),
  availableBalance: z.number().default(0),
  referralEarnings: z.number().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Investment Types
export enum InvestmentPlan {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export enum InvestmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const InvestmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number().positive(),
  plan: z.nativeEnum(InvestmentPlan),
  interestRate: z.number().positive(),
  duration: z.number().positive(), // in days
  startDate: z.date(),
  endDate: z.date(),
  totalReturn: z.number(),
  earnedAmount: z.number().default(0),
  status: z.nativeEnum(InvestmentStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Investment = z.infer<typeof InvestmentSchema>;

// Transaction Types
export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  INVESTMENT = 'investment',
  INTEREST = 'interest',
  REFERRAL_BONUS = 'referral_bonus',
  REFUND = 'refund',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.nativeEnum(TransactionType),
  amount: z.number(),
  status: z.nativeEnum(TransactionStatus),
  txHash: z.string().optional(),
  fromAddress: z.string().optional(),
  toAddress: z.string().optional(),
  description: z.string().optional(),
  investmentId: z.string().optional(),
  referralUserId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// Referral Types
export const ReferralSchema = z.object({
  id: z.string(),
  referrerId: z.string(),
  referredUserId: z.string(),
  bonusAmount: z.number().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Referral = z.infer<typeof ReferralSchema>;

// Wallet Types
export const WalletSchema = z.object({
  id: z.string(),
  userId: z.string(),
  address: z.string(),
  privateKey: z.string(),
  balance: z.number().default(0),
  network: z.string().default('TRC20'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Wallet = z.infer<typeof WalletSchema>;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Investment Plan Configuration
export interface InvestmentPlanConfig {
  name: string;
  plan: InvestmentPlan;
  interestRate: number; // percentage
  duration: number; // in days
  minAmount: number;
  maxAmount: number;
  description: string;
}

// Dashboard Data Types
export interface DashboardStats {
  totalUsers: number;
  totalInvestments: number;
  totalVolume: number;
  activeInvestments: number;
  completedInvestments: number;
  totalReferrals: number;
  platformBalance: number;
}

export interface UserDashboard {
  user: User;
  activeInvestments: Investment[];
  recentTransactions: Transaction[];
  referralStats: {
    totalReferrals: number;
    totalReferralEarnings: number;
    referralCode: string;
  };
  stats: {
    totalInvested: number;
    totalEarned: number;
    availableBalance: number;
    activeInvestmentsCount: number;
  };
}

// Telegram Bot Types
export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramInlineKeyboard {
  text: string;
  callback_data?: string;
  url?: string;
  web_app?: {
    url: string;
  };
}

