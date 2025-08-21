const express = require('express');
const router = express.Router();
const employeesController = require("../controllers/employees.controller.js");

router.get('/', employeesController.getAllEmployees);

module.exports = router;