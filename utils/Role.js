require('console.table');
const fetch = require('node-fetch');
const inquirer = require('inquirer');
const paths = require('../utils/paths')
const { getData, getSingleDataRow } = require('../utils/getData');

class Role {
    static async viewRoles() {
        // get the roles to view
        const rolesData = await getData(paths.getRoles)
            .catch((err) => { throw 'No role data found (required). Please create a role.' })

        // display the data
        console.table(rolesData)
    }

    static async addRole() {
        // get the department data for department_id
        const departmentData = await getData(paths.getDepartments)
            .catch((err) => { throw 'No department data found (required). Please create a department.' })

        // populate the choices arrays
        const choices = []
        departmentData.forEach(departmentObj => {
            choices.push({ name: departmentObj.name, value: departmentObj.id })
        });

        // get user input
        const { title, salary, department } = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Name the new role',
                validate: input => input.match(/^[a-zA-Z ]+$/) ? true : "Please enter a name (characters and spaces only).",
                filter: input => {
                    return input
                        .trim()
                        .replace(/\s+/g, ' ')
                        .split(' ')
                        .map(word => {
                            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        })
                        .join(' ')
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the new role's salary?",
                validate: input => input.match(/^\d+$/) ? true : 'Please enter a number (no symbols or decimals).',
            },
            {
                type: 'list',
                name: 'department',
                message: 'What deparment does the new role belong to?',
                choices: choices
            }
        ])

        // save the role to the database
        const response = await fetch(paths.addRole, {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                salary: salary,
                department_id: department
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        // display the response
        if (!response.ok) {
            throw response
        }

        console.log('Role was successfully added')
    }

    static async deleteRole() {
        // get the role to delete
        const roleId = await getSingleDataRow('role')
            .catch((err) => { throw 'No role data found (required). Please create a role.' })

        // delete the role from the database
        const path = paths.deleteRole.replace(':id', roleId)
        const response = await fetch(path, {
            method: 'DELETE'
        })

        // display the response
        if (response.ok) {
            console.log('Role was successfully deleted.')
        } else {
            throw response
        }
    }
}

module.exports = Role;