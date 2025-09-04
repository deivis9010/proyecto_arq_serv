const express = require('express');

const connectDB = require('./config/database');
const mongoose = require('mongoose');
const HttpError = require('./models/error.model');
const app = express();
// Conectar a la base de datos
connectDB();

// Importar rutas
const employeeRoutes = require('./routes/employees.route');
const postsRoutes = require('./routes/posts.route');
const userRoutes = require('./routes/user.route');
const loginRoutes = require('./routes/login.route');





// Middlewares
app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err);

    if ( err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: err.errors
        });
    }
    if ( err instanceof HttpError) {
        const status = Number(err.status) || 500;
        return res.status(status).json({
            success: false,
            message: err.message,
            errors: err.errors || null
        });
    }

    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});


// Rutas
app.get('/api', (req, res) => {
    res.json({
        message: 'API funcionando correctamente',
        endpoints: {
            employees: '/api/employees',
            posts: '/api/posts'
        }
    });
});

// Rutas de la API
app.use('/api/employees', employeeRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/login', loginRoutes);

// Middleware de manejo de errores 
app.use((err, req, res, next) => {
    console.error(err);

    if ( err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: err.errors
        });
    }
    if ( err instanceof HttpError) {
        const status = Number(err.status) || 500;
        return res.status(status).json({
            success: false,
            message: err.message,
            errors: err.errors || null
        });
    }

    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Middleware de manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

module.exports = app;