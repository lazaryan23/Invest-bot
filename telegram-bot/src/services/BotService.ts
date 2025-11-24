import TelegramBot, { CallbackQuery, Message, SendMessageOptions } from 'node-telegram-bot-api';
import { ApiService } from './ApiService';
import { logger } from '../utils/logger';
import { BOT_MESSAGES } from '@investment-bot/shared';

export class BotService {
  constructor(private bot: TelegramBot, private api: ApiService) {}

  async initialize() {
    // Basic health check
    const healthy = await this.api.ping();
    if (!healthy) {
      logger.warn('API health check failed during bot initialization');
    }

    // Register commands
    this.registerStart();
    this.registerHelp();

    // Handle callback buttons
    this.bot.on('callback_query', (query) => this.handleCallback(query));

    // Optional: handle plain text messages
    this.bot.on('message', (msg) => this.handleMessage(msg));

    logger.info('BotService initialized');
  }

  private registerStart() {
    this.bot.onText(/^\/start(?:\s+(.+))?$/, async (msg, match) => {
      const chatId = msg.chat.id;
      const referralCode = match?.[1];

      // Get web app URL from environment or use default
      const webAppUrl = process.env.WEB_APP_URL || 'https://invest-bot1.onrender.com';

      const keyboard = {
        inline_keyboard: [
          [
            { 
              text: '🚀 Open Investment App', 
              web_app: { url: webAppUrl }
            },
          ],
        ],
      };

      let text = BOT_MESSAGES.WELCOME;
      if (referralCode) {
        text += `\n\n🎉 *You were referred with code:* \`${referralCode}\``;
        logger.info('User started bot with referral code', { chatId, referralCode });
      }

      const options: SendMessageOptions = { reply_markup: keyboard, parse_mode: 'Markdown' };

      try {
        await this.bot.sendMessage(chatId, text, options);
      } catch (error) {
        logger.error('Failed to send /start message', { error: (error as Error).message, chatId });
      }
    });
  }

  private registerHelp() {
    this.bot.onText(/^\/help$/, async (msg) => {
      const chatId = msg.chat.id;
      try {
        await this.bot.sendMessage(chatId, BOT_MESSAGES.HELP, { parse_mode: 'Markdown' });
      } catch (error) {
        logger.error('Failed to send /help message', { error: (error as Error).message, chatId });
      }
    });
  }

  private async handleCallback(query: CallbackQuery) {
    const chatId = query.message?.chat.id;
    const data = query.data;

    if (!chatId || !data) return;

    try {
      // No callbacks needed for now since we only have web app button
      await this.bot.answerCallbackQuery({ callback_query_id: query.id });
    } catch (error) {
      logger.error('Failed to handle callback', { error: (error as Error).message, data, chatId });
    }
  }

  private async handleMessage(msg: Message) {
    // Ignore command messages here – they are handled by onText
    if (msg.text?.startsWith('/')) return;

    // Basic response to non-command messages
    try {
      await this.bot.sendMessage(msg.chat.id, 'Use the menu or /help to get started.');
    } catch (error) {
      logger.error('Failed to handle message', { error: (error as Error).message, chatId: msg.chat.id });
    }
  }
}
