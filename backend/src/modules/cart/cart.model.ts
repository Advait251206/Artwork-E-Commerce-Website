import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICartItem {
  artwork: Types.ObjectId;
  addedAt: Date;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
}

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        artwork: { type: Schema.Types.ObjectId, ref: 'Artwork', required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<ICart>('Cart', cartSchema);
