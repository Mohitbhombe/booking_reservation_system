import express from 'express';
import * as resourceController from '../controllers/resource.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', resourceController.getAllResources);
router.get('/:id', resourceController.getResource);

// Admin only routes
router.use(protect, restrictTo('ADMIN'));

router.post('/', resourceController.createResource);
router.patch('/:id', resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);

export default router;
