const mongoose = require('mongoose');
const HttpError = require('../models/error.model');

/**
 * Middleware centralizado para manejo de errores
 * Maneja diferentes tipos de errores de MongoDB, Mongoose y personalizados
 */
const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Manejar error de duplicación de email MongoDB (E11000)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
        return res.status(409).json({
            success: false,
            message: 'Resource already exists',
            error: 'DUPLICATE_EMAIL'
        });
    }

    // Manejar otros errores de duplicación de MongoDB (E11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            success: false,
            message: 'Resource already exists',
            error: 'DUPLICATE_KEY'
        });
    }

    // Manejar errores de validación de Mongoose
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors
        });
    }

    // Manejar errores de cast de Mongoose (IDs inválidos)
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            success: false,
            message: 'Invalid data format',
            error: 'INVALID_ID'
        });
    }

    // Manejar errores de Multer (subida de archivos)
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File too large',
            error: 'FILE_SIZE_LIMIT'
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            success: false,
            message: 'Unexpected file field',
            error: 'UNEXPECTED_FILE'
        });
    }

    if (err.message && err.message.includes('Solo se permiten imágenes')) {
        return res.status(400).json({
            success: false,
            message: 'Invalid file type',
            error: 'INVALID_FILE_TYPE'
        });
    }

    // Manejar errores personalizados HttpError
    if (err instanceof HttpError) {
        
        const status = Number(err.status) || 500;
        
        return res.status(status).json({
            success: false,
            message: err.message,
            errors: err.errors || null
        });
    }

    // Error genérico del servidor
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};

module.exports = errorHandler;
