import express from 'express';
import { createBlog, deletePost, editPost, getAllPost, getAllPostForUsers, getCategories, getFeaturedPosts, getPostById, toggleFeatured, updateStatus } from '../controllers/blogController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/create-blog',authMiddleware,adminMiddleware ,createBlog);
router.get('/get-all-post',authMiddleware,adminMiddleware,getAllPost);
router.get('/get-all-posts',getAllPostForUsers);
router.get('/get-post-by-id/:id',getPostById)
router.put('/edit-post/:id',authMiddleware,adminMiddleware,editPost)
router.put('/update-status/:id',authMiddleware,adminMiddleware,updateStatus)
router.delete('/delete-post/:id',authMiddleware,adminMiddleware,deletePost)
router.get('/feature-post',getFeaturedPosts)
router.put('/feature-post/:id',authMiddleware,adminMiddleware,toggleFeatured);
router.get('/categories',getCategories)

export default router;
