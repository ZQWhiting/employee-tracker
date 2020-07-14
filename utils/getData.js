const fetch = require('node-fetch');
const inquirer = require('inquirer');
const paths = require('./paths')

async function getData(path) {
    const res = await fetch(path)
    if (!res.ok) throw res;
    const json = await res.json()
    return json.data
}

async function getSingleDataRow(type) {
    let dataArr;
    switch (type) {
        case 'employee':
            dataArr = await getData(paths.getAll)
            break;
        case 'department':
            dataArr = await getData(paths.getDepartments)
            break;
        case 'role':
            dataArr = await getData(paths.getRoles)
            break;
    }

    choices = []
    dataArr.forEach(dataObj => {
        switch (type) {
            case 'employee':
                choices.push(`${dataObj.first_name} ${dataObj.last_name}`)
                break;
            case 'department':
                choices.push(dataObj.department)
                break;
            case 'role':
                choices.push(dataObj.title)
                break;
        }

    });

    const { input } = await inquirer.prompt([
        {
            type: 'list',
            name: 'input',
            message: `Which ${type}?`,
            choices: choices,
            filter: input => {
                return dataArr.filter(dataObj => {
                    switch (type) {
                        case 'employee':
                            if (input === `${dataObj.first_name} ${dataObj.last_name}`) {
                                return dataObj;
                            }
                            break;
                        case 'department':
                            if (input === dataObj.department) {
                                return dataObj;
                            }
                            break;
                        case 'role':
                            if (input === dataObj.title) {
                                return dataObj;
                            }
                            break;
                    }
                });
            }
        }
    ])
    return input[0]
}



module.exports = { getData, getSingleDataRow }