import { Request, Response, NextFunction } from 'express';
import * as artworkService from './artwork.service.js';
import { sendSuccess } from '../../utils/response.js';
import cloudinary from '../../config/cloudinary.js';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let images;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const cldRes = await cloudinary.uploader.upload(dataURI, {
        folder: 'artworks',
        resource_type: 'auto',
      });
      images = {
        original: cldRes.secure_url,
        thumbnail: cloudinary.url(cldRes.public_id, { width: 300, crop: 'scale' }),
        preview: cloudinary.url(cldRes.public_id, { width: 800, crop: 'scale' }),
        watermarked: cloudinary.url(cldRes.public_id, { width: 1200, crop: 'scale' }),
      };
    }

    const payload = {
      ...req.body,
      ...(images && { images })
    };

    const artwork = await artworkService.createArtwork(payload, req.userId!);
    sendSuccess(res, artwork, 'Artwork created', 201);
  } catch (err) { next(err); }
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await artworkService.listApprovedArtworks(req.query as Record<string, string>);
    sendSuccess(res, result, 'Artworks retrieved');
  } catch (err) { next(err); }
}

export async function listMine(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await artworkService.listMyArtworks(req.userId!, req.query as Record<string, string>);
    sendSuccess(res, result, 'Your artworks retrieved');
  } catch (err) { next(err); }
}

export async function search(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await artworkService.searchArtworks(
      (req.query.q as string) || '',
      req.query as Record<string, string>,
    );
    sendSuccess(res, result, 'Search results');
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const artwork = await artworkService.getArtworkById(req.params.id);
    sendSuccess(res, artwork, 'Artwork retrieved');
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let images;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const cldRes = await cloudinary.uploader.upload(dataURI, {
        folder: 'artworks',
        resource_type: 'auto',
      });
      images = {
        original: cldRes.secure_url,
        thumbnail: cloudinary.url(cldRes.public_id, { width: 300, crop: 'scale' }),
        preview: cloudinary.url(cldRes.public_id, { width: 800, crop: 'scale' }),
        watermarked: cloudinary.url(cldRes.public_id, { width: 1200, crop: 'scale' }),
      };
    }

    const payload = {
      ...req.body,
      ...(images && { images })
    };

    const artwork = await artworkService.updateArtwork(req.params.id, payload, req.userId!);
    sendSuccess(res, artwork, 'Artwork updated');
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await artworkService.softDeleteArtwork(req.params.id, req.userId!);
    sendSuccess(res, null, 'Artwork deleted');
  } catch (err) { next(err); }
}

export async function placeBid(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const artwork = await artworkService.placeBid(req.params.id, req.userId!, req.body.amount);
    sendSuccess(res, artwork, 'Bid placed successfully');
  } catch (err) { next(err); }
}
