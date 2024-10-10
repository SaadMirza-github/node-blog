const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');  // Optional: for authenticated routes

// Create a new blog post (protected route, requires authentication)
router.post('/', authMiddleware, blogController.createBlog);

// Get all blog posts
router.get('/', blogController.getAllBlogs);

// Get a specific blog post by ID
router.get('/:id', blogController.getBlogById);

// Update a blog post by ID (protected route, requires authentication)
router.put('/:id', authMiddleware, blogController.updateBlogById);

// Delete a blog post by ID (protected route, requires authentication)
router.delete('/:id', authMiddleware, blogController.deleteBlogById);

module.exports = router;
