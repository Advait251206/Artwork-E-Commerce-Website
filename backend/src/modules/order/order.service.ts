import mongoose from 'mongoose';
import Cart from '../cart/cart.model.js';
import Artwork from '../artwork/artwork.model.js';
import Order from './order.model.js';
import { AppError } from '../../utils/AppError.js';

export async function createOrder(userId: string, idempotencyKey?: string) {
  if (idempotencyKey) {
    const existing = await Order.findOne({ idempotencyKey });
    if (existing) return existing;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.artwork').session(session);
    if (!cart || cart.items.length === 0) throw AppError.badRequest('Cart is empty');

    const orderItems = [];
    let totalAmount = 0;
    let currency = 'USD';

    for (const item of cart.items) {
      const artwork = await Artwork.findById(item.artwork).session(session);
      if (!artwork || artwork.status !== 'APPROVED') {
        throw AppError.badRequest(`Artwork "${item.artwork}" is no longer available`);
      }

      orderItems.push({
        artworkId: artwork._id,
        title: artwork.title,
        price: artwork.price,
        currency: artwork.currency,
        thumbnailUrl: artwork.images.thumbnail,
        artistId: artwork.artist,
      });

      totalAmount += artwork.price;
      currency = artwork.currency;
    }

    const [order] = await Order.create(
      [{ user: userId, items: orderItems, totalAmount, currency, idempotencyKey, createdBy: userId }],
      { session },
    );

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export async function getUserOrders(userId: string) {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
}

export async function getOrderById(orderId: string, userId: string) {
  const order = await Order.findById(orderId);
  if (!order) throw AppError.notFound('Order not found');
  if (order.user.toString() !== userId) throw AppError.forbidden('Not your order');
  return order;
}
