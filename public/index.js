const fetch = require('node-fetch');
const inquirer = require('inquirer');
const cTable = require('console.table');

const paths = {
    getAll: 'http://localhost:3001/api/all',

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
    getDepartmentBudget: 'http://localhost:3001/api/departments/salary/:id',
    addDepartment: 'http://localhost:3001/api/department',
    deleteDepartment: 'http://localhost:3001/api/department/:id'
}

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

async function getEmployee() {
    const employeeData = await getData(paths.getAll)

    employeeChoices = []
    employeeData.forEach(employeeObj => {
        employeeChoices.push(`${employeeObj.first_name} ${employeeObj.last_name}`)
    });

    const { employee } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Choose an employee',
            choices: employeeChoices,
            filter: input => {
                return employeeData.filter(employeeObj => {
                    if (input === `${employeeObj.first_name} ${employeeObj.last_name}`) {
                        return employeeObj;
                    }
                });
            }
        }
    ])

    return employee[0]
}

async function toDoHandler(toDo) {
    switch (toDo) {
        //view all employees
        case 0:
            try {
                // get employee data
                const employeeData = await getData(paths.getEmployees)

                // display data
                console.table(employeeData)

            } catch (error) {
                console.log(error)
            }

            break;

        //view employees by manager
        case 1:
            try {
                // get all employees listed as a manager
                const managerData = await getData(paths.getManagers)

                // push managers into choices array
                choices = []
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

            } catch (error) {
                console.log(error)
            }

            break;

        //view employees by department
        case 2:
            try {
                // get department data
                const departmentData = await getData(paths.getDepartments)

                // populate department choices
                choices = []
                departmentData.forEach(element => {
                    choices.push(element.name)
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
                                if (departmentObj.name === input) {
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

            } catch (error) {
                console.log(error)
            }

            break;

        //add an employee
        case 3:
            try {
                // get data for roles and employees
                const [roleData, employeeData] = await Promise.allSettled([getData(paths.getRoles), getData(paths.getAll)])

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

                // if user selected 'no manager', set value of manager to null
                if (manager !== typeof Number) {
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
                    console.log(response.status + response.statusText)
                }

            } catch (error) {
                console.log(error)
            }

            break;

        //update an employee role
        case 4:
            try {
                // get the id of the employee to update
                const [employee, rolesData] = await Promise.allSettled([getEmployee(), getData(paths.getRoles)])

                choices = []
                rolesData.value.forEach(role => {
                    choices.push(role.title)
                });

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

                // fetch 'put' '/employee/role/:id' body: json( role_id: new role)
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
                    console.log(response.status + response.statusText)
                }

            } catch (error) {
                console.log(error)
            }
            break;

        //update an employee manager
        case 5:
            try {
                // get the id of the employee to update
                const [employee, employeesData] = await Promise.allSettled([getEmployee(), getData(paths.getAll)])

                choices = ['no manager']
                employeesData.value.forEach(employeeObj => {
                    choices.push(`${employeeObj.first_name} ${employeeObj.last_name}`)
                });

                const { manager } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'choose a new manager',
                        choices: choices,
                        filter: input => {
                            if (input === 'no manager') {
                                return [{id: null}]
                            }
                            return employeesData.value.filter(employeeObj => {
                                if (input === `${employeeObj.first_name} ${employeeObj.last_name}`) {
                                    return employeeObj;
                                }
                            });
                        }
                    }
                ])

                // fetch 'put' '/employee/role/:id' body: json( role_id: new role)
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
                    console.log(response.status + response.statusText)
                }

            } catch (error) {
                console.log(error)
            }
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