import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser } from '@investment-bot/shared';
import { generateReferralCode, generateWalletAddress } from '@investment-bot/shared';

export interface UserDocument extends Omit<IUser, 'id'>, Document {
  _id: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    telegramId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Invalid email format',
      },
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
    },
    referredBy: {
      type: String,
      ref: 'User',
    },
    totalInvested: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    referralEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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
userSchema.index({ createdAt: -1 });
userSchema.index({ isActive: 1 });

// Pre-save middleware to generate referral code and wallet address
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Generate unique referral code
    if (!this.referralCode) {
      let referralCode: string;
      let isUnique = false;
      
      while (!isUnique) {
        referralCode = generateReferralCode(8);
        const existingUser = await User.findOne({ referralCode });
        if (!existingUser) {
          this.referralCode = referralCode;
          isUnique = true;
        }
      }
    }
    
    // Generate wallet address if not provided
    if (!this.walletAddress) {
      this.walletAddress = generateWalletAddress();
    }
  }
  
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // Since we're using Telegram auth, we don't store passwords
  // This method is kept for future compatibility
  return Promise.resolve(false);
};

// Static methods
userSchema.statics.findByTelegramId = function (telegramId: number) {
  return this.findOne({ telegramId });
};

userSchema.statics.findByReferralCode = function (referralCode: string) {
  return this.findOne({ referralCode: referralCode.trim() });
};

userSchema.statics.getActiveUsers = function () {
  return this.find({ isActive: true });
};

// Virtual for full name
userSchema.virtual('fullName').get(function (this: UserDocument) {
  return this.lastName ? `${this.firstName} ${this.lastName}` : this.firstName;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

export const User = mongoose.model<UserDocument>('User', userSchema);