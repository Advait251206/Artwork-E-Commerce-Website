import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IArtwork extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  currency: string;
  artist: Types.ObjectId;
  category: string;
  tags: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  images: {
    thumbnail: string;
    preview: string;
    watermarked: string;
    original: string;
  };
  dimensions?: { width: number; height: number; unit: string };
  medium?: string;
  sellingType: 'fixed' | 'auction';
  auctionEndAt?: Date;
  bids: { user: Types.ObjectId; amount: number; createdAt: Date }[];
  isDeleted: boolean;
  isEdited: boolean;
  deletedAt?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

const artworkSchema = new Schema<IArtwork>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    artist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, default: 'other' },
    tags: [{ type: String }],
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    rejectionReason: { type: String },
    images: {
      thumbnail: { type: String, default: '' },
      preview: { type: String, default: '' },
      watermarked: { type: String, default: '' },
      original: { type: String, default: '' },
    },
    dimensions: {
      width: Number,
      height: Number,
      unit: { type: String, default: 'px' },
    },
    medium: String,
    sellingType: { type: String, enum: ['fixed', 'auction'], default: 'fixed' },
    auctionEndAt: { type: Date },
    bids: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        amount: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

artworkSchema.index({ title: 'text', description: 'text' });
artworkSchema.index({ artist: 1, createdAt: -1 });
artworkSchema.index(
  { status: 1, isDeleted: 1, createdAt: -1 },
  { partialFilterExpression: { isDeleted: false } },
);

artworkSchema.pre(/^find/, function (this: mongoose.Query<unknown, unknown>) {
  const query = this.getQuery();
  if (!query.includeDeleted) {
    this.where({ isDeleted: false });
  }
  delete query.includeDeleted;
});

export default mongoose.model<IArtwork>('Artwork', artworkSchema);
