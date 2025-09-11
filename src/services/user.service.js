const User = require('../models/user.model');
const HttpError = require('../models/error.model');

const createUser = async (userData) => {
    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
        
        throw error;
    }
};

const fetchAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new HttpError('500', 'Error retrieving data');
    }
};

const getUserById = async (userId) => {
    // Propagar errores originales al middleware centralizado
    const user = await User.findById(userId);
    if (!user) {
        throw new HttpError('404', 'Resource not found');
    }
    return user;
};

const activateUser = async (userId) => {
    const user = await User.findByIdAndUpdate(userId, { active: true }, { new: true });
    if (!user) {
        throw new HttpError('404', 'Resource not found');
    }
    return user;
};

module.exports = {
    createUser,
    fetchAllUsers,
    getUserById,
    activateUser
};
