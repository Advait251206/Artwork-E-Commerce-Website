import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service.js';
import { sendSuccess } from '../../utils/response.js';

export async function getArtists(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = await userService.getArtists(page, limit);
    // Explicitly pass data then message, then status, then meta
    sendSuccess(res, result.artists, 'Artists retrieved successfully', 200, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getArtistById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const artist = await userService.getArtistById(req.params.id);
    sendSuccess(res, artist, 'Artist retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const user = await userService.updateProfile(userId, req.body);
    sendSuccess(res, user, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const { currentPassword, newPassword } = req.body;
    await userService.updatePassword(userId, currentPassword, newPassword);
    sendSuccess(res, null, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
}
