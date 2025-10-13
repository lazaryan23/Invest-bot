import * as crypto from 'crypto';

// Generate random referral code
export function generateReferralCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Generate unique ID
export function generateId(): string {
  return crypto.randomUUID();
}

// Format currency amount
export function formatCurrency(amount: number, decimals: number = 2): string {
  return amount.toFixed(decimals);
}

// Calculate interest for investment
export function calculateInterest(
  principal: number,
  rate: number,
  timeInDays: number,
  compoundingFrequency: number = 1 // 1 for simple interest
): number {
  if (compoundingFrequency === 1) {
    // Simple interest: I = P * r * t
    return principal * (rate / 100) * (timeInDays / 365);
  } else {
    // Compound interest: A = P(1 + r/n)^(nt)
    const n = compoundingFrequency;
    const r = rate / 100;
    const t = timeInDays / 365;
    return principal * Math.pow(1 + r / n, n * t) - principal;
  }
}

// Calculate total return for investment plan
export function calculateTotalReturn(
  amount: number,
  interestRate: number,
  duration: number,
  plan: string
): number {
  switch (plan) {
    case 'daily':
      return amount * (1 + (interestRate / 100)) ** duration;
    case 'weekly':
      const weeks = Math.floor(duration / 7);
      return amount * (1 + (interestRate / 100)) ** weeks;
    case 'monthly':
      const months = Math.floor(duration / 30);
      return amount * (1 + (interestRate / 100)) ** months;
    case 'quarterly':
      const quarters = Math.floor(duration / 90);
      return amount * (1 + (interestRate / 100)) ** quarters;
    default:
      return amount;
  }
}

// Calculate referral bonus
export function calculateReferralBonus(
  investedAmount: number,
  bonusPercentage: number = 3
): number {
  return investedAmount * (bonusPercentage / 100);
}

// Validate USDT address (basic validation)
export function isValidUSDTAddress(address: string): boolean {
  // TRC20 USDT address validation (basic)
  if (address.startsWith('T') && address.length === 34) {
    return /^[A-Za-z0-9]+$/.test(address);
  }
  // ERC20 USDT address validation (basic)
  if (address.startsWith('0x') && address.length === 42) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  return false;
}

// Generate wallet address (mock implementation)
export function generateWalletAddress(): string {
  // This is a mock implementation
  // In production, use proper cryptocurrency library
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
  let address = 'T';
  for (let i = 0; i < 33; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return address;
}

// Generate private key (mock implementation)
export function generatePrivateKey(): string {
  // This is a mock implementation
  // In production, use proper cryptocurrency library
  return crypto.randomBytes(32).toString('hex');
}

// Format date
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format date with time
export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Calculate days between dates
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

// Sleep function for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Sanitize string for database
export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}

// Generate secure hash
export function generateHash(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Round to decimal places
export function roundToDecimals(num: number, decimals: number): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Convert to USDT format (6 decimal places)
export function toUSDTFormat(amount: number): number {
  return roundToDecimals(amount, 6);
}

// Parse USDT amount from string
export function parseUSDTAmount(amount: string): number {
  const parsed = parseFloat(amount);
  return isNaN(parsed) ? 0 : toUSDTFormat(parsed);
}

// Generate API key
export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex');
}