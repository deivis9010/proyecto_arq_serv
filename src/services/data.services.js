const fs = require('fs').promises;
const path = require('path');

const employeesFilePath = path.join(__dirname, '../dataSource/employees.json');
let employees = [];
let isLoaded = false;

// Cargar datos de forma asíncrona
const loadEmployees = async () => {
    try {
        const data = await fs.readFile(employeesFilePath, 'utf8');
        employees = JSON.parse(data);
        isLoaded = true;
        console.log(`Cargados ${employees.length} empleados`);
    } catch (error) {
        console.error('Error al cargar los empleados:', error);
        employees = [];
    }
};

// Guardar cambios en el archivo
const saveEmployees = async () => {
    try {
        await fs.writeFile(employeesFilePath, JSON.stringify(employees, null, 2));
        console.log('Empleados guardados correctamente');
    } catch (error) {
        console.error('Error al guardar los empleados:', error);
        throw error;
    }
};

// Obtener todos los empleados
const getAllEmployees = async () => {
    if (!isLoaded) await loadEmployees();
    return employees;
};

// Obtener empleado por ID
const getEmployeeById = async (id) => {
    if (!isLoaded) await loadEmployees();
    return employees.find(emp => emp.id === parseInt(id));
};

// Crear nuevo empleado
const createEmployee = async (employeeData) => {
    if (!isLoaded) await loadEmployees();
    
    const newId = employees.length > 0 
        ? Math.max(...employees.map(emp => emp.id)) + 1 
        : 1;
    
    const newEmployee = { id: newId, ...employeeData };
    employees.push(newEmployee);
    await saveEmployees();
    return newEmployee;
};

// Actualizar empleado
const updateEmployee = async (id, employeeData) => {
    if (!isLoaded) await loadEmployees();
    
    const index = employees.findIndex(emp => emp.id === parseInt(id));
    if (index === -1) return null;
    
    employees[index] = { ...employees[index], ...employeeData };
    await saveEmployees();
    return employees[index];
};

// Eliminar empleado
const deleteEmployee = async (id) => {
    if (!isLoaded) await loadEmployees();
    
    const index = employees.findIndex(emp => emp.id === parseInt(id));
    if (index === -1) return null;
    
    const deletedEmployee = employees.splice(index, 1)[0];
    await saveEmployees();
    return deletedEmployee;
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};