const userService = require('../services/user.service');    

const createUser = async (req, res, next) => {
    try {
        // Agregar información del avatar si se subió un archivo
        const userData = { ...req.body };
        if (req.file) {
            userData.avatar = req.file.filename;
        }
        
        const newUser = await userService.createUser(userData);
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

const activateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const activatedUser = await userService.activateUser(userId);
        res.status(200).json(activatedUser);
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
}


module.exports = {
    createUser,
    fetchAllUsers,
    activateUser
};
