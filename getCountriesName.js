const countries = require('./countries.json')

const fs = require('fs')
fs.writeFileSync('countries_name.json', JSON.stringify(Object.keys(countries)))
// console.log(Object.keys(countries))