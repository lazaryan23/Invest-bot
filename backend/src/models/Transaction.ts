import mongoose, { Schema, Document } from 'mongoose';
import { Transaction as ITransaction, TransactionType, TransactionStatus } from '@investment-bot/shared';

export interface TransactionDocument extends Omit<ITransaction, 'id'>, Document {
  _id: string;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(TransactionType),
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
      index: true,
    },
    txHash: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but enforce uniqueness when present
    },
    fromAddress: {
      type: String,
      trim: true,
    },
    toAddress: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    investmentId: {
      type: String,
      ref: 'Investment',
    },
    referralUserId: {
      type: String,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete (ret as any)._id;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
transactionSchema.index({ userId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ txHash: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, status: 1 });
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ investmentId: 1 });
transactionSchema.index({ referralUserId: 1 });

// Static methods
transactionSchema.statics.findByUser = function (userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

transactionSchema.statics.findByType = function (userId: string, type: TransactionType) {
  return this.find({ userId, type }).sort({ createdAt: -1 });
};

transactionSchema.statics.findByStatus = function (status: TransactionStatus) {
  return this.find({ status }).sort({ createdAt: -1 });
};

transactionSchema.statics.findPendingTransactions = function () {
  return this.find({ status: TransactionStatus.PENDING }).sort({ createdAt: 1 });
};

transactionSchema.statics.getTransactionSummary = function (userId: string) {
  return this.aggregate([
    { $match: { userId, status: TransactionStatus.COMPLETED } },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);
};

transactionSchema.statics.getTotalVolume = function () {
  return this.aggregate([
    { $match: { status: TransactionStatus.COMPLETED } },
    {
      $group: {
        _id: null,
        totalVolume: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
      },
    },
  ]);
};

transactionSchema.statics.getMonthlyVolume = function (startDate?: Date, endDate?: Date) {
  const matchStage: any = { status: TransactionStatus.COMPLETED };
  
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = startDate;
    if (endDate) matchStage.createdAt.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalVolume: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ]);
};

// Virtual for display amount (formatted)
transactionSchema.virtual('displayAmount').get(function (this: TransactionDocument) {
  return `${this.amount.toFixed(6)} USDT`;
});

// Virtual for transaction direction (incoming/outgoing)
transactionSchema.virtual('direction').get(function (this: TransactionDocument) {
  switch (this.type) {
    case TransactionType.DEPOSIT:
    case TransactionType.INTEREST:
    case TransactionType.REFERRAL_BONUS:
    case TransactionType.REFUND:
      return 'incoming';
    case TransactionType.WITHDRAWAL:
    case TransactionType.INVESTMENT:
      return 'outgoing';
    default:
      return 'neutral';
  }
});

// Virtual for status color (for UI)
transactionSchema.virtual('statusColor').get(function (this: TransactionDocument) {
  switch (this.status) {
    case TransactionStatus.COMPLETED:
      return 'green';
    case TransactionStatus.PENDING:
      return 'yellow';
    case TransactionStatus.FAILED:
      return 'red';
    case TransactionStatus.CANCELLED:
      return 'gray';
    default:
      return 'blue';
  }
});

// Ensure virtual fields are serialized
transactionSchema.set('toJSON', { virtuals: true });

export const Transaction = mongoose.model<TransactionDocument>('Transaction', transactionSchema);