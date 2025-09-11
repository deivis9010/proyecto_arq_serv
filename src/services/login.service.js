const User = require('../models/user.model');
const HttpError = require('../models/error.model');
const jwtService = require('./jwt.service');

const login = async (email, password) => {
    if (!email || !password) {
        throw new HttpError('400', 'Required fields missing');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new HttpError('401', 'Unauthorized');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new HttpError('401', 'Unauthorized');
    }
    if (user.active === false) {
        throw new HttpError('401', 'Unauthorized');
    }

    // Generar JWT con datos del usuario
    const tokenPayload = {
        id: user._id,
        email: user.email,
        name: user.name,
        tokenVersion: user.tokenVersion
    };

    const token = jwtService.generateToken(tokenPayload);

    // Retornar datos del usuario y token
    return {
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    };
};

module.exports = {
    login
};
