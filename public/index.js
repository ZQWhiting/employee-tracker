const inquirer = require('inquirer');
const displayProgramTitle = require('../utils/consoleArt')
const Employee = require('../utils/Employee')
const Department = require('../utils/Department')
const Role = require('../utils/Role')

async function promptToDo() {
    const question = [
        {
            type: 'list',
            name: 'toDo',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View employees by manager', 'View employees by department', 'Add an employee', 'Update an employee role', 'Update an employee manager', 'Delete an employee', new inquirer.Separator(), 'View all departments', "View department's total utilized budget", 'Add a department', 'Delete a department', new inquirer.Separator(), 'View all roles', 'Add a role', 'Delete a role', new inquirer.Separator(), 'Exit program', new inquirer.Separator()],
            pageSize: 10,
            filter: input => {
                const { choices } = question[0]
                return choices.indexOf(input)
            }
        }
    ];

    const userInput = await inquirer.prompt(question)

    toDoHandler(userInput.toDo)
}

async function toDoHandler(toDo) {
    // controls whether promptToDo() will fire after this action is finished
    let repeat = true;

    try {
        // decides current action
        switch (toDo) {
            //view all employees
            case 0:
                await Employee.viewEmployees();

                break;

            //view employees by manager
            case 1:
                await Employee.viewEmployeesByManager();

                break;

            //view employees by department
            case 2:
                await Employee.viewEmployeesByDepartment();

                break;

            //add an employee
            case 3:
                await Employee.addEmployee();

                break;

            //update an employee role
            case 4:
                await Employee.updateEmployeeRole();

                break;

            //update an employee manager
            case 5:
                await Employee.updateEmployeeManager();

                break;

            //delete an employee
            case 6:
                await Employee.deleteEmployee();

                break;

            //view all departments
            case 8:
                await Department.viewDepartments();

                break;

            //view department's total utilized budget
            case 9:
                await Department.viewDepartmentBudget();

                break;

            //add a department
            case 10:
                await Department.addDepartment();

                break;

            //delete a department
            case 11:
                await Department.deleteDepartment();

                break;

            //view all roles
            case 13:
                await Role.viewRoles();

                break;

            //add a role
            case 14:
                await Role.addRole();

                break;

            //delete a role
            case 15:
                await Role.deleteRole();

                break;

            // set repeat to false
            default:
                repeat = false;
                break;
        }

    } catch (error) {
        if (error.status) {
            console.error(`${error.status}: ${error.statusText}`)
        } else {
            console.error(error)
        }
    }

    // if repeat is true, prompt user for next action
    if (repeat) {
        promptToDo()
    }
}

function runProgram() {
    // console art
    displayProgramTitle()

    promptToDo()
}

runProgram()