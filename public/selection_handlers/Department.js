require('console.table');
const fetch = require('node-fetch');
const inquirer = require('inquirer');
const paths = require('../../utils/paths')
const { getData, getSingleDataRow } = require('../../utils/getData');
const { toTitleCaseTrim } = require('../../utils/utils');


class Department {
    static async viewDepartments() {
        // get the departments from the database
        const departmentsData = await getData(paths.getDepartments)
            .catch((err) => { throw 'No department data found (required). Please create a department.' })

        // display the data
        console.table(departmentsData)
    }

    static async viewDepartmentBudget() {
        // get the department to view
        const departmentId = await getSingleDataRow('department')
            .catch((err) => { throw 'No department data found (required). Please create a department.' })

        // get the budget data of the department
        const path = paths.getDepartmentBudget.replace(':id', departmentId)
        const departmentsData = await getData(path)

        // display the data
        if (!departmentsData[0].department) {
            throw 'No budget data found for selected department.'
        }

        console.table(departmentsData)
    }

    static async addDepartment() {
        // user names the department
        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Name the new department',
                validate: input => input.match(/^[a-zA-Z ]+$/) ? true : "Please enter a name (characters and spaces only).",
                filter: input => toTitleCaseTrim(input)
            }
        ])

        // save the department in the database
        const response = await fetch(paths.addDepartment, {
            method: 'POST',
            body: JSON.stringify({
                name: name
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
        const departmentId = await getSingleDataRow('department')
            .catch((err) => { throw 'No department data found (required). Please create a department.' })

        // delete the department from the database
        const path = paths.deleteDepartment.replace(':id', departmentId)
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