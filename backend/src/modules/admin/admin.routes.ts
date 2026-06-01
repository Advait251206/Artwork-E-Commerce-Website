import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/users', adminController.listUsers);
router.get('/artworks', adminController.listArtworks);
router.patch('/users/:id/role', adminController.updateRole);
router.patch('/artworks/:id/status', adminController.moderateArtwork);
router.get('/stats', adminController.stats);

export default router;
