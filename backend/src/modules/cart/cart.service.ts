import Cart from './cart.model.js';
import Artwork from '../artwork/artwork.model.js';
import { AppError } from '../../utils/AppError.js';

export async function getCart(userId: string) {
  let cart = await Cart.findOne({ user: userId }).populate('items.artwork', 'title price currency images.thumbnail artist');
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

export async function addItem(userId: string, artworkId: string) {
  const artwork = await Artwork.findById(artworkId);
  if (!artwork || artwork.status !== 'APPROVED') throw AppError.notFound('Artwork not found or not approved');

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });

  const exists = cart.items.some((item) => item.artwork.toString() === artworkId);
  if (exists) throw AppError.conflict('Item already in cart');

  cart.items.push({ artwork: artwork._id, addedAt: new Date() });
  await cart.save();
  return cart;
}

export async function removeItem(userId: string, artworkId: string) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw AppError.notFound('Cart not found');

  cart.items = cart.items.filter((item) => item.artwork.toString() !== artworkId);
  await cart.save();
  return cart;
}

export async function clearCart(userId: string) {
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });
}
