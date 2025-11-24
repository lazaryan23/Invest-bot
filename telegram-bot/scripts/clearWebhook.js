#!/usr/bin/env node

/**
 * Telegram Bot Webhook Cleanup Script
 * 
 * This script clears any existing webhooks and pending updates
 * to fix the 409 Conflict error when multiple bot instances try to run.
 * 
 * Usage:
 *   node scripts/clearWebhook.js YOUR_BOT_TOKEN
 * 
 * Or with environment variable:
 *   TELEGRAM_BOT_TOKEN=your_token node scripts/clearWebhook.js
 */

const https = require('https');

const BOT_TOKEN = process.argv[2] || process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ Error: Bot token is required!');
  console.error('Usage: node scripts/clearWebhook.js YOUR_BOT_TOKEN');
  console.error('Or set TELEGRAM_BOT_TOKEN environment variable');
  process.exit(1);
}

function makeRequest(endpoint, data = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function cleanup() {
  console.log('🔧 Starting webhook cleanup...\n');

  try {
    // Step 1: Get current webhook info
    console.log('1️⃣ Checking current webhook status...');
    const webhookInfo = await makeRequest('getWebhookInfo');
    
    if (webhookInfo.ok) {
      const info = webhookInfo.result;
      console.log('   Current webhook URL:', info.url || 'None');
      console.log('   Pending updates:', info.pending_update_count || 0);
      console.log('   Last error:', info.last_error_message || 'None');
    }
    console.log('');

    // Step 2: Delete webhook
    console.log('2️⃣ Deleting webhook...');
    const deleteResult = await makeRequest('deleteWebhook', { drop_pending_updates: true });
    
    if (deleteResult.ok) {
      console.log('   ✅ Webhook deleted successfully');
    } else {
      console.log('   ⚠️ Warning:', deleteResult.description);
    }
    console.log('');

    // Step 3: Clear pending updates
    console.log('3️⃣ Clearing pending updates...');
    const updatesResult = await makeRequest('getUpdates', { offset: -1 });
    
    if (updatesResult.ok) {
      console.log('   ✅ Pending updates cleared');
    } else {
      console.log('   ⚠️ Warning:', updatesResult.description);
    }
    console.log('');

    // Step 4: Verify cleanup
    console.log('4️⃣ Verifying cleanup...');
    const verifyInfo = await makeRequest('getWebhookInfo');
    
    if (verifyInfo.ok) {
      const info = verifyInfo.result;
      console.log('   Webhook URL:', info.url || '✅ None (cleared)');
      console.log('   Pending updates:', info.pending_update_count || 0);
    }
    console.log('');

    console.log('✅ Cleanup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure no other bot instances are running');
    console.log('   2. For local dev: Set USE_WEBHOOK=false and use polling');
    console.log('   3. For production: Set USE_WEBHOOK=true and deploy to Render');
    console.log('   4. Never run polling and webhook mode simultaneously!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

cleanup();
