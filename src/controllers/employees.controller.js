const employeeDataService= require("../services/data.services.js");

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeDataService.getAllEmployees();
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
