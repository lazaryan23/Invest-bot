import path from 'path';
import dotenv from 'dotenv';
import { database } from '../database/connection';
import { User } from '../models/User';
import { Investment } from '../models/Investment';
import { Transaction } from '../models/Transaction';
import { Referral } from '../models/Referral';
import {
  InvestmentPlan,
  InvestmentStatus,
  TransactionStatus,
  TransactionType,
} from '@investment-bot/shared';

async function loadEnv() {
  // Try backend/.env
  let loaded = dotenv.config();
  if (loaded.parsed) return;
  // Try root .env (../.env from backend cwd)
  dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
}

async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    Investment.deleteMany({}),
    Transaction.deleteMany({}),
    Referral.deleteMany({}),
  ]);
}

async function seed() {
  await loadEnv();

  console.log('Connecting to database...');
  await database.connect();

  console.log('Clearing existing data...');
  await clearCollections();

  console.log('Creating users...');
  const alice = await User.create({
    telegramId: 100001,
    username: 'alice_demo',
    firstName: 'Alice',
    lastName: 'Anderson',
    email: 'alice@example.com',
    availableBalance: 1500,
    totalInvested: 500,
    totalEarned: 50,
    referralEarnings: 15,
    isActive: true,
  });

  const bob = await User.create({
    telegramId: 100002,
    username: 'bob_demo',
    firstName: 'Bob',
    lastName: 'Brown',
    email: 'bob@example.com',
    availableBalance: 750,
    totalInvested: 300,
    totalEarned: 24,
    isActive: true,
    referredBy: alice._id.toString(),
  });

  const charlie = await User.create({
    telegramId: 100003,
    username: 'charlie_demo',
    firstName: 'Charlie',
    lastName: 'Clark',
    email: 'charlie@example.com',
    availableBalance: 200,
    totalInvested: 0,
    totalEarned: 0,
    isActive: true,
  });

  console.log('Creating referral...');
  await Referral.create({
    referrerId: alice._id.toString(),
    referredUserId: bob._id.toString(),
    bonusAmount: 9, // example 3% of a 300 investment
    isActive: true,
  });

  console.log('Creating investments...');
  const now = new Date();
  const aliceInv = await Investment.create({
    userId: alice._id.toString(),
    amount: 500,
    plan: InvestmentPlan.DAILY,
    interestRate: 1.2,
    duration: 30,
    startDate: now,
    endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    totalReturn: 0, // will be set by pre-save hook
    earnedAmount: 50,
    status: InvestmentStatus.ACTIVE,
  });

  const bobInv = await Investment.create({
    userId: bob._id.toString(),
    amount: 300,
    plan: InvestmentPlan.WEEKLY,
    interestRate: 10,
    duration: 84,
    startDate: now,
    endDate: new Date(now.getTime() + 84 * 24 * 60 * 60 * 1000),
    totalReturn: 0,
    earnedAmount: 24,
    status: InvestmentStatus.ACTIVE,
  });

  console.log('Creating transactions...');
  await Transaction.insertMany([
    {
      userId: alice._id.toString(),
      type: TransactionType.DEPOSIT,
      amount: 1000,
      status: TransactionStatus.COMPLETED,
      description: 'Initial deposit',
    },
    {
      userId: alice._id.toString(),
      type: TransactionType.INVESTMENT,
      amount: 500,
      status: TransactionStatus.COMPLETED,
      description: `Invested in ${InvestmentPlan.DAILY} plan`,
      investmentId: aliceInv._id.toString(),
    },
    {
      userId: alice._id.toString(),
      type: TransactionType.INTEREST,
      amount: 10,
      status: TransactionStatus.COMPLETED,
      description: 'Daily interest',
      investmentId: aliceInv._id.toString(),
    },
    {
      userId: bob._id.toString(),
      type: TransactionType.DEPOSIT,
      amount: 800,
      status: TransactionStatus.COMPLETED,
      description: 'Initial deposit',
    },
    {
      userId: bob._id.toString(),
      type: TransactionType.INVESTMENT,
      amount: 300,
      status: TransactionStatus.COMPLETED,
      description: `Invested in ${InvestmentPlan.WEEKLY} plan`,
      investmentId: bobInv._id.toString(),
    },
    {
      userId: alice._id.toString(),
      type: TransactionType.REFERRAL_BONUS,
      amount: 9,
      status: TransactionStatus.COMPLETED,
      description: `Referral bonus from ${bob.username}`,
      referralUserId: bob._id.toString(),
    },
  ]);

  console.log('Seed completed.');
}

seed()
  .then(async () => {
    await database.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Seed failed:', err);
    await database.disconnect();
    process.exit(1);
  });
