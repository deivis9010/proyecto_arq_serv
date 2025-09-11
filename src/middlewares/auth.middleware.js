const jwtService = require('../services/jwt.service');
const HttpError = require('../models/error.model');
const User = require('../models/user.model');

/**
 * Middleware de autenticación JWT
 * Verifica que el token JWT sea válido y que el usuario aún exista en la base de datos
 */
const authenticateToken = async (req, res, next) => {
    // Obtener el token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return next(new HttpError('401', 'Access token required'));
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwtService.verifyToken(token);
        
        // Verificar que el usuario aún existe en la base de datos
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new HttpError('401', 'User no longer exists'));
        }

        // Verificar que el usuario esté activo (opcional)       
        if (user.active === false) {
            return next(new HttpError('401', 'User account deactivated'));
        }

        // Verificar que el token no sea demasiado antiguo comparado con la última actualización del usuario
        if (decoded.tokenCreatedAt) {
            const tokenCreated = new Date(decoded.tokenCreatedAt);
            const userUpdated = new Date(user.updatedAt);
            
            // Si el usuario fue actualizado después de crear el token, invalidar el token
            if (userUpdated > tokenCreated) {
                return next(new HttpError('401', 'Token invalidated due to user changes'));
            }
        }

        // Verificar que el email en el token coincida con el email actual del usuario
        if (decoded.email !== user.email) {
            return next(new HttpError('401', 'Token invalidated due to email change'));
        }

        // Verificar la versión del token (si el usuario cambió su contraseña, los tokens anteriores son inválidos)
        if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
            return next(new HttpError('401', 'Token invalidated due to password change'));
        }

        // Verificar que el token no sea anterior al último cambio de contraseña
        // Agregamos una tolerancia de 5 segundos para evitar problemas de sincronización temporal
        if (decoded.iat && user.lastPasswordChange) {
            const tokenIssuedAt = new Date(decoded.iat * 1000); // iat está en segundos
            const passwordChangeTime = new Date(user.lastPasswordChange.getTime() - 5000); // 5 segundos de tolerancia
            if (tokenIssuedAt < passwordChangeTime) {
                return next(new HttpError('401', 'Token invalidated due to password change'));
            }
        }
        
        // Agregar la información del usuario al request (datos frescos de la BD)
        req.user = {
            id: user._id,
            email: user.email,
            name: user.name,
            active: user.active
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new HttpError('401', 'Token expired'));
        } else if (error.name === 'JsonWebTokenError') {
            return next(new HttpError('401', 'Invalid token'));
        } else {
            return next(new HttpError('401', 'Authentication error'));
        }
    }
};



module.exports = {
    authenticateToken
};
