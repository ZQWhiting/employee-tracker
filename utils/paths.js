const paths = {
    getEmployees: 'http://localhost:3001/api/employees',
    getManagers: 'http://localhost:3001/api/employees/managers/',
    getEmployeeByManager: 'http://localhost:3001/api/employees/manager/:id',
    getEmployeeByDepartment: 'http://localhost:3001/api/employees/department/:id',
    addEmployee: 'http://localhost:3001/api/employee',
    updateEmployeeRole: 'http://localhost:3001/api/employee/:id/role',
    updateEmployeeManager: 'http://localhost:3001/api/employee/:id/manager',
    deleteEmployee: 'http://localhost:3001/api/employee/:id',

    getRoles: 'http://localhost:3001/api/roles',
    addRole: 'http://localhost:3001/api/role',
    deleteRole: 'http://localhost:3001/api/role/:id',

    getDepartments: 'http://localhost:3001/api/departments',
    getDepartmentBudget: 'http://localhost:3001/api/departments/:id/salary',
    addDepartment: 'http://localhost:3001/api/department',
    deleteDepartment: 'http://localhost:3001/api/department/:id'
}

module.exports = paths