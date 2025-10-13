# 🤖 Investment Bot - Telegram Mini App

A modern investment platform built as a Telegram Mini App with React, TypeScript, and Mantine UI.

## ✨ Features

- 📱 **Telegram Mini App** - Native integration with Telegram
- 💰 **Investment Management** - Multiple investment plans with real-time tracking
- 💳 **Wallet System** - Secure deposit and withdrawal functionality
- 📊 **Dashboard** - Comprehensive portfolio overview
- 👥 **Referral System** - Earn rewards by inviting friends
- 🌍 **Multi-language** - Support for English, Spanish, French, German
- 🌓 **Dark Mode** - Syncs with Telegram theme
- 📱 **Mobile First** - Optimized for mobile Telegram experience

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Mantine UI v7
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Telegram**: @twa-dev/sdk
- **Styling**: CSS-in-JS with Mantine
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🛠️ Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/investment-bot-frontend.git
   cd investment-bot-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env with your values
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🤖 Telegram Bot Setup

1. **Create a bot with @BotFather**
   - Send `/newbot` to @BotFather on Telegram
   - Follow the instructions to create your bot
   - Save the bot token

2. **Configure bot commands**
   - Send `/setcommands` to @BotFather
   - Add these commands:
   ```
   start - 🚀 Start using Investment Bot
   wallet - 💳 Open your wallet
   invest - 📈 View investment plans
   profile - 👤 Manage your profile
   help - ❓ Get help and support
   ```

3. **Set Web App URL**
   - Send `/setdomain` to @BotFather
   - Enter your deployed URL (e.g., https://your-app.vercel.app)

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect to GitHub**
   - Push your code to GitHub
   - Import project in Vercel dashboard
   - Vercel will auto-deploy on every push

2. **Set Environment Variables in Vercel**
   - Go to Project Settings > Environment Variables
   - Add:
     - `VITE_API_BASE_URL` - Your backend API URL
     - `VITE_TELEGRAM_BOT_TOKEN` - Your Telegram bot token

3. **Configure Custom Domain** (Optional)
   - Add your custom domain in Vercel
   - Update @BotFather with new domain

### Other Platforms

- **Netlify**: `npm run build` → deploy `dist/` folder
- **AWS S3 + CloudFront**: Upload `dist/` to S3 bucket
- **GitHub Pages**: Enable Pages in repo settings

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navigation/     # App navigation
│   ├── Telegram/       # Telegram-specific components
│   └── ThemeWrapper/   # Theme management
├── contexts/           # React contexts
│   ├── SettingsContext.tsx
│   └── TelegramContext.tsx
├── hooks/              # Custom React hooks
│   └── api.ts          # API hooks with React Query
├── lib/                # Utilities and configurations
│   └── api-client.ts   # HTTP client with auth
├── pages/              # Page components
│   ├── Dashboard/
│   ├── Invest/
│   ├── Wallet/
│   ├── Transactions/
│   ├── Referrals/
│   └── Profile/
├── services/           # API services
├── types/              # TypeScript type definitions
└── i18n/              # Internationalization
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | Yes |
| `VITE_TELEGRAM_BOT_TOKEN` | Telegram bot token | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_VERSION` | Application version | No |

### API Integration

The app expects your backend to provide these endpoints:

- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/investments/plans` - Available investment plans
- `POST /api/investments/create` - Create new investment
- `GET /api/wallet/balance` - Wallet balance
- `POST /api/wallet/deposit` - Initiate deposit
- `POST /api/wallet/withdraw` - Request withdrawal
- `GET /api/referrals/stats` - Referral statistics

## 🎨 Customization

### Theming
The app uses Mantine's theming system and automatically syncs with Telegram's theme (dark/light mode).

### Languages
Add new languages by updating `src/i18n/translations.ts`.

### Colors
Customize colors in `src/components/ThemeWrapper/ThemeWrapper.tsx`.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🚀 Live Demo

- **Telegram Bot**: [@YourBotName](https://t.me/YourBotName)
- **Web Version**: [your-app.vercel.app](https://your-app.vercel.app)

---

Built with ❤️ for the Telegram ecosystem