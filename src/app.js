const express = require('express');

const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler.middleware');
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


// Rutas
app.get('/api', (req, res) => {
    res.json({
        message: 'API running successfully',
        endpoints: {
            employees: '/api/employees',
            posts: '/api/posts',
            users: '/api/users',
            login: '/api/login'
        }
    });
});

// Rutas de la API
app.use('/api/employees', employeeRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/login', loginRoutes);

// Middleware de manejo de errores centralizado
app.use(errorHandler);

// Middleware de manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

module.exports = app;