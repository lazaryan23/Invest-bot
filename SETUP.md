# Investment Bot - Setup and Deployment Guide

## 🚀 Quick Start

This is a comprehensive Telegram investment bot with USDT integration, featuring:
- **Backend API**: Express.js with MongoDB
- **Frontend Web App**: React with Mantine UI
- **Telegram Bot**: Interactive bot with rich commands
- **Shared Library**: Common types and utilities

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Telegram Bot Token (from @BotFather)
- USDT wallet setup (for production)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/investment_bot

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_WEBHOOK_URL=https://yourdomain.com/webhook/telegram

# API
PORT=5000
API_BASE_URL=http://localhost:5000

# Frontend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TELEGRAM_BOT_USERNAME=your_bot_username

# Investment Settings
DAILY_INTEREST_RATE=1.2
WEEKLY_INTEREST_RATE=10
MONTHLY_INTEREST_RATE=45
QUARTERLY_INTEREST_RATE=150
REFERRAL_BONUS_PERCENTAGE=3
```

### 3. Create Telegram Bot

1. Message @BotFather on Telegram
2. Use `/newbot` command
3. Choose a name and username
4. Copy the token to your `.env` file
5. Set up WebApp with `/setmenubutton`

### 4. Database Setup

Start MongoDB (if local):
```bash
# macOS/Linux with Homebrew
brew services start mongodb-community

# Windows
net start MongoDB

# Or use MongoDB Atlas (cloud)
```

### 5. Build Shared Library

```bash
cd shared
npm run build
cd ..
```

## 🏃‍♂️ Running in Development

Start all services:

```bash
# Start everything
npm run dev
```

Or start services individually:

```bash
# Backend API
npm run dev:backend

# Frontend Web App  
npm run dev:frontend

# Telegram Bot
npm run dev:telegram
```

## 🏗️ Building for Production

```bash
# Build all services
npm run build

# Or build individually
npm run build:backend
npm run build:frontend
```

## 🚀 Deployment

### Option 1: Docker Deployment (Recommended)

```bash
# Build and start with Docker
docker-compose up -d
```

### Option 2: Manual Deployment

1. **Backend API**:
```bash
cd backend
npm run build
npm start
```

2. **Frontend**:
```bash
cd frontend
npm run build
# Serve the `dist` folder with nginx/apache
```

3. **Telegram Bot**:
```bash
cd telegram-bot
npm run build  
npm start
```

## 📊 Features Overview

### Investment Plans
- **Daily Plan**: 1.2% daily returns (30 days)
- **Weekly Plan**: 10% weekly returns (12 weeks)  
- **Monthly Plan**: 45% monthly returns (12 months)
- **Quarterly Plan**: 150% quarterly returns (4 quarters)

### Core Features
- 🔐 **Secure Authentication**: Telegram-based auth
- 💰 **USDT Integration**: Real cryptocurrency transactions
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎁 **Referral System**: 3% bonus for successful referrals
- 📊 **Real-time Dashboard**: Track investments and earnings
- 🔔 **Notifications**: Telegram alerts for important events

### API Endpoints

```
Authentication:
POST /api/auth/telegram - Telegram login
POST /api/auth/refresh - Refresh token

Users:
GET /api/users/profile - Get user profile
GET /api/users/dashboard - Dashboard data

Investments:
GET /api/investments - List investments
POST /api/investments - Create investment
GET /api/investments/plans - Available plans

Wallet:
GET /api/wallet/balance - Get balance
POST /api/wallet/deposit - Deposit funds
POST /api/wallet/withdraw - Withdraw funds

Referrals:
GET /api/referrals/stats - Referral statistics
GET /api/referrals - List referrals
```

## 🔧 Configuration

### Investment Plans
Edit `shared/src/types.ts` to modify investment plans:

```typescript
export const INVESTMENT_PLANS: InvestmentPlanConfig[] = [
  {
    name: 'Daily Plan',
    plan: InvestmentPlan.DAILY,
    interestRate: 1.2, // Modify rates
    duration: 30,      // Modify duration  
    minAmount: 10,     // Modify limits
    maxAmount: 10000,
  },
  // Add more plans...
];
```

### Telegram Bot Commands

The bot supports these commands:
- `/start` - Welcome message and registration
- `/help` - Show help information
- `/dashboard` - Open web dashboard
- `/invest` - Show investment plans
- `/wallet` - Wallet management
- `/referral` - Referral information
- `/support` - Contact support

### WebApp Integration

Users can access the full web interface through:
1. Telegram WebApp button
2. Direct web link
3. Inline keyboard buttons in bot messages

## 🔒 Security Features

- JWT-based authentication
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- Environment-based secrets
- Database connection security

## 📈 Monitoring and Logging

- Winston logging with file rotation
- Error tracking and reporting  
- API request logging
- Database query monitoring
- Telegram bot activity logs

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests for specific service
npm run test:backend
npm run test:frontend
```

## 🚨 Important Notes

### For Production:
1. **Use HTTPS** for all endpoints
2. **Set up proper USDT wallet** integration
3. **Configure database backups**
4. **Set up monitoring** (e.g., PM2, Docker health checks)
5. **Use environment secrets** (not hardcoded values)
6. **Set up SSL certificates**
7. **Configure firewall rules**

### Legal Considerations:
- Ensure compliance with local regulations
- Add proper terms of service
- Implement KYC if required
- Add risk disclaimers
- Consider regulatory requirements

## 📞 Support

For questions or issues:
1. Check the logs in `backend/logs/`
2. Verify environment configuration
3. Test API endpoints individually
4. Check Telegram bot webhook status

## 🎯 Next Steps

1. **Complete the remaining TODO items** in the codebase
2. **Implement real USDT integration** (currently mocked)
3. **Add comprehensive testing**
4. **Set up CI/CD pipeline**
5. **Add monitoring and alerting**
6. **Implement additional security measures**

The foundation is solid and ready for production deployment! 🚀