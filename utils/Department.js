require('console.table');
const fetch = require('node-fetch');
const inquirer = require('inquirer');
const paths = require('../utils/paths')
const { getData, getSingleDataRow } = require('../utils/getData')

class Department {
    static async viewDepartments() {
        // get the departments from the database
        const departmentsData = await getData(paths.getDepartments);

        // display the data
        console.table(departmentsData)
    }

    static async viewDepartmentBudget() {
        // get the department to view
        const department = await getSingleDataRow('department')

        // get the budget data of the department
        const path = paths.getDepartmentBudget.replace(':id', department.id)
        const departmentsData = await getData(path)

        // display the data
        if (departmentsData[0].department === null) {
            console.log('No budget data for selected department.')
        } else {
            console.table(departmentsData)
        }
    }

    static async addDepartment() {
        // user names the department
        const { department } = await inquirer.prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Name the new department',
                validation: input => {
                    if (input) input
                }
            }
        ])

        // save the department in the database
        const response = await fetch(paths.addDepartment, {
            method: 'POST',
            body: JSON.stringify({
                name: department
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        // display the response
        if (response.ok) {
            console.log('Department was successfully added')
        } else {
            throw response
        }
    }

    static async deleteDepartment() {
        // get the department to delete
        const department = await getSingleDataRow('department');

        // delete the department from the database
        const path = paths.deleteDepartment.replace(':id', department.id)
        const response = await fetch(path, {
            method: 'DELETE'
        })

        // display the response
        if (response.ok) {
            console.log('Department was successfully deleted.')
        } else {
            throw response
        }
    }
}

module.exports = Department;