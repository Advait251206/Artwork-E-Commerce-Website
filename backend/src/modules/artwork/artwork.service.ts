import Artwork, { IArtwork } from './artwork.model.js';
import { AppError } from '../../utils/AppError.js';
import { applyQueryParams, buildPaginationMeta } from '../../utils/queryBuilder.js';

export async function createArtwork(data: Partial<IArtwork> & { auctionDuration?: number }, artistId: string) {
  if (data.sellingType === 'auction' && data.auctionDuration) {
    const endAt = new Date();
    endAt.setHours(endAt.getHours() + data.auctionDuration);
    data.auctionEndAt = endAt;
  }
  return Artwork.create({ ...data, artist: artistId, createdBy: artistId });
}

export async function listApprovedArtworks(queryParams: Record<string, string>) {
  const filter: any = { status: 'APPROVED' };
  if (queryParams.artist) {
    filter.artist = queryParams.artist;
  }

  const baseQuery = Artwork.find(filter).populate('artist', 'name');
  const { query, page, limit } = applyQueryParams(baseQuery, queryParams);

  const [artworks, total] = await Promise.all([
    query.exec(),
    Artwork.countDocuments({ ...filter, isDeleted: false }),
  ]);

  return { artworks, pagination: buildPaginationMeta(page, limit, total) };
}

export async function listMyArtworks(artistId: string, queryParams: Record<string, string>) {
  const baseQuery = Artwork.find({ artist: artistId }).populate('artist', 'name');
  const { query, page, limit } = applyQueryParams(baseQuery, queryParams);

  const [artworks, total] = await Promise.all([
    query.exec(),
    Artwork.countDocuments({ artist: artistId, isDeleted: false }),
  ]);

  return { artworks, pagination: buildPaginationMeta(page, limit, total) };
}

export async function searchArtworks(searchTerm: string, queryParams: Record<string, string>) {
  const filter: Record<string, unknown> = { status: 'APPROVED' };
  if (searchTerm) filter.$text = { $search: searchTerm };

  const baseQuery = Artwork.find(filter).populate('artist', 'name');
  const { query, page, limit } = applyQueryParams(baseQuery, queryParams);

  const [artworks, total] = await Promise.all([
    query.exec(),
    Artwork.countDocuments({ ...filter, isDeleted: false }),
  ]);

  return { artworks, pagination: buildPaginationMeta(page, limit, total) };
}

export async function getArtworkById(id: string) {
  const artwork = await Artwork.findById(id)
    .populate('artist', 'name')
    .populate('bids.user', 'name');
  if (!artwork) throw AppError.notFound('Artwork not found');
  return artwork;
}

export async function updateArtwork(id: string, data: Partial<IArtwork> & { auctionDuration?: number }, artistId: string) {
  const artwork = await Artwork.findById(id);
  if (!artwork) throw AppError.notFound('Artwork not found');
  if (artwork.artist.toString() !== artistId) throw AppError.forbidden('Not your artwork');

  // If the artwork was already processed, revert it to PENDING and mark as edited
  if (artwork.status !== 'PENDING') {
    data.status = 'PENDING';
    data.isEdited = true;
  }

  if (data.sellingType === 'auction' && data.auctionDuration) {
    const endAt = new Date();
    endAt.setHours(endAt.getHours() + data.auctionDuration);
    data.auctionEndAt = endAt;
  }

  Object.assign(artwork, data, { updatedBy: artistId });
  await artwork.save();
  return artwork;
}

export async function softDeleteArtwork(id: string, artistId: string) {
  const artwork = await Artwork.findById(id);
  if (!artwork) throw AppError.notFound('Artwork not found');
  if (artwork.artist.toString() !== artistId) throw AppError.forbidden('Not your artwork');

  artwork.isDeleted = true;
  artwork.deletedAt = new Date();
  await artwork.save();
}

export async function placeBid(id: string, userId: string, amount: number) {
  const artwork = await Artwork.findById(id);
  if (!artwork) throw AppError.notFound('Artwork not found');
  if (artwork.status !== 'APPROVED') throw AppError.badRequest('Artwork is not available for bidding');
  if (artwork.sellingType !== 'auction') throw AppError.badRequest('Artwork is not up for auction');
  if (artwork.auctionEndAt && new Date() > artwork.auctionEndAt) {
    throw AppError.badRequest('Auction has ended');
  }

  const currentHighestBid = artwork.bids.length > 0
    ? Math.max(...artwork.bids.map(b => b.amount))
    : artwork.price;

  if (amount <= currentHighestBid) {
    throw AppError.badRequest(`Bid must be higher than ${currentHighestBid}`);
  }

  artwork.bids.push({ user: userId as any, amount, createdAt: new Date() });
  await artwork.save();
  
  return await Artwork.findById(id)
    .populate('artist', 'name')
    .populate('bids.user', 'name');
}
