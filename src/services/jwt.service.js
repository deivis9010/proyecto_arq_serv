const jwt = require('jsonwebtoken');



/**
 * Genera un token JWT para un usuario
 * @param {Object} payload - Datos del usuario para incluir en el token
 * @returns {string} Token JWT generado
 */
const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    if (!secret) {
        throw new Error('JWT configuration missing');
    }

    // Agregar timestamp de creación del token para validaciones adicionales
    const tokenPayload = {
        ...payload,
        tokenCreatedAt: new Date().toISOString(),
        iat: Math.floor(Date.now() / 1000) // issued at time
    };

    return jwt.sign(tokenPayload, secret, { expiresIn });
};

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload decodificado del token
 */
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error('JWT configuration missing');
    }

    return jwt.verify(token, secret);
};

/**
 * Decodifica un token JWT sin verificarlo (para debug)
 * @param {string} token - Token JWT a decodificar
 * @returns {Object} Payload decodificado del token
 */
const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};
