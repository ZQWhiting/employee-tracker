require('dotenv').config()

let host = process.env.host
if (process.env.port) {
    host = `${process.env.host}:${process.env.port}`
}

const paths = {
    getEmployees: `http://${host}/api/employees`,
    getManagers: `http://${host}/api/employees/managers/`,
    getEmployeeByManager: `http://${host}/api/employees/manager/:id`,
    getEmployeeByDepartment: `http://${host}/api/employees/department/:id`,
    addEmployee: `http://${host}/api/employee`,
    updateEmployeeRole: `http://${host}/api/employee/:id/role`,
    updateEmployeeManager: `http://${host}/api/employee/:id/manager`,
    deleteEmployee: `http://${host}/api/employee/:id`,

    getRoles: `http://${host}/api/roles`,
    addRole: `http://${host}/api/role`,
    deleteRole: `http://${host}/api/role/:id`,

    getDepartments: `http://${host}/api/departments`,
    getDepartmentBudget: `http://${host}/api/departments/:id/salary`,
    addDepartment: `http://${host}/api/department`,
    deleteDepartment: `http://${host}/api/department/:id`
}

module.exports = paths