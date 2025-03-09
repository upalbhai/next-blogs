import express from 'express';
import { createBlog, deletePost, editPost, getAllPost, getAllPostForUsers, getPostById, updateStatus } from '../controllers/blogController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-blog',authMiddleware,createBlog);
router.get('/get-all-post',authMiddleware,getAllPost);
router.get('/get-all-posts',getAllPostForUsers);
router.get('/get-post-by-id/:id',getPostById)
router.put('/edit-post/:id',authMiddleware,editPost)
router.put('/update-status/:id',authMiddleware,updateStatus)
router.delete('/delete-post/:id',authMiddleware,deletePost)

export default router;
