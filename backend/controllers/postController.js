import Post from '../models/Post.js';
import { cloudinary } from '../utils/cloudinaryConfig.js';
import dotenv from 'dotenv';

dotenv.config();

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const imageUrl = req.file ? req.file.path : null;
    
    const post = new Post({
      title,
      content,
      image: imageUrl,
      author: req.user.id
    });
    
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const postId = req.params.id;
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    let imageUrl = post.image; 
    
    if (req.file) {
      imageUrl = req.file.path;
      
      if (post.image) {
        try {
          const publicId = post.image.split('/').pop().split('.')[0];
          const folderWithPublicId = `blog_uploads/${publicId}`;
          
          await cloudinary.uploader.destroy(folderWithPublicId);
        } catch (err) {
          console.error('Error deleting old image from Cloudinary:', err);
        }
      }
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content, image: imageUrl },
      { new: true }
    );
    
    res.json(updatedPost);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: err.message });
  }
};


export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your posts' });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your posts' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};
