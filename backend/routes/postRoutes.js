import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { upload } from '../utils/cloudinaryConfig.js';
import {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getMyPosts,
  getPost
} from '../controllers/postController.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', verifyToken, upload.single('image'), createPost);
router.get('/my-posts', verifyToken, getMyPosts);
router.get('/:id', verifyToken, getPost);
router.put('/:id', verifyToken, upload.single('image'), updatePost);
router.delete('/:id', verifyToken, deletePost);

export default router;