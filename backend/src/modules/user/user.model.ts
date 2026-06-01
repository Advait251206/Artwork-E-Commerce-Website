import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'artist' | 'buyer' | 'admin';
  authProvider: 'local' | 'google';
  tokenVersion: number;
  penName?: string;
  username?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['artist', 'buyer', 'admin'], default: 'buyer' },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    tokenVersion: { type: Number, default: 0 },
    penName: { type: String, trim: true },
    username: { type: String, trim: true, lowercase: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre(/^find/, function (this: mongoose.Query<unknown, unknown>) {
  const query = this.getQuery();
  if (!query.includeDeleted) {
    this.where({ isDeleted: false });
  }
  delete query.includeDeleted;
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
