const fetch = require('node-fetch');
const inquirer = require('inquirer');
const cTable = require('console.table');

const toDoQuestion = [
    {
        type: 'list',
        name: 'toDo',
        message: 'what would you like to do?',
        choices: ['view all employees', 'view employees by manager', 'view employees by department', 'add an employee', 'update an employee role', 'update an employee manager', 'delete an employee', new inquirer.Separator(), 'view all departments', "view department's total utilized budget", 'add a department', 'delete a department', new inquirer.Separator(), 'view all roles', 'add a role', 'delete a role', new inquirer.Separator()],
        pageSize: 10,
        filter: input => {
            const { choices } = toDoQuestion[0]
            return choices.indexOf(input)
        }
    }
];

async function getData(path) {
    const res = await fetch(path)
    const json = await res.json()
    return json.data
}

async function promptToDo() {
    const userInput = await inquirer.prompt(toDoQuestion)
    toDoHandler(userInput.toDo)
};

async function toDoHandler(toDo) {
    switch (toDo) {
        //view all employees
        case 0:
            try {
                const employeeData = await getData('http://localhost:3001/api/employees')

                console.table(employeeData)

            } catch (error) {
                console.log(error)
            }

            break;

        //view employees by manager
        case 1:
            try {
                // get all employees listed as a manager
                const managerData = await getData('http://localhost:3001/api/employees/managers')

                // push managers into choices array
                choices = []
                managerData.forEach(element => {
                    if (element.manager) {
                        choices.push(element.manager)
                    }
                });

                // get user input on manager to search by
                const managerChoice = await inquirer.prompt([
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
                const employeeData = await getData(`http://localhost:3001/api/employees/manager/${managerChoice.manager[0].id}`)

                // display employees
                console.table(employeeData)

            } catch (error) {
                console.log(error)
            }

            break;

        //view employees by department
        case 2:
            try {
                const departmentData = await getData('http://localhost:3001/api/departments/')

                choices = []
                departmentData.forEach(element => {
                    choices.push(element.name)
                });

                const departmentChoice = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'search by which department?',
                        choices: choices,
                        filter: input => {
                            return departmentData.filter(departmentObj => {
                                if (departmentObj.name === input) {
                                    return departmentObj;
                                }
                            });
                        }
                    }
                ])

                const employeeData = await getData(`http://localhost:3001/api/employees/department/${departmentChoice.department[0].id}`)

                console.table(employeeData);

            } catch (error) {
                console.log(error)
            }

            break;

        //add an employee
        case 3:
            try {
                // get data for roles and employees
                const [roleData, employeeData] = await Promise.allSettled([getData('http://localhost:3001/api/roles'), getData('http://localhost:3001/api/')])

                // populate the choices arrays
                roleChoices = []
                managerChoices = ['no manager']
                roleData.value.forEach(element => {
                    roleChoices.push(element.title)
                });
                employeeData.value.forEach(element => {
                    managerChoices.push(`${element.first_name} ${element.last_name}`)
                });

                // get user input
                let { firstName, lastName, role, manager } = await inquirer
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

                // set the role and manager strings to the respective id's
                employeeData.value.forEach(element => {
                    if (manager === `${element.first_name} ${element.last_name}`) {
                        manager = element.id
                    }
                    if (role === element.title) {
                        role = element.role_id
                    }
                })

                // if user selected 'no manager', set value of manager to null
                if (manager !== typeof Number) {
                    manager = null;
                }

                // post employee object to the database
                const postResponse = await fetch('http://localhost:3001/api/employee', {
                    method: 'POST',
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        role_id: role,
                        manager_id: manager
                    }),
                    headers: { 'Content-Type': 'application/json' }
                })

                if (postResponse.ok) {
                    console.log('The employee was successfully added.')
                }

            } catch (error) {
                console.log(error)
            }

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