const fs = require('fs')

function getConfigValues() {
  let data = fs.readFileSync('./config.txt', 'utf-8', (err, data) => data)
  let results = {};
  data
    .split('\r\n')
    .map(kvp => {
      kvp = kvp.split('=');
      const key = kvp[0]
      const value = kvp[1]
      results[key] = value;
    })
  return results;
}

const { user, password, port, host, database } = getConfigValues()

module.exports = {
  user,
  password,
  port,
  host,
  database
}