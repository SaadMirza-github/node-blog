const Blog = require('../models/blog');
const fs = require('fs'); // Import fs module to work with the filesystem
const path = require('path'); // Import path module to handle file paths

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags, categories } = req.body;
    const author = req.user.userId;  // Assuming the author is the logged-in user
    const image = req.file ? `/uploads/${req.file.filename}` : null;  // Handle uploaded image

    const newBlog = new Blog({
      title,
      content,
      author,
      tags,
      categories,
      image,
    });
    
    const savedBlog = await newBlog.save();
    res.status(201).json({ message: 'Blog post created successfully', blog: savedBlog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog post', error });
  }
};

// Get all blog posts
exports.getAllBlogs = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find().skip(skip).limit(limit).populate('author', 'name email');  // Populate author details
    // Count the total number of blogs
    const totalBlogs = await Blog.countDocuments();

    // Determine if there are more blogs to load
    const hasMore = (page * limit) < totalBlogs;

    // Send blogs and hasMore flag to client
    res.json({ blogs, hasMore });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts', error });
  }

 
};

// Get a single blog post by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username email');
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
    const image = req.file ? `/uploads/${req.file.filename}` : null;  // Handle uploaded image

    const updateData = {
      title,
      content,
      tags,
      categories,
      updatedAt: Date.now(),
    };

    // Only update image if a new one is uploaded
    if (image) {
      updateData.image = image;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    

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

    // Construct the path to the image
    const imagePath = path.join(__dirname ,  blog.image); // Adjust the path as necessary
    let modifiedPath = imagePath.replace('\\src\\controllers', '');
    // Delete the image file if it exists
    fs.unlink(modifiedPath, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        // If there was an error deleting the image, you may still want to delete the blog
        // You can choose to handle this differently based on your requirements
      }
    });

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post', error });
  }
};
