import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import { logger } from './utils/logger';
import { BotService } from './services/BotService';
import { ApiService } from './services/ApiService';

// Load environment variables
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const USE_WEBHOOK = process.env.USE_WEBHOOK === 'true';
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN) {
  logger.error('TELEGRAM_BOT_TOKEN is required in environment variables');
  process.exit(1);
}

if (USE_WEBHOOK && !WEBHOOK_URL) {
  logger.error('WEBHOOK_URL is required when USE_WEBHOOK=true');
  process.exit(1);
}

// Initialize bot based on mode
let bot: TelegramBot;
let app: express.Application | undefined;

if (USE_WEBHOOK) {
  // Webhook mode for production
  bot = new TelegramBot(BOT_TOKEN, { webHook: false });
  app = express();
  app.use(express.json());
  logger.info('Bot initialized in webhook mode');
} else {
  // Polling mode for local development
  bot = new TelegramBot(BOT_TOKEN, { polling: true });
  logger.info('Bot initialized in polling mode');
}

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
    if (!USE_WEBHOOK) {
      await bot.stopPolling();
    }
    if (USE_WEBHOOK && WEBHOOK_URL) {
      await bot.deleteWebHook();
    }
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
    // First, delete any existing webhook to avoid conflicts
    await bot.deleteWebHook();
    logger.info('Cleared any existing webhooks');
    
    const botInfo = await bot.getMe();
    logger.info(`🤖 Telegram bot started successfully!`);
    logger.info(`📱 Bot username: @${botInfo.username}`);
    logger.info(`🆔 Bot ID: ${botInfo.id}`);
    logger.info(`🔗 API URL: ${API_BASE_URL}`);
    logger.info(`🔧 Mode: ${USE_WEBHOOK ? 'Webhook' : 'Polling'}`);
    
    // Initialize bot service
    await botService.initialize();
    
    // Setup webhook if in webhook mode
    if (USE_WEBHOOK && WEBHOOK_URL && app) {
      const webhookPath = `/webhook/${BOT_TOKEN}`;
      const fullWebhookUrl = `${WEBHOOK_URL}${webhookPath}`;
      
      // Set webhook
      await bot.setWebHook(fullWebhookUrl);
      logger.info(`✅ Webhook set to: ${fullWebhookUrl}`);
      
      // Setup webhook endpoint
      app.post(webhookPath, (req, res) => {
        bot.processUpdate(req.body);
        res.sendStatus(200);
      });
      
      // Health check endpoint
      app.get('/health', (req, res) => {
        res.json({ status: 'ok', mode: 'webhook', timestamp: new Date().toISOString() });
      });
      
      // Start express server
      app.listen(PORT, () => {
        logger.info(`🌐 Webhook server listening on port ${PORT}`);
      });
    }
    
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

startBot();
