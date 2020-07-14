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
            message: 'what would you like to do?',
            choices: ['view all employees', 'view employees by manager', 'view employees by department', 'add an employee', 'update an employee role', 'update an employee manager', 'delete an employee', new inquirer.Separator(), 'view all departments', "view department's total utilized budget", 'add a department', 'delete a department', new inquirer.Separator(), 'view all roles', 'add a role', 'delete a role', new inquirer.Separator(), 'exit program', new inquirer.Separator()],
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
        console.log(`${error.status}: ${error.statusText}`)
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