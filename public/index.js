const fetch = require('node-fetch');
const inquirer = require('inquirer');
const cTable = require('console.table');

const questions = [
    {
        type: 'list',
        name: 'toDo',
        message: 'what would you like to do?',
        choices: ['view all employees', 'view employees by manager', 'view employees by department', 'add an employee', 'update an employee role', 'update an employee manager', 'delete an employee', new inquirer.Separator(), 'view all departments', "view department's total utilized budget", 'add a department', 'delete a department', new inquirer.Separator(), 'view all roles', 'add a role', 'delete a role', new inquirer.Separator()],
        pageSize: 10,
        filter: input => {
            const { choices } = questions[0]
            return choices.indexOf(input)
        }
    }
];

function promptToDo() {
    inquirer
        .prompt(questions)
        .then(res => {
            toDoHandler(res.toDo)
        });
};

async function toDoHandler(toDo) {
    switch (toDo) {
        //view all employees
        case 0:
            fetch('http://localhost:3001/api/employees')
                .then(res => res.json())
                .then(data => console.table(data.data))
                .catch(err => console.log(err))
            break;

        //view employees by manager
        case 1:
            fetch('http://localhost:3001/api/employees/managers')
                .then(res => res.json())
                .then(data => {

                    choices = []
                    data.data.forEach(element => {
                        if (element.manager) {
                            choices.push(element.manager)
                        }
                    });

                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'manager',
                                message: 'search by which manager?',
                                choices: choices,
                                filter: input => {
                                    return data.data.filter(managerObj => {
                                        if (managerObj.manager === input) {
                                            return managerObj;
                                        }
                                    });
                                }
                            }
                        ])
                        .then(res => {
                            fetch(`http://localhost:3001/api/employees/manager/${res.manager[0].id}`)
                                .then(res => res.json())
                                .then(data => console.table(data.data))
                                .catch(err => console.log(err))
                        })
                })
                .catch(err => console.log(err))
            break;

        //view employees by department
        case 2:
            fetch('http://localhost:3001/api/departments/')
                .then(res => res.json())
                .then(data => {

                    choices = []
                    data.data.forEach(element => {
                        choices.push(element.name)
                    });

                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'department',
                                message: 'search by which department?',
                                choices: choices,
                                filter: input => {
                                    return data.data.filter(departmentObj => {
                                        if (departmentObj.name === input) {
                                            return departmentObj;
                                        }
                                    });
                                }
                            }
                        ])
                        .then(res => {
                            fetch(`http://localhost:3001/api/employees/department/${res.department[0].id}`)
                                .then(res => res.json())
                                .then(data => console.table(data.data))
                                .catch(err => console.log(err))
                        })
                })
                .catch(err => console.log(err))
            break;

        //add an employee
        case 3:
            roleChoices = []
            managerChoices = ['no manager']

            const populateRoleChoices = () => fetch('http://localhost:3001/api/roles')
                .then(res => res.json())
                .then(data => {
                    data.data.forEach(element => {
                        roleChoices.push(element.title)
                    });
                    return data.data;
                });
            const populateManagerChoices = () => fetch('http://localhost:3001/api/employees')
                .then(res => res.json())
                .then(data => {
                    data.data.forEach(element => {
                        managerChoices.push(`${element.first_name} ${element.last_name}`)
                    });
                    return data.data;
                });
            const getEmployeeInfo = () => fetch('http://localhost:3001/api/')
                .then(res => res.json())
                .then(data => data.data);


            const [ , , employeeInfo] = await Promise.all([populateRoleChoices(), populateManagerChoices(), getEmployeeInfo()])

            inquirer
                .prompt([
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
                .then(async res => {

                    employeeInfo.forEach(element => {
                        if (res.manager === `${element.first_name} ${element.last_name}`) {
                            res.manager = element.id
                        }
                        if (res.role === element.title) {
                            res.role = element.role_id
                        }
                    });
                    if (res.manager !== typeof Number) {
                        res.manager = null;
                    }

                    fetch('http://localhost:3001/api/employee', {
                        method: 'POST',
                        body: JSON.stringify({
                            first_name: res.firstName,
                            last_name: res.lastName,
                            role_id: res.role,
                            manager_id: res.manager
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log('The employee was successfully added.')
                        })
                })
            break;

        //update an employee role
        case 4:

            break;

        //update an employee manager
        case 5:

            break;

        //delete an employee
        case 6:

            break;

        //view all departments
        case 8:

            break;

        //view department's total utilized budget
        case 9:

            break;

        //add a department
        case 10:

            break;

        //delete a department
        case 11:

            break;

        //view all roles
        case 13:

            break;

        //add a role
        case 14:

            break;

        //delete a role
        case 15:

            break;
    }
}

function runProgram() {
    promptToDo()
}

runProgram()