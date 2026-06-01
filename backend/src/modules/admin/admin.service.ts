import User from '../user/user.model.js';
import Artwork from '../artwork/artwork.model.js';
import Order from '../order/order.model.js';
import { AppError } from '../../utils/AppError.js';

export async function listUsers() {
  return User.find().select('-password');
}

export async function listArtworks(queryParams: Record<string, string>) {
  const { applyQueryParams, buildPaginationMeta } = await import('../../utils/queryBuilder.js');
  const baseQuery = Artwork.find().populate('artist', 'name');
  const { query, page, limit } = applyQueryParams(baseQuery, queryParams);

  const [artworks, total] = await Promise.all([
    query.exec(),
    Artwork.countDocuments({ isDeleted: false }),
  ]);

  return { artworks, pagination: buildPaginationMeta(page, limit, total) };
}

export async function updateUserRole(userId: string, role: string) {
  const user = await User.findById(userId);
  if (!user) throw AppError.notFound('User not found');
  user.role = role as 'artist' | 'buyer' | 'admin';
  await user.save();
  return user;
}

export async function moderateArtwork(artworkId: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) {
  const artwork = await Artwork.findById(artworkId);
  if (!artwork) throw AppError.notFound('Artwork not found');
  artwork.status = status;
  if (rejectionReason !== undefined) {
    artwork.rejectionReason = rejectionReason;
  }
  await artwork.save();
  return artwork;
}

export async function getDashboardStats() {
  const [totalUsers, totalArtworks, pendingArtworks, totalOrders] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    Artwork.countDocuments({ isDeleted: false }),
    Artwork.countDocuments({ status: 'PENDING', isDeleted: false }),
    Order.countDocuments(),
  ]);

  return { totalUsers, totalArtworks, pendingArtworks, totalOrders };
}
