import { Request, Response, NextFunction } from 'express';
import * as orderService from './order.service.js';
import { sendSuccess } from '../../utils/response.js';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const idempotencyKey = req.headers['idempotency-key'] as string | undefined;
    const order = await orderService.createOrder(req.userId!, idempotencyKey);
    sendSuccess(res, order, 'Order created', 201);
  } catch (err) { next(err); }
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await orderService.getUserOrders(req.userId!);
    sendSuccess(res, orders, 'Orders retrieved');
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await orderService.getOrderById(req.params.id, req.userId!);
    sendSuccess(res, order, 'Order retrieved');
  } catch (err) { next(err); }
}
