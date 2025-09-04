const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


router.get('/', userController.fetchAllUsers);
router.post('/', userController.createUser);

module.exports = router;
