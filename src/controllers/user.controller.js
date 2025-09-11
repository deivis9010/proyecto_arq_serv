const userService = require('../services/user.service');    

const createUser = async (req, res, next) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};

const fetchAllUsers = async (req, res, next) => {
    try {
        const users = await userService.fetchAllUsers();
        res.status(200).json(users);
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        // req.user viene del middleware de autenticación JWT
        const userId = req.user.id;
        const user = await userService.getUserById(userId);
        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};

module.exports = {
    createUser,
    fetchAllUsers,
    getUserProfile
};
