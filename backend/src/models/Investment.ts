import mongoose, { Schema, Document } from 'mongoose';
import { Investment as IInvestment, InvestmentPlan, InvestmentStatus } from '@investment-bot/shared';

export interface InvestmentDocument extends Omit<IInvestment, 'id'>, Document {
  _id: string;
}

const investmentSchema = new Schema<InvestmentDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    plan: {
      type: String,
      required: true,
      enum: Object.values(InvestmentPlan),
    },
    interestRate: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalReturn: {
      type: Number,
      required: true,
      min: 0,
    },
    earnedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(InvestmentStatus),
      default: InvestmentStatus.ACTIVE,
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
investmentSchema.index({ userId: 1 });
investmentSchema.index({ status: 1 });
investmentSchema.index({ plan: 1 });
investmentSchema.index({ startDate: 1 });
investmentSchema.index({ endDate: 1 });
investmentSchema.index({ createdAt: -1 });
investmentSchema.index({ userId: 1, status: 1 });

// Pre-save middleware to calculate end date and total return
investmentSchema.pre('save', function (next) {
  if (this.isNew) {
    // Calculate end date based on duration
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + this.duration);
    this.endDate = endDate;
    
    // Calculate total return based on plan and interest rate
    switch (this.plan) {
      case InvestmentPlan.DAILY:
        // Daily compound interest
        this.totalReturn = this.amount * Math.pow(1 + (this.interestRate / 100), this.duration);
        break;
      case InvestmentPlan.WEEKLY:
        // Weekly compound interest
        const weeks = Math.floor(this.duration / 7);
        this.totalReturn = this.amount * Math.pow(1 + (this.interestRate / 100), weeks);
        break;
      case InvestmentPlan.MONTHLY:
        // Monthly compound interest
        const months = Math.floor(this.duration / 30);
        this.totalReturn = this.amount * Math.pow(1 + (this.interestRate / 100), months);
        break;
      case InvestmentPlan.QUARTERLY:
        // Quarterly compound interest
        const quarters = Math.floor(this.duration / 90);
        this.totalReturn = this.amount * Math.pow(1 + (this.interestRate / 100), quarters);
        break;
      default:
        this.totalReturn = this.amount;
    }
  }
  
  next();
});

// Static methods
investmentSchema.statics.findActiveByUser = function (userId: string) {
  return this.find({ userId, status: InvestmentStatus.ACTIVE });
};

investmentSchema.statics.findCompletedByUser = function (userId: string) {
  return this.find({ userId, status: InvestmentStatus.COMPLETED });
};

investmentSchema.statics.findByPlan = function (plan: InvestmentPlan) {
  return this.find({ plan });
};

investmentSchema.statics.findExpiredInvestments = function () {
  return this.find({
    status: InvestmentStatus.ACTIVE,
    endDate: { $lte: new Date() },
  });
};

investmentSchema.statics.getTotalInvestmentsByUser = function (userId: string) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$userId',
        totalAmount: { $sum: '$amount' },
        totalEarned: { $sum: '$earnedAmount' },
        activeInvestments: {
          $sum: { $cond: [{ $eq: ['$status', InvestmentStatus.ACTIVE] }, 1, 0] },
        },
        completedInvestments: {
          $sum: { $cond: [{ $eq: ['$status', InvestmentStatus.COMPLETED] }, 1, 0] },
        },
      },
    },
  ]);
};

// Virtual for profit calculation
investmentSchema.virtual('profit').get(function (this: InvestmentDocument) {
  return this.earnedAmount;
});

// Virtual for remaining days
investmentSchema.virtual('remainingDays').get(function (this: InvestmentDocument) {
  if (this.status !== InvestmentStatus.ACTIVE) return 0;
  const now = new Date();
  const remainingTime = this.endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));
});

// Virtual for progress percentage
investmentSchema.virtual('progressPercentage').get(function (this: InvestmentDocument) {
  const now = new Date();
  const totalDuration = this.endDate.getTime() - this.startDate.getTime();
  const elapsed = now.getTime() - this.startDate.getTime();
  const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  return Math.round(progress * 100) / 100; // Round to 2 decimal places
});

// Ensure virtual fields are serialized
investmentSchema.set('toJSON', { virtuals: true });

export const Investment = mongoose.model<InvestmentDocument>('Investment', investmentSchema);