function toTitleCaseTrim(input) {
    return input
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join(' ')
}

function createChoicesArray(dataArr, type) {
    const choices = []
    dataArr.forEach(dataObj => {
        switch (type) {
            case 'employee':
                choices.push({ name: `${dataObj.first_name} ${dataObj.last_name}`, value: dataObj.id })
                break;
            case 'department':
                choices.push({ name: dataObj.name, value: dataObj.id })
                break;
            case 'role':
                choices.push({ name: dataObj.title, value: dataObj.id })
                break;
            case 'manager':
                choices.push({ name: dataObj.manager, value: dataObj.id })
        }
    })
    return choices;
}


module.exports = {
    toTitleCaseTrim,
    createChoicesArray
}