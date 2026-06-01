import User, { IUser } from './user.model.js';
import { AppError } from '../../utils/AppError.js';
import { buildPaginationMeta } from '../../utils/queryBuilder.js';

export async function getArtists(page = 1, limit = 20) {
  const query = { role: 'artist', isDeleted: false };
  const total = await User.countDocuments(query);
  const artists = await User.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-password -tokenVersion');

  return { artists, meta: buildPaginationMeta(page, limit, total) };
}

export async function getArtistById(id: string) {
  const artist = await User.findOne({ _id: id, role: 'artist', isDeleted: false })
    .select('-password -tokenVersion -email -authProvider -isDeleted -deletedAt -updatedBy');
    
  if (!artist) {
    throw new AppError('Artist not found', 404);
  }
  
  return artist;
}

export async function updateProfile(userId: string, data: Partial<IUser>) {
  // Prevent restricted fields from being updated directly via this route
  const { role, email, password, tokenVersion, _id, authProvider, isDeleted, deletedAt, createdBy, updatedBy, ...allowedData } = data as any;
  
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: allowedData },
    { new: true, runValidators: true }
  ).select('-password -tokenVersion');
  
  if (!user) throw new AppError('User not found', 404);
  return user;
}

export async function updatePassword(userId: string, currentPass: string, newPass: string) {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('User not found', 404);

  if (user.authProvider !== 'local') {
    throw new AppError('Users via OAuth cannot change password here', 400);
  }

  const isValid = await user.comparePassword(currentPass);
  if (!isValid) throw new AppError('Invalid current password', 401);

  user.password = newPass;
  user.tokenVersion += 1; // Invalidate existing refresh tokens if we enforce version checking
  await user.save();
  return user;
}
