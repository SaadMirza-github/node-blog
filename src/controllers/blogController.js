const Blog = require('../models/blog');
// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags, categories } = req.body;
    const author = req.user._id;  // Assuming the author is the logged-in user

    const newBlog = new Blog({
      title,
      content,
      author,
      tags,
      categories,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json({ message: 'Blog post created successfully', blog: savedBlog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog post', error });
  }
};

// Get all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name email');  // Populate author details
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts', error });
  }
};

// Get a single blog post by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error });
  }
};

// Update a blog post by ID
exports.updateBlogById = async (req, res) => {
  try {
    const { title, content, tags, categories } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, categories, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post updated successfully', blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post', error });
  }
};

// Delete a blog post by ID
exports.deleteBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post', error });
  }
};
