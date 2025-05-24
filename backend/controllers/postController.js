const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    const { type, category, title, description, location, contactInfo } = req.body;

    if (!type || !category || !title || !description || !location) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const post = new Post({
      type,
      category,
      title,
      description,
      location,
      contactInfo,
      user: req.user._id,
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', err });
  }
};


const getAllPosts = async (req, res) => {
  try {
    const { type, category, location, sort } = req.query;

    let filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (location) filter.location = location;

    let query = Post.find(filter).populate('user', 'name');

    // Sort: 'recent' or 'popular'
    if (sort === 'recent') query = query.sort({ createdAt: -1 });
    // Placeholder: for popular, you might later use likes or views
    else if (sort === 'popular') query = query.sort({ createdAt: -1 });

    const posts = await query.exec();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get post' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (user or admin)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post', error: err.message });
  }
};


// @desc    Get logged-in user's posts
// @route   GET /api/posts/my-posts
// @access  Private
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user posts' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  getMyPosts,
};
