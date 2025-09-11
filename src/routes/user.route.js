const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.get('/', authMiddleware.authenticateToken, userController.fetchAllUsers);
router.post('/', uploadMiddleware.handleUserCreation, userController.createUser);
router.patch('/:id/activate', userController.activateUser);

module.exports = router;
