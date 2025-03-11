import express from 'express';
import { createComment, deleteComment, getComments } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Fix by explicitly asserting the request handler type
router.post('/create', authMiddleware ,createComment );
router.delete('/delete/:id', authMiddleware ,deleteComment );
router.get('/get/:blogId',getComments);


export default router;
