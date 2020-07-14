require('console.table');
const fetch = require('node-fetch');
const inquirer = require('inquirer');
const paths = require('../utils/paths')
const { getData, getSingleDataRow } = require('../utils/getData')

class Employee {
    static async viewEmployees() {
        // get employee data
        const employeeData = await getData(paths.getEmployees);
        // display data
        console.table(employeeData);
        return employeeData;
    }

    static async viewEmployeesByManager() {
        // get all employees listed as a manager
        const managerData = await getData(paths.getManagers)


        // push managers into choices array
        const choices = []
        managerData.forEach(element => {
            if (element.manager) {
                choices.push(element.manager)
            }
        });
        // get user input on manager to search by
        const { manager } = await inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'search by which manager?',
                choices: choices,
                filter: input => {
                    return managerData.filter(managerObj => {
                        if (managerObj.manager === input) {
                            return managerObj;
                        }
                    });
                }
            }
        ])

        // get employee info
        const path = paths.getEmployeeByManager.replace(':id', manager[0].id)
        const employeeData = await getData(path)

        // display employees
        console.table(employeeData)
    }

    static async viewEmployeesByDepartment() {
        // get department data
        const departmentData = await getData(paths.getDepartments)

        // populate department choices
        const choices = []
        departmentData.forEach(element => {
            choices.push(element.department)
        });

        // get department from user
        const { department } = await inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'search by which department?',
                choices: choices,
                filter: input => {
                    return departmentData.filter(departmentObj => {
                        if (input === departmentObj.department) {
                            return departmentObj;
                        }
                    });
                }
            }
        ])

        // search by department
        const path = paths.getEmployeeByDepartment.replace(':id', department[0].id)
        const employeeData = await getData(path)

        // display results
        console.table(employeeData);
    }

    static async addEmployee() {
        // get data for roles and employees
        const [roleData, employeeData] = await Promise.allSettled([getData(paths.getRoles), getData(paths.getAll)])

        // populate the choices arrays
        const roleChoices = []
        const managerChoices = ['None']
        roleData.value.forEach(element => {
            roleChoices.push(element.title)
        });
        employeeData.value.forEach(element => {
            managerChoices.push(`${element.first_name} ${element.last_name}`)
        });

        // get user input
        let { firstName, lastName, role, manager } = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'what is their first name?',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'what is their last name?',
            },
            {
                type: 'list',
                name: 'role',
                message: 'what is their role?',
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager',
                message: 'who is their manager?',
                choices: managerChoices
            }
        ])

        // set the role and manager strings to the respective id's
        employeeData.value.forEach(element => {
            if (manager === `${element.first_name} ${element.last_name}`) {
                manager = element.id
            }
            if (role === element.title) {
                role = element.role_id
            }
        })

        // if user selected 'None', set value of manager to null
        if (manager === 'None') {
            manager = null;
        }

        // post employee object to the database
        const postResponse = await fetch(paths.addEmployee, {
            method: 'POST',
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                role_id: role,
                manager_id: manager
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        // display response
        if (postResponse.ok) {
            console.log('The employee was successfully added.')
        } else {
            throw postResponse
        }
    }

    static async updateEmployeeRole() {
        // get the id of the employee to update
        const [employee, rolesData] = await Promise.allSettled([getSingleDataRow('employee'), getData(paths.getRoles)])

        // populate the choices array
        const choices = []
        rolesData.value.forEach(role => {
            choices.push(role.title)
        });

        // get user input
        const { role } = await inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'choose a new role',
                choices: choices,
                filter: input => {
                    return rolesData.value.filter(roleObj => {
                        if (input === roleObj.title) {
                            return roleObj;
                        }
                    });
                }
            }
        ])

        // update employee's role_id in the database
        const path = paths.updateEmployeeRole.replace(':id', employee.value.id)
        const response = await fetch(path, {
            method: 'PUT',
            body: JSON.stringify({
                role_id: role[0].id
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        // display response
        if (response.ok) {
            console.log("The employee's role was successfully changed.")
        } else {
            throw response
        }
    }

    static async updateEmployeeManager() {
        // get the id of the employee to update
        const [employee, employeesData] = await Promise.allSettled([getSingleDataRow('employee'), getData(paths.getAll)])

        // populate the choices array
        const choices = ['None']
        employeesData.value.forEach(employeeObj => {
            choices.push(`${employeeObj.first_name} ${employeeObj.last_name}`)
        });

        // get user input
        const { manager } = await inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'choose a new manager',
                choices: choices,
                filter: input => {
                    if (input === 'None') {
                        return [{ id: null }]
                    }
                    return employeesData.value.filter(employeeObj => {
                        if (input === `${employeeObj.first_name} ${employeeObj.last_name}`) {
                            return employeeObj;
                        }
                    });
                }
            }
        ])

        // update the employee's manager_id in the database
        const path = paths.updateEmployeeManager.replace(':id', employee.value.id)
        const response = await fetch(path, {
            method: 'PUT',
            body: JSON.stringify({
                manager_id: manager[0].id
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        // display response
        if (response.ok) {
            console.log("The employee's manager was successfully changed.")
        } else {
            throw response
        }
    }

    static async deleteEmployee() {
        // get the employee to delete
        const employee = await getSingleDataRow('employee');

        // delete the employee from the database
        const path = paths.deleteEmployee.replace(':id', employee.id)
        const response = await fetch(path, {
            method: 'DELETE'
        })

        // display the response
        if (response.ok) {
            console.log('Employee was successfully deleted.')
        } else {
            throw response
        }
    }
}

module.exports = Employee;