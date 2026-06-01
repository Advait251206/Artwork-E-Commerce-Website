import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/v1/auth',
};

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser(
      name, email, password, role,
      req.headers['user-agent'] || '', req.ip || '',
    );
    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
    sendSuccess(res, { accessToken: result.accessToken, user: result.user }, 'Registration successful', 201);
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(
      email, password,
      req.headers['user-agent'] || '', req.ip || '',
    );
    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
    sendSuccess(res, { accessToken: result.accessToken, user: result.user }, 'Login successful');
  } catch (err) { next(err); }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const oldToken = req.cookies?.refreshToken;
    if (!oldToken) { res.status(401).json({ success: false, message: 'No refresh token' }); return; }

    const result = await authService.refreshTokens(
      oldToken,
      req.headers['user-agent'] || '', req.ip || '',
    );
    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
    sendSuccess(res, { accessToken: result.accessToken }, 'Token refreshed');
  } catch (err) { next(err); }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.refreshToken;
    if (token) await authService.logoutUser(token);
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    sendSuccess(res, null, 'Logged out');
  } catch (err) { next(err); }
}
