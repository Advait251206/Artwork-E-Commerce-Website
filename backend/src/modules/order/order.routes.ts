import { Router } from 'express';
import * as orderController from './order.controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = Router();

router.post('/', authenticate, authorize('buyer'), orderController.create);
router.get('/', authenticate, orderController.list);
router.get('/:id', authenticate, orderController.getById);

export default router;
