import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import type {
  // Auth types
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  
  // Dashboard types
  DashboardData,
  
  // Investment types
  InvestmentPlan,
  Investment,
  CreateInvestmentRequest,
  
  // Wallet types
  WalletData,
  DepositRequest,
  WithdrawRequest,
  
  // Transaction types
  Transaction,
  TransactionFilters,
  TransactionsResponse,
  PaginationParams,
  
  // Referral types
  ReferralData,
} from '@/types/api';

// Authentication Service
export class AuthService {
  static async login(credentials: LoginRequest) {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  static async register(userData: RegisterRequest) {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  static async logout() {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  static async refreshToken() {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
  }

  static async getProfile() {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  }

  static async updateProfile(userData: Partial<User>) {
    return apiClient.patch<User>(API_ENDPOINTS.AUTH.PROFILE, userData);
  }
}

// Dashboard Service
export class DashboardService {
  static async getDashboardData() {
    return apiClient.get<DashboardData>(API_ENDPOINTS.DASHBOARD.STATS);
  }

  static async getRecentActivities() {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES);
  }
}

// Investment Service
export class InvestmentService {
  static async getInvestmentPlans() {
    return apiClient.get<InvestmentPlan[]>(API_ENDPOINTS.INVESTMENTS.PLANS);
  }

  static async createInvestment(investment: CreateInvestmentRequest) {
    return apiClient.post<Investment>(API_ENDPOINTS.INVESTMENTS.CREATE, investment);
  }

  static async getInvestmentHistory(params?: PaginationParams) {
    return apiClient.get<Investment[]>(API_ENDPOINTS.INVESTMENTS.HISTORY, params);
  }

  static async getInvestmentDetails(id: string) {
    const url = API_ENDPOINTS.INVESTMENTS.DETAILS.replace('{id}', id);
    return apiClient.get<Investment>(url);
  }
}

// Wallet Service
export class WalletService {
  static async getWalletData() {
    return apiClient.get<WalletData>(API_ENDPOINTS.WALLET.BALANCE);
  }

  static async getWalletBalance() {
    return apiClient.get(API_ENDPOINTS.WALLET.BALANCE);
  }

  static async getWalletTransactions(params?: PaginationParams) {
    return apiClient.get(API_ENDPOINTS.WALLET.TRANSACTIONS, params);
  }

  static async getDepositAddress() {
    return apiClient.get(API_ENDPOINTS.WALLET.ADDRESS);
  }

  static async initiateDeposit(deposit: DepositRequest) {
    return apiClient.post(API_ENDPOINTS.WALLET.DEPOSIT, deposit);
  }

  static async requestWithdrawal(withdrawal: WithdrawRequest) {
    return apiClient.post(API_ENDPOINTS.WALLET.WITHDRAW, withdrawal);
  }
}

// Transaction Service
export class TransactionService {
  static async getTransactions(params?: PaginationParams & TransactionFilters) {
    return apiClient.get<TransactionsResponse>(API_ENDPOINTS.TRANSACTIONS.LIST, params);
  }

  static async getTransactionDetails(id: string) {
    const url = API_ENDPOINTS.TRANSACTIONS.DETAILS.replace('{id}', id);
    return apiClient.get<Transaction>(url);
  }
}

// Referral Service
export class ReferralService {
  static async getReferralData() {
    return apiClient.get<ReferralData>(API_ENDPOINTS.REFERRALS.STATS);
  }

  static async getReferralCode() {
    return apiClient.get(API_ENDPOINTS.REFERRALS.CODE);
  }

  static async generateNewReferralCode() {
    return apiClient.post(API_ENDPOINTS.REFERRALS.GENERATE_CODE);
  }

  static async getReferredUsers(params?: PaginationParams) {
    return apiClient.get(API_ENDPOINTS.REFERRALS.REFERRED_USERS, params);
  }
}

// Combine all services for easy import
export const ApiService = {
  auth: AuthService,
  dashboard: DashboardService,
  investment: InvestmentService,
  wallet: WalletService,
  transaction: TransactionService,
  referral: ReferralService,
} as const;