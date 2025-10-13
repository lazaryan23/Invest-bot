import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { logger } from './utils/logger';
import { BotService } from './services/BotService';
import { ApiService } from './services/ApiService';

// Load environment variables
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

if (!BOT_TOKEN) {
  logger.error('TELEGRAM_BOT_TOKEN is required in environment variables');
  process.exit(1);
}

// Initialize services
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const apiService = new ApiService(API_BASE_URL);
const botService = new BotService(bot, apiService);

// Error handling
bot.on('error', (error) => {
  logger.error('Telegram bot error:', error);
});

bot.on('polling_error', (error) => {
  logger.error('Polling error:', error);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down Telegram bot gracefully...`);
  
  try {
    await bot.stopPolling();
    logger.info('Bot stopped successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start the bot
async function startBot() {
  try {
    const botInfo = await bot.getMe();
    logger.info(`🤖 Telegram bot started successfully!`);
    logger.info(`📱 Bot username: @${botInfo.username}`);
    logger.info(`🆔 Bot ID: ${botInfo.id}`);
    logger.info(`🔗 API URL: ${API_BASE_URL}`);
    
    // Initialize bot service
    await botService.initialize();
    
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

startBot();