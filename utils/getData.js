const fetch = require('node-fetch');
const inquirer = require('inquirer');
const paths = require('./paths')

async function getData(path) {
    const res = await fetch(path)
    if (!res.ok) throw res;
    const json = await res.json()
    if (!json.data.length) {return Promise.reject('No data found.')}
    return json.data
}

async function getSingleDataRow(type) {
    let dataArr = [];
    switch (type) {
        case 'employee':
            dataArr = await getData(paths.getEmployees)
            break;
        case 'department':
            dataArr = await getData(paths.getDepartments)
            break;
        case 'role':
            dataArr = await getData(paths.getRoles)
            break;
    }

    const choices = []
    dataArr.forEach(dataObj => {
        switch (type) {
            case 'employee':
                choices.push({name: `${dataObj.first_name} ${dataObj.last_name}`, value: dataObj.id})
                break;
            case 'department':
                choices.push({name: dataObj.name, value: dataObj.id})
                break;
            case 'role':
                choices.push({name: dataObj.title, value: dataObj.id})
                break;
        }

    });

    const { input } = await inquirer.prompt([
        {
            type: 'list',
            name: 'input',
            message: `Which ${type}?`,
            choices: choices
        }
    ])
    return input
}



module.exports = { getData, getSingleDataRow }