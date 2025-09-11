// Cargar datos usando require (solo lectura inicial)
let employees = require('../dataSource/employees.json');


console.log(`Cargados ${employees.length} empleados`);

// Obtener todos los empleados
const getAllEmployees = async (params={}, limit = 2) => {
    
    let filteredEmployees = [...employees];
    
    // Filtrar por usuarios de tipo user
    if (params.user) {
        if (params.user === 'true') {
            filteredEmployees = filteredEmployees.filter(emp => emp.privileges && emp.privileges.trim() === "user");
        } else {
            filteredEmployees = filteredEmployees.filter(emp => emp.privileges && emp.privileges.trim() !== "user");
        }
    }

    // Filtrar por badges
    if (params.badges) {
        filteredEmployees = filteredEmployees.filter(emp => emp.badges && emp.badges.includes(params.badges));
        
    }
    
    console.log('Empleados filtrados:', filteredEmployees.length);

    if (params.page === 0)
        return filteredEmployees;
    const start = (params.page - 1) * limit;
    const end = start + limit;
    return filteredEmployees.slice(start, end);
};


//Empleado mas viejo
const getOldestEmployee = async () => {
    if (employees.length === 0) return null;
    
    return employees.reduce((oldest, emp) => 
        (emp.age > oldest.age ? emp : oldest), employees[0]);
};


// Crear nuevo empleado (solo en memoria)
const createEmployee = async (employeeData) => {
    
    // Validar estructura
    const validation = validateEmployeeStructure(employeeData);
    
    if (!validation.isValid) {
        throw new Error(validation.message);
    }    
    employees.push(employeeData);    
    
    return employeeData;
};

// Validar estructura de empleado
const validateEmployeeStructure = (employeeData) => {
    const requiredFields = ['name', 'age', 'phone', 'privileges', 'favorites', 'finished', 'badges', 'points'];
    
    // Verificar campos requeridos
    for (const field of requiredFields) {
        if (!(field in employeeData)) {
            return { isValid: false, message: `Required field missing: ${field}` };
        }
    }
    
    // Validar tipos específicos
    if (typeof employeeData.name !== 'string') {
        return { isValid: false, message: 'Invalid data type for name' };
    }
    
    if (typeof employeeData.age !== 'number') {
        return { isValid: false, message: 'Invalid data type for age' };
    }
    
    if (typeof employeeData.phone !== 'object' || !employeeData.phone.personal || !employeeData.phone.work) {
        return { isValid: false, message: 'phone debe tener personal y work' };
    }
    
    if (typeof employeeData.privileges !== 'string') {
        return { isValid: false, message: 'privileges debe ser string' };
    }
    
    if (typeof employeeData.favorites !== 'object' || !employeeData.favorites.artist || !employeeData.favorites.food) {
        return { isValid: false, message: 'favorites debe tener artist y food' };
    }
    
    if (!Array.isArray(employeeData.finished)) {
        return { isValid: false, message: 'finished debe ser array' };
    }
    
    if (!Array.isArray(employeeData.badges)) {
        return { isValid: false, message: 'badges debe ser array' };
    }
    
    if (!Array.isArray(employeeData.points)) {
        return { isValid: false, message: 'points debe ser array' };
    }
    
    return { isValid: true };
};


const getEmployeeByName = async (name) => {
    return employees.find(emp => emp.name && emp.name.trim().toLowerCase() === name.trim().toLowerCase());
};

module.exports = {
    getAllEmployees,          
    getOldestEmployee,
    createEmployee,
    getEmployeeByName
};