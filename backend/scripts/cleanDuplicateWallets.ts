import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';

async function cleanDuplicateWallets() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await mongoose.connection.db
      .collection('users')
      .deleteMany({ walletAddress: '0x0000000000000000000000000000000000000000' });

    console.log(`Deleted ${result.deletedCount} users with duplicate wallet addresses`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanDuplicateWallets();
