const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Rutas para posts
router.get('/', authMiddleware.authenticateToken, postsController.getAllPosts);
router.get('/:id', authMiddleware.authenticateToken, postsController.getPostById);
router.post('/', authMiddleware.authenticateToken, postsController.createPost);
router.patch('/:id', authMiddleware.authenticateToken, postsController.updatePostPartially);
router.delete('/:id', authMiddleware.authenticateToken, postsController.deletePost);

module.exports = router;
