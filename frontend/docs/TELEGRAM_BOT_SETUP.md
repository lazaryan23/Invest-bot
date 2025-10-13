# 🤖 Telegram Bot Integration Guide

This guide covers how to integrate your investment bot web app with a Telegram Bot.

## 🏗️ Frontend Integration (✅ Complete)

Your frontend is now fully integrated with Telegram Web App SDK. Here's what was added:

### ✅ Features Added:
- **Telegram Web App SDK** - Full integration with @twa-dev/sdk
- **User Authentication** - Automatic login using Telegram user data
- **Theme Synchronization** - Auto-sync with Telegram's dark/light mode
- **Native UI Components** - Back button, main button, haptic feedback
- **Responsive Design** - Optimized for mobile Telegram experience
- **Proper Meta Tags** - Viewport and mobile web app settings

## 🔧 Backend Setup Required

### 1. Create Telegram Bot
```bash
# Talk to @BotFather on Telegram
/newbot
# Follow prompts to create your bot
# Save the bot token: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
```

### 2. Set Web App URL
```bash
# In @BotFather chat
/setdomain
# Select your bot
# Enter your domain: https://yourdomain.com
```

### 3. Backend API Endpoints

Create these endpoints in your backend:

#### Authentication Validation
```javascript
// POST /api/auth/telegram
// Validate Telegram init data and create session
app.post('/api/auth/telegram', async (req, res) => {
  const { initData } = req.body;
  
  // Validate initData signature with your bot token
  const isValid = validateTelegramInitData(initData, BOT_TOKEN);
  
  if (isValid) {
    const user = parseTelegramInitData(initData);
    // Create user session/JWT token
    const token = createJWT(user);
    res.json({ success: true, token, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Telegram data' });
  }
});
```

#### Bot Commands
```javascript
// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 'Welcome to Investment Bot! 💰', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚀 Open Investment App',
            web_app: { url: 'https://yourdomain.com' }
          }
        ]
      ]
    }
  });
});

// Handle /wallet command
bot.onText(/\/wallet/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 'Access your wallet:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '💳 Open Wallet',
            web_app: { url: 'https://yourdomain.com/wallet' }
          }
        ]
      ]
    }
  });
});
```

### 4. Validation Helper Functions

```javascript
const crypto = require('crypto');

function validateTelegramInitData(initData, botToken) {
  const data = new URLSearchParams(initData);
  const hash = data.get('hash');
  data.delete('hash');
  
  const dataCheckString = Array.from(data.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
    
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
    
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
    
  return calculatedHash === hash;
}

function parseTelegramInitData(initData) {
  const data = new URLSearchParams(initData);
  const userJson = data.get('user');
  return JSON.parse(userJson);
}
```

## 🌐 Deployment & HTTPS

### 1. Deploy Frontend
```bash
# Build your app
npm run build

# Deploy to hosting service (choose one):

# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist

# AWS S3 + CloudFront
aws s3 sync dist/ s3://your-bucket/

# Your own server with nginx
```

### 2. SSL Certificate (Required)
Telegram requires HTTPS for Web Apps. Options:

- **Let's Encrypt** (Free SSL)
- **Cloudflare** (Free SSL + CDN)
- **AWS CloudFront** (Managed SSL)
- **Hosting provider SSL** (Most include it)

### 3. Environment Variables
```bash
# .env
VITE_API_BASE_URL=https://api.yourdomain.com/api
BOT_TOKEN=your_telegram_bot_token
DATABASE_URL=your_database_connection
JWT_SECRET=your_jwt_secret
```

## 📱 Testing Your Telegram Mini App

### 1. Local Testing
```bash
# Use ngrok for HTTPS tunnel
ngrok http 3000

# Use the ngrok URL in @BotFather
# /setdomain -> https://abc123.ngrok.io
```

### 2. Bot Commands to Test
```
/start - Should show "Open Investment App" button
/wallet - Should open directly to wallet page
/help - Show available commands
```

### 3. Features to Verify
- ✅ App opens within Telegram
- ✅ Theme matches Telegram (dark/light)
- ✅ Back button works
- ✅ Haptic feedback works
- ✅ User data is automatically available
- ✅ API calls include Telegram auth headers

## 🎯 Telegram Bot Features You Can Add

### Menu Commands
```bash
# In @BotFather
/setcommands
# Add these commands:
start - 🚀 Start using Investment Bot
wallet - 💳 Open your wallet
invest - 📈 View investment plans
profile - 👤 Manage your profile
help - ❓ Get help and support
```

### Inline Keyboards
```javascript
const investmentKeyboard = {
  inline_keyboard: [
    [
      { text: '📊 Dashboard', web_app: { url: 'https://yourdomain.com/dashboard' } }
    ],
    [
      { text: '💰 Invest', web_app: { url: 'https://yourdomain.com/invest' } },
      { text: '💳 Wallet', web_app: { url: 'https://yourdomain.com/wallet' } }
    ],
    [
      { text: '👥 Referrals', web_app: { url: 'https://yourdomain.com/referrals' } }
    ]
  ]
};
```

### Notifications
```javascript
// Send notifications to users
function notifyUser(chatId, message) {
  bot.sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '📱 Open App',
            web_app: { url: 'https://yourdomain.com' }
          }
        ]
      ]
    }
  });
}

// Examples:
notifyUser(userId, '💰 Your investment of $500 is now active!');
notifyUser(userId, '✅ Withdrawal of $100 has been processed.');
notifyUser(userId, '🎉 You earned $50 from referral bonuses!');
```

## 🔒 Security Considerations

1. **Always validate init data** on your backend
2. **Use HTTPS everywhere** - Telegram requires it
3. **Validate user permissions** for each action
4. **Rate limit API calls** to prevent abuse
5. **Store bot token securely** - never expose it

## 📚 Useful Resources

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Web Apps](https://core.telegram.org/bots/webapps)
- [@twa-dev/sdk Documentation](https://github.com/twa-dev/sdk)
- [BotFather Commands](https://core.telegram.org/bots#6-botfather)

---

Your web app is now fully ready to be a Telegram Mini App! 🎉

Just deploy it with HTTPS and connect your Telegram bot to start serving users directly within Telegram.