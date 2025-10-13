import mongoose, { Schema, Document } from 'mongoose';
import { Referral as IReferral } from '@investment-bot/shared';

export interface ReferralDocument extends Omit<IReferral, 'id'>, Document {
  _id: string;
}

const referralSchema = new Schema<ReferralDocument>(
  {
    referrerId: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
    },
    referredUserId: {
      type: String,
      required: true,
      ref: 'User',
      unique: true, // Each user can only be referred once
      index: true,
    },
    bonusAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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
referralSchema.index({ referrerId: 1 });
referralSchema.index({ referredUserId: 1 });
referralSchema.index({ isActive: 1 });
referralSchema.index({ createdAt: -1 });
referralSchema.index({ referrerId: 1, isActive: 1 });

// Compound index to prevent duplicate referrals
referralSchema.index({ referrerId: 1, referredUserId: 1 }, { unique: true });

// Static methods
referralSchema.statics.findByReferrer = function (referrerId: string) {
  return this.find({ referrerId, isActive: true }).populate('referredUserId');
};

referralSchema.statics.findActiveReferrals = function (referrerId: string) {
  return this.find({ referrerId, isActive: true });
};

referralSchema.statics.getReferralStats = function (referrerId: string) {
  return this.aggregate([
    { $match: { referrerId, isActive: true } },
    {
      $group: {
        _id: '$referrerId',
        totalReferrals: { $sum: 1 },
        totalBonusEarned: { $sum: '$bonusAmount' },
      },
    },
  ]);
};

referralSchema.statics.getTopReferrers = function (limit: number = 10) {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$referrerId',
        totalReferrals: { $sum: 1 },
        totalBonusEarned: { $sum: '$bonusAmount' },
      },
    },
    { $sort: { totalReferrals: -1, totalBonusEarned: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'referrer',
      },
    },
    { $unwind: '$referrer' },
  ]);
};

referralSchema.statics.getTotalReferralVolume = function () {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalReferrals: { $sum: 1 },
        totalBonusPaid: { $sum: '$bonusAmount' },
      },
    },
  ]);
};

referralSchema.statics.getMonthlyReferralStats = function (startDate?: Date, endDate?: Date) {
  const matchStage: any = { isActive: true };
  
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
        totalReferrals: { $sum: 1 },
        totalBonusPaid: { $sum: '$bonusAmount' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ]);
};

// Pre-save middleware
referralSchema.pre('save', function (next) {
  // Ensure referrer cannot refer themselves
  if (this.referrerId === this.referredUserId) {
    const error = new Error('Users cannot refer themselves');
    return next(error);
  }
  
  next();
});

// Virtual for referral earning rate
referralSchema.virtual('earningRate').get(function (this: ReferralDocument) {
  // This could be dynamically calculated based on business logic
  return 3; // 3% referral bonus
});

// Ensure virtual fields are serialized
referralSchema.set('toJSON', { virtuals: true });

export const Referral = mongoose.model<ReferralDocument>('Referral', referralSchema);