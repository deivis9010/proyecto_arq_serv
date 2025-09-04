const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');

// Rutas para posts
router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPostById);
router.post('/', postsController.createPost);
router.patch('/:id', postsController.updatePostPartially);
router.delete('/:id', postsController.deletePost);

module.exports = router;
