# Telegram Investment Bot

A comprehensive investment platform with Telegram bot integration, featuring USDT investments, referral rewards, and a responsive web interface.

## Features

- 🤖 **Telegram Bot Integration**: Easy-to-use bot interface for all investment operations
- 💰 **USDT Investment System**: Secure cryptocurrency investment with competitive interest rates
- 🔗 **Referral Program**: 3% bonus for successful referrals
- 📱 **Responsive Web App**: Beautiful Mantine UI interface for desktop and mobile
- 🏦 **Integrated Wallet**: Built-in USDT wallet management
- 📊 **Real-time Dashboard**: Track investments and earnings
- 🔒 **Secure Architecture**: Enterprise-grade security and authentication

## Interest Rates

- **Daily Plan**: 1.2% daily interest (up to 30 days)
- **Weekly Plan**: 10% weekly interest (up to 12 weeks)
- **Monthly Plan**: 45% monthly interest (up to 12 months)
- **Quarterly Plan**: 150% quarterly interest (up to 4 quarters)

## Project Structure

```
invest-bot/
├── backend/          # Express.js API server
├── frontend/         # React + Mantine UI web app
├── telegram-bot/     # Telegram bot service
├── shared/           # Shared utilities and types
└── docker/           # Docker configuration
```

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Servers**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Web App: http://localhost:3000
   - API: http://localhost:5000
   - Telegram Bot: Configure webhook or polling

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT License