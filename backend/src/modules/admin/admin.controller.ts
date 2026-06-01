import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service.js';
import { sendSuccess } from '../../utils/response.js';

export async function listUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await adminService.listUsers();
    sendSuccess(res, users, 'Users retrieved');
  } catch (err) { next(err); }
}

export async function listArtworks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await adminService.listArtworks(req.query as Record<string, string>);
    sendSuccess(res, result, 'Artworks retrieved');
  } catch (err) { next(err); }
}

export async function updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await adminService.updateUserRole(req.params.id, req.body.role);
    sendSuccess(res, user, 'Role updated');
  } catch (err) { next(err); }
}

export async function moderateArtwork(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const artwork = await adminService.moderateArtwork(req.params.id, req.body.status, req.body.rejectionReason);
    sendSuccess(res, artwork, 'Artwork status updated');
  } catch (err) { next(err); }
}

export async function stats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getDashboardStats();
    sendSuccess(res, data, 'Dashboard stats');
  } catch (err) { next(err); }
}
