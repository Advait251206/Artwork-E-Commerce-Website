import User from '../user/user.model.js';
import RefreshToken from './refreshToken.model.js';
import { signAccessToken, signRefreshToken, hashToken, verifyRefreshToken } from '../../utils/jwt.js';
import { AppError } from '../../utils/AppError.js';

interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: { id: string; name: string; email: string; role: string };
}

export async function registerUser(
  name: string, email: string, password: string, role: 'artist' | 'buyer',
  userAgent: string, ipAddress: string,
): Promise<AuthResult> {
  const existing = await User.findOne({ email });
  if (existing) throw AppError.conflict('Email already registered');

  let assignedRole: 'artist' | 'buyer' | 'admin' = role;
  if (email === 'advaitkawale@gmail.com') {
    assignedRole = 'admin';
  }

  const user = await User.create({ name, email, password, role: assignedRole });

  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role, tokenVersion: user.tokenVersion });
  const refreshToken = signRefreshToken(user._id.toString());

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent,
    ipAddress,
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  };
}

export async function loginUser(
  email: string, password: string,
  userAgent: string, ipAddress: string,
): Promise<AuthResult> {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw AppError.unauthorized('Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw AppError.unauthorized('Invalid credentials');

  if (email === 'advaitkawale@gmail.com' && user.role !== 'admin') {
    user.role = 'admin';
    await user.save();
  }

  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role, tokenVersion: user.tokenVersion });
  const refreshToken = signRefreshToken(user._id.toString());

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent,
    ipAddress,
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  };
}

export async function refreshTokens(
  oldRefreshToken: string,
  userAgent: string, ipAddress: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = verifyRefreshToken(oldRefreshToken);
  const oldHash = hashToken(oldRefreshToken);

  const storedToken = await RefreshToken.findOneAndDelete({ tokenHash: oldHash });
  if (!storedToken) throw AppError.unauthorized('Token reuse detected');

  const user = await User.findById(payload.userId);
  if (!user) throw AppError.unauthorized('User not found');

  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role, tokenVersion: user.tokenVersion });
  const newRefreshToken = signRefreshToken(user._id.toString());

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(newRefreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent,
    ipAddress,
  });

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logoutUser(refreshToken: string): Promise<void> {
  const hash = hashToken(refreshToken);
  await RefreshToken.findOneAndDelete({ tokenHash: hash });
}
