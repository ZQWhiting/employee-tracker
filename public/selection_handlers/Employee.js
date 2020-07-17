require('console.table');
const fetch = require('node-fetch');
const inquirer = require('inquirer');
const paths = require('../../utils/paths')
const { getData, getSingleDataRow } = require('../../utils/getData');
const { toTitleCaseTrim, createChoicesArray } = require('../../utils/utils');

class Employee {
    static async viewEmployees() {
        // get employee data
        const employeeData = await getData(paths.getEmployees)
            .catch(err => { throw 'No employee data found (required). Please create an employee.' })

        // display data

        console.table(employeeData);
    }

    static async viewEmployeesByManager() {
        // get all employees listed as a manager
        const managerData = await getData(paths.getManagers)
            .catch(err => { throw 'No manager data found (required). Please assign a manager.' })

        // push managers into choices array
        const choices = createChoicesArray(managerData, 'manager')

        // get user input on manager to search by
        const { manager } = await inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'search by which manager?',
                choices: choices
            }
        ])

        // get employee info
        const path = paths.getEmployeeByManager.replace(':id', manager)
        const employeeData = await getData(path)

        // display employees
        console.table(employeeData)
    }

    static async viewEmployeesByDepartment() {
        // get department data
        const departmentData = await getData(paths.getDepartments)
            .catch(err => { throw 'No department data found (required). Please create a department.' })

        // populate department choices
        const choices = createChoicesArray(departmentData, 'department')

        // get department from user
        const { department } = await inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'search by which department?',
                choices: choices
            }
        ])

        // search by department
        const path = paths.getEmployeeByDepartment.replace(':id', department)
        const employeeData = await getData(path)

        // display results
        console.table(employeeData);
    }

    static async addEmployee() {
        // get data for roles and employees
        const [roleData, employeeData] = await Promise.all([
            getData(paths.getRoles)
                .catch((err) => { throw 'No role data found (required). Please create a role.' }),
            getData(paths.getEmployees)
                .catch(err => true)
        ])

        // populate the choices arrays
        const roleChoices = createChoicesArray(roleData, 'role')
        let managerChoices = [{name: 'None', value: null}]
        if (Array.isArray(employeeData)) {
            managerChoices = [...managerChoices, ...createChoicesArray(employeeData, 'employee')]
        }

        // get user input
        let { firstName, lastName, role, manager } = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'what is their first name?',
                validate: input => input.match(/^[a-zA-Z]+$/) ? true : "Please enter a name (characters only).",
                filter: input => toTitleCaseTrim(input)
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'what is their last name?',
                validate: input => input.match(/^[a-zA-Z]+$/) ? true : "Please enter a name (characters only).",
                filter: input => toTitleCaseTrim(input)
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
        const [employeeId, rolesData] = await Promise.all([
            getSingleDataRow('employee')
                .catch((err) => { throw 'No employee data found (required). Please create an employee.' }),
            getData(paths.getRoles)
                .catch((err) => { throw 'No role data found (required). Please create a role.' })
        ])

        // populate the choices array
        const choices = createChoicesArray(rolesData, 'role')

        // get user input
        const { role } = await inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'choose a new role',
                choices: choices
            }
        ])

        // update employee's role_id in the database
        const path = paths.updateEmployeeRole.replace(':id', employeeId)
        const response = await fetch(path, {
            method: 'PUT',
            body: JSON.stringify({
                role_id: role
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
        const [employeeId, employeesData] = await Promise.all([
            getSingleDataRow('employee')
                .catch((err) => { throw 'No employee data found (required). Please create an employee.' }),
            getData(paths.getEmployees)
                .catch((err) => { throw 'No employee data found (required). Please create an employee.' })
        ])

        // populate the choices array
        const choices = [{ name: 'None', value: null }, ...createChoicesArray(employeesData, 'employee')]
        // prevent manager from being self
        for (let i = 0; i < choices.length; i++) {
            if (employeeId === choices[i].value) {
                choices.splice(i, 1)
            }
        }

        // get user input
        const { manager } = await inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'choose a new manager',
                choices: choices
            }
        ])

        // update the employee's manager_id in the database
        const path = paths.updateEmployeeManager.replace(':id', employeeId)
        const response = await fetch(path, {
            method: 'PUT',
            body: JSON.stringify({
                manager_id: manager
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
        const employeeId = await getSingleDataRow('employee')
            .catch((err) => { throw 'No employee data found (required). Please create an employee.' })

        // delete the employee from the database
        const path = paths.deleteEmployee.replace(':id', employeeId)
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