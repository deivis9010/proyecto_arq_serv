const express = require('express');
const app = express();
const employeeRoutes = require('./routes/employees.routes');

// Middlewares
app.use(express.json());
app.use('/api/employees', employeeRoutes);

// Rutas
app.get('/api', (req, res) => {
    res.send('La API está funcionando!!');
});




module.exports = app;