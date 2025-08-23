const express = require('express');
const router = express.Router();
const employeesController = require("../controllers/employees.controller.js");

router.get('/', employeesController.getAllEmployees);
router.post('/', employeesController.createEmployee);
router.get('/oldest', employeesController.getOldestEmployee);
router.get('/name/:name', employeesController.getEmployeeByName);

module.exports = router;