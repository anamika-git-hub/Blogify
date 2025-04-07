import Post from '../models/Post.js';
import { cloudinary } from '../utils/cloudinaryConfig.js';
import dotenv from 'dotenv';

dotenv.config();

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Get the image URL from Cloudinary (multer-storage-cloudinary puts the path in req.file)
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
    
    // Find the existing post
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    // Process new image if uploaded
    let imageUrl = post.image; // Keep existing image by default
    
    if (req.file) {
      // If there's a new file, get its Cloudinary url
      imageUrl = req.file.path;
      
      // Delete old image from Cloudinary if it exists
      if (post.image) {
        try {
          // Extract the public_id from the Cloudinary URL
          const publicId = post.image.split('/').pop().split('.')[0];
          // Include the folder if you specified one in the Cloudinary storage config
          const folderWithPublicId = `blog_uploads/${publicId}`;
          
          await cloudinary.uploader.destroy(folderWithPublicId);
        } catch (err) {
          console.error('Error deleting old image from Cloudinary:', err);
          // Continue with update even if old image deletion fails
        }
      }
    }
    
    // Update the post
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
