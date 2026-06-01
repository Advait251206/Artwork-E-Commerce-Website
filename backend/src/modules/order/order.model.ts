import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrderItem {
  artworkId: Types.ObjectId;
  title: string;
  price: number;
  currency: string;
  thumbnailUrl: string;
  artistId: Types.ObjectId;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  idempotencyKey?: string;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        artworkId: { type: Schema.Types.ObjectId, ref: 'Artwork', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        currency: { type: String, required: true },
        thumbnailUrl: { type: String, default: '' },
        artistId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], default: 'PENDING' },
    idempotencyKey: { type: String, sparse: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1 });

export default mongoose.model<IOrder>('Order', orderSchema);
