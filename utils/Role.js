require('console.table');
const fetch = require('node-fetch');
const inquirer = require('inquirer');
const paths = require('../utils/paths')
const { getData, getSingleDataRow } = require('../utils/getData')

class Role {
    static async viewRoles() {
        // get the roles to view
        const rolesData = await getData(paths.getRoles);

        // display the data
        console.table(rolesData)
    }

    static async addRole() {
        // get the department data for department_id
        const departmentData = await getData(paths.getDepartments)

        // populate the choices arrays
        choices = []
        departmentData.forEach(departmentObj => {
            choices.push(departmentObj.department)
        });

        // get user input
        const { title, salary, department } = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Name the new role',
                validation: input => {
                    if (input) input
                },
            },
            {
                type: 'number',
                name: 'salary',
                message: "What is the new role's salary?",
                validation: input => {
                    if (!input || !input === typeof Number) {
                        return false;
                    }
                },
            },
            {
                type: 'list',
                name: 'department',
                message: 'What deparment does the new role belong to?',
                choices: choices,
                filter: input => {
                    return departmentData.filter(departmentObj => {
                        if (input === departmentObj.department) {
                            return departmentObj;
                        }
                    })
                }
            }
        ])

        // save the role to the database
        const response = await fetch(paths.addRole, {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                salary: salary,
                department_id: department[0].id
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        // display the response
        if (response.ok) {
            console.log('Role was successfully added')
        } else {
            throw response
        }
    }

    static async deleteRole() {
        // get the role to delete
        const role = await getSingleDataRow('role');

        // delete the role from the database
        const path = paths.deleteRole.replace(':id', role.id)
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