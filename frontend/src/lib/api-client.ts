import { API_CONFIG, API_ENDPOINTS } from '@/config/api';

// API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: Record<string, string[]>;
}

// API Error class
export class ApiError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// Authentication token management
class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// HTTP Client class
class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = { ...API_CONFIG.DEFAULT_HEADERS };
  }

  private getTelegramInitData(): string {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        return (window as any).Telegram.WebApp.initData || '';
      }
    } catch {}
    return '';
  }

  private async telegramLogin(): Promise<boolean> {
    const initData = this.getTelegramInitData();
    if (!initData) return false;

    try {
      const res = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.TELEGRAM}`, {
        method: 'POST',
        headers: { ...this.defaultHeaders, 'X-Telegram-Init-Data': initData },
      });
      if (!res.ok) return false;
      const body = await res.json();
      if (body?.data?.accessToken) {
        TokenManager.setToken(body.data.accessToken);
        if (body.data.refreshToken) TokenManager.setRefreshToken(body.data.refreshToken);
        return true;
      }
    } catch {}
    return false;
  }

  private async request<T>(
    url: string,
    options: RequestInit & { attachTelegramHeader?: boolean; _retry?: boolean } = {}
  ): Promise<ApiResponse<T>> {
    const token = TokenManager.getToken();
    const telegramInitData = this.getTelegramInitData();

    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.attachTelegramHeader && telegramInitData && { 'X-Telegram-Init-Data': telegramInitData }),
    } as Record<string, string>;

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      let response = await fetch(`${this.baseURL}${url}`, config);

      // If unauthorized and we can login via Telegram, try once then retry the request
      if (response.status === 401 && !token && !options._retry && telegramInitData) {
        const loggedIn = await this.telegramLogin();
        if (loggedIn) {
          const newToken = TokenManager.getToken();
          const retryHeaders = {
            ...headers,
            ...(newToken && { Authorization: `Bearer ${newToken}` }),
          } as Record<string, string>;
          response = await fetch(`${this.baseURL}${url}`, { ...config, headers: retryHeaders, _retry: true } as any);
        }
      }

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      );
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any = {};
    
    try {
      errorData = await response.json();
    } catch {
      // If JSON parsing fails, use status text
      errorData = { message: response.statusText };
    }

    // Handle authentication errors
    if (response.status === 401) {
      TokenManager.clearTokens();
      // Redirect to login or emit auth error event
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    throw new ApiError(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData.errors
    );
  }

  // HTTP methods
  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const searchParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${url}${searchParams}`, {
      method: 'GET',
    });
  }

  async post<T>(url: string, data?: any, extra?: { attachTelegramHeader?: boolean }): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...(extra || {}),
    });
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new HttpClient();
export { TokenManager };

// Helper to check if auth context is ready (JWT token or Telegram init data available)
export function isAuthReady(): boolean {
  try {
    // If we already have a JWT, we are ready
    if (TokenManager.getToken()) return true;

    // If running without a window (SSR), do not block queries
    if (typeof window === 'undefined') return true;

    const tg = (window as any).Telegram?.WebApp;

    // If not inside Telegram, allow queries to proceed (public or JWT-based flows)
    if (!tg) return true;

    // If inside Telegram and initData exists, we are ready
    if (typeof tg.initData === 'string' && tg.initData.length > 0) return true;

    // Inside Telegram but no initData yet: allow queries to proceed to avoid blocking UI
    // Backend can respond with 401 if it truly requires auth, which the UI will surface.
    return true;
  } catch {
    // On any unexpected error, do not block the app
    return true;
  }
}
