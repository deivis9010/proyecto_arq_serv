const User = require('../models/user.model');
const HttpError = require('../models/error.model');

const createUser = async (userData) => {
   
        const user = await User.create(userData);

        if (!user) {
            throw new HttpError('400', 'Error creating user');
        }

        return user;
    };

const fetchAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new HttpError('500', 'Error fetching users');
    }
};

module.exports = {
    createUser,
    fetchAllUsers
};
