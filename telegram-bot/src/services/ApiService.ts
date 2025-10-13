import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

export class ApiService {
  private client: AxiosInstance;

  constructor(private baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async ping(): Promise<boolean> {
    try {
      const res = await this.client.get('/health');
      return res.status === 200;
    } catch (error) {
      logger.warn('Health check failed', { error: (error as Error).message });
      return false;
    }
  }

  // Placeholder methods to be expanded as needed
  async getUserDashboard(telegramId: number) {
    try {
      const res = await this.client.get(`/api/users/dashboard`, {
        params: { telegramId },
      });
      return res.data;
    } catch (error) {
      logger.error('Failed to fetch user dashboard', { error: (error as Error).message, telegramId });
      throw error;
    }
  }
}
