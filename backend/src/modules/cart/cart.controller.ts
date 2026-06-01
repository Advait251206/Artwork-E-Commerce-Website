import { Request, Response, NextFunction } from 'express';
import * as cartService from './cart.service.js';
import { sendSuccess } from '../../utils/response.js';

export async function get(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cart = await cartService.getCart(req.userId!);
    sendSuccess(res, cart, 'Cart retrieved');
  } catch (err) { next(err); }
}

export async function addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cart = await cartService.addItem(req.userId!, req.body.artworkId);
    sendSuccess(res, cart, 'Item added to cart');
  } catch (err) { next(err); }
}

export async function removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cart = await cartService.removeItem(req.userId!, req.params.artworkId);
    sendSuccess(res, cart, 'Item removed from cart');
  } catch (err) { next(err); }
}

export async function clear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await cartService.clearCart(req.userId!);
    sendSuccess(res, null, 'Cart cleared');
  } catch (err) { next(err); }
}
