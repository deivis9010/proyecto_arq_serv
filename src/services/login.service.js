const User = require('../models/user.model');
const HttpError = require('../models/error.model');

const login = async (email, password) => {
    if (!email || !password) {
        throw new HttpError('400', 'Email y contraseña son requeridos');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new HttpError('401', 'Credenciales inválidas');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new HttpError('401', 'Credenciales inválidas');
    }

    return user;
};

module.exports = {
    login
};
