import mongoose from 'mongoose';
import { logger } from '../utils/logger';

class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('Database already connected');
      return;
    }

    const mongoUriRaw = process.env.MONGODB_URI;
    if (!mongoUriRaw) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    // Encode special characters in password for URI safety
    const mongoUri = this.encodeMongoUri(mongoUriRaw);

    logger.info(`Attempting to connect to MongoDB at URI: ${mongoUri.replace(/:.+@/, ':*****@')}`);
    mongoose.set('debug', true); // Log all queries & operations

    try {
      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      logger.info('✅ Connected to MongoDB successfully');

      // Connection events
      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
        this.isConnected = true;
      });

      // Graceful shutdown
      process.on('SIGINT', this.gracefulShutdown);
      process.on('SIGTERM', this.gracefulShutdown);
    } catch (error) {
      logger.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  private encodeMongoUri(uri: string): string {
    // Simple regex to encode password between username:password@
    return uri.replace(/:\/\/(.*):(.*)@/, (_, user, pass) => {
      const encodedPass = encodeURIComponent(pass);
      return `://${user}:${encodedPass}@`;
    });
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('Disconnected from MongoDB');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public isConnectionReady(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  private gracefulShutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}. Gracefully shutting down MongoDB connection.`);
    try {
      await this.disconnect();
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  };
}

export const database = Database.getInstance();
