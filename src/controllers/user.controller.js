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



module.exports = {
    createUser,
    fetchAllUsers
};
