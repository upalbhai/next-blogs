import express from 'express';
import { google, logout } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Fix by explicitly asserting the request handler type
router.post('/google', google );
router.post('/logout',authMiddleware,logout );

export default router;
