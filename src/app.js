const express = require('express');

const connectDB = require('./config/database');

const app = express();
// Conectar a la base de datos
connectDB();

// Importar rutas
const employeeRoutes = require('./routes/employees.routes');
const postsRoutes = require('./routes/posts.routes');



// Middlewares
app.use(express.json());


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

// Middleware de manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

module.exports = app;