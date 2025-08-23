const employeeDataService= require("../services/employees.services.js");

exports.getAllEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const user = req.query.user;         
        const badges = req.query.badges;
       
        const employees = await employeeDataService.getAllEmployees({ page, user, badges });
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getOldestEmployee = async (req, res) => {
    try {
        const oldestEmployee = await employeeDataService.getOldestEmployee();
        if (oldestEmployee) {
            res.json(oldestEmployee);
        } else {
            res.status(404).json({ message: 'No employees found' });
        }
    } catch (error) {
        console.error('Error fetching oldest employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.createEmployee = async (req, res) => {
    try {
        
        const newEmployee = await employeeDataService.createEmployee(req.body);
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(400).json({ code: "bad_request" });
    }
};

exports.getEmployeeByName = async (req, res) => {
    try {
        const employee = await employeeDataService.getEmployeeByName(req.params.name);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ code: 'not_found' });
        }
    } catch (error) {
        console.error('Error fetching employee by name:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
