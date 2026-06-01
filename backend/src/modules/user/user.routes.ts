import { Router } from 'express';
import * as userController from './user.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import * as userSchema from './user.schema.js';

const router = Router();

// Public routes
router.get('/artists', userController.getArtists);
router.get('/artists/:id', userController.getArtistById);

// Protected routes
router.use(authenticate);

router.put('/profile', validate(userSchema.updateProfileSchema), userController.updateProfile);
router.put('/password', validate(userSchema.updatePasswordSchema), userController.updatePassword);

export default router;
