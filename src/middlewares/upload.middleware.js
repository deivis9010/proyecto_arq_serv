const upload = require('../config/multer.config');

/**
 * Middleware para manejar tanto JSON como multipart/form-data
 * Detecta automáticamente el tipo de contenido y aplica multer solo cuando es necesario
 */
const handleUserCreation = (req, res, next) => {
    // Si es multipart/form-data, usar multer
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
        upload.single('avatar')(req, res, next);
    } else {
        // Si es JSON, continuar sin multer
        next();
    }
};

module.exports = {
    handleUserCreation
};
