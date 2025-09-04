const userService = require('../services/user.service');    

const createUser = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const fetchAllUsers = async (req, res) => {
    try {
        const users = await userService.fetchAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

module.exports = {
    createUser,
    fetchAllUsers
};
