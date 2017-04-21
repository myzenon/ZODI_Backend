const countriesJSON = require('./countries.json')

let countriesObject = {}

countriesJSON.countries.forEach((country) => {
    countryLatLong = country.latlong.split(',')
    countriesObject[country.name] = {
        'lat': countryLatLong[0],
        'lon': countryLatLong[1],
        'utc': country.timezone_offset
    }
})

const fs = require('fs')
fs.writeFileSync('country.json', JSON.stringify(countriesObject))

// console.log(countriesObject)