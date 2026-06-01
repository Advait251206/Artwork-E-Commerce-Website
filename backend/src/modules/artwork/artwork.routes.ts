import { Router } from 'express';
import * as artworkController from './artwork.controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createArtworkSchema, updateArtworkSchema, placeBidSchema } from './artwork.schema.js';
import { upload } from '../../middleware/upload.js';

const router = Router();

router.get('/', artworkController.list);
router.get('/search', artworkController.search);
router.get('/me', authenticate, authorize('artist'), artworkController.listMine);
router.get('/:id', artworkController.getById);
router.post('/', authenticate, authorize('artist'), upload.single('image'), validate(createArtworkSchema), artworkController.create);
router.post('/:id/bid', authenticate, authorize('buyer'), validate(placeBidSchema), artworkController.placeBid);
router.put('/:id', authenticate, authorize('artist'), upload.single('image'), validate(updateArtworkSchema), artworkController.update);
router.delete('/:id', authenticate, authorize('artist'), artworkController.remove);

export default router;
