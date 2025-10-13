import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { ApiService } from '@/services/api';
import type {
  LoginRequest,
  RegisterRequest,
  CreateInvestmentRequest,
  DepositRequest,
  WithdrawRequest,
  TransactionFilters,
  PaginationParams,
} from '@/types/api';

// Query keys for consistent caching
export const QUERY_KEYS = {
  // Auth
  USER_PROFILE: 'user-profile',
  
  // Dashboard
  DASHBOARD: 'dashboard',
  RECENT_ACTIVITIES: 'recent-activities',
  
  // Investments
  INVESTMENT_PLANS: 'investment-plans',
  INVESTMENT_HISTORY: 'investment-history',
  INVESTMENT_DETAILS: (id: string) => ['investment', id],
  
  // Wallet
  WALLET_DATA: 'wallet-data',
  WALLET_BALANCE: 'wallet-balance',
  WALLET_TRANSACTIONS: 'wallet-transactions',
  WALLET_ADDRESS: 'wallet-address',
  
  // Transactions
  TRANSACTIONS: 'transactions',
  TRANSACTION_DETAILS: (id: string) => ['transaction', id],
  
  // Referrals
  REFERRAL_DATA: 'referral-data',
  REFERRAL_CODE: 'referral-code',
  REFERRED_USERS: 'referred-users',
} as const;

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => ApiService.auth.login(credentials),
    onSuccess: (data) => {
      // Store user data in cache
      queryClient.setQueryData([QUERY_KEYS.USER_PROFILE], data.data.user);
      
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Login Failed',
        message: error.message || 'Invalid credentials',
        color: 'red',
      });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterRequest) => ApiService.auth.register(userData),
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Account created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Registration Failed',
        message: error.message || 'Failed to create account',
        color: 'red',
      });
    },
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: () => ApiService.auth.getProfile(),
    select: (data) => data.data,
  });
};

// Dashboard hooks
export const useDashboard = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: () => ApiService.dashboard.getDashboardData(),
    select: (data) => data.data,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useRecentActivities = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RECENT_ACTIVITIES],
    queryFn: () => ApiService.dashboard.getRecentActivities(),
    select: (data) => data.data,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Investment hooks
export const useInvestmentPlans = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.INVESTMENT_PLANS],
    queryFn: () => ApiService.investment.getInvestmentPlans(),
    select: (data) => data.data,
    staleTime: 10 * 60 * 1000, // 10 minutes - plans don't change often
  });
};

export const useInvestmentHistory = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INVESTMENT_HISTORY, params],
    queryFn: () => ApiService.investment.getInvestmentHistory(params),
    select: (data) => data.data,
  });
};

export const useCreateInvestment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (investment: CreateInvestmentRequest) => 
      ApiService.investment.createInvestment(investment),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVESTMENT_HISTORY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_BALANCE] });
      
      notifications.show({
        title: 'Investment Created',
        message: 'Your investment has been created successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Investment Failed',
        message: error.message || 'Failed to create investment',
        color: 'red',
      });
    },
  });
};

// Wallet hooks
export const useWalletData = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.WALLET_DATA],
    queryFn: () => ApiService.wallet.getWalletData(),
    select: (data) => data.data,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useWalletBalance = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.WALLET_BALANCE],
    queryFn: () => ApiService.wallet.getWalletBalance(),
    select: (data) => data.data,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useWalletTransactions = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WALLET_TRANSACTIONS, params],
    queryFn: () => ApiService.wallet.getWalletTransactions(params),
    select: (data) => data.data,
  });
};

export const useDepositAddress = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.WALLET_ADDRESS],
    queryFn: () => ApiService.wallet.getDepositAddress(),
    select: (data) => data.data,
    staleTime: 60 * 60 * 1000, // 1 hour - address rarely changes
  });
};

export const useDeposit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deposit: DepositRequest) => ApiService.wallet.initiateDeposit(deposit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_DATA] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_TRANSACTIONS] });
      
      notifications.show({
        title: 'Deposit Initiated',
        message: 'Your deposit request has been submitted',
        color: 'blue',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Deposit Failed',
        message: error.message || 'Failed to initiate deposit',
        color: 'red',
      });
    },
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (withdrawal: WithdrawRequest) => ApiService.wallet.requestWithdrawal(withdrawal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_DATA] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_TRANSACTIONS] });
      
      notifications.show({
        title: 'Withdrawal Requested',
        message: 'Your withdrawal request has been submitted',
        color: 'blue',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Withdrawal Failed',
        message: error.message || 'Failed to request withdrawal',
        color: 'red',
      });
    },
  });
};

// Transaction hooks
export const useTransactions = (params?: PaginationParams & TransactionFilters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, params],
    queryFn: () => ApiService.transaction.getTransactions(params),
    select: (data) => data.data,
  });
};

export const useTransactionDetails = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTION_DETAILS(id),
    queryFn: () => ApiService.transaction.getTransactionDetails(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

// Referral hooks
export const useReferralData = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.REFERRAL_DATA],
    queryFn: () => ApiService.referral.getReferralData(),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReferralCode = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.REFERRAL_CODE],
    queryFn: () => ApiService.referral.getReferralCode(),
    select: (data) => data.data,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGenerateReferralCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => ApiService.referral.generateNewReferralCode(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REFERRAL_CODE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REFERRAL_DATA] });
      
      notifications.show({
        title: 'Code Generated',
        message: 'New referral code has been generated',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Generation Failed',
        message: error.message || 'Failed to generate new code',
        color: 'red',
      });
    },
  });
};

export const useReferredUsers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REFERRED_USERS, params],
    queryFn: () => ApiService.referral.getReferredUsers(params),
    select: (data) => data.data,
  });
};