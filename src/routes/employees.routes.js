const express = require('express');
const router = express.Router();
const employeesController = require("../controllers/employees.controller.js");

router.get('/', employeesController.getAllEmployees);
router.get('/oldest', employeesController.getOldestEmployee);
router.post('/', employeesController.createEmployee);
router.get('/:name', employeesController.getEmployeeByName);

module.exports = router;