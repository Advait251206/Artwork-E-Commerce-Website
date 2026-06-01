import { Router } from 'express';
import * as cartController from './cart.controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = Router();

router.get('/', authenticate, cartController.get);
router.post('/items', authenticate, authorize('buyer'), cartController.addItem);
router.delete('/items/:artworkId', authenticate, authorize('buyer'), cartController.removeItem);
router.delete('/', authenticate, authorize('buyer'), cartController.clear);

export default router;
