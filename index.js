const $ = require('jquery')(require("jsdom").jsdom().defaultView);

const request = require('request')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())
app.use(bodyParser.json())   
app.use(bodyParser.urlencoded({
    extended: true
}))

const countries = require('./countries.json')

const myHoraUrl = 'https://www.myhora.com/'
const myHoraUrl_Hora = myHoraUrl + '%E0%B8%94%E0%B8%B9%E0%B8%94%E0%B8%A7%E0%B8%87-%E0%B9%82%E0%B8%AB%E0%B8%A3%E0%B8%B2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B9%84%E0%B8%97%E0%B8%A2.aspx'

const getViewState = () => new Promise((resolve, reject) => {
    request.get(myHoraUrl_Hora, (error, response, body) => {
        if(error) {
            reject(error)
        }
        $('body').html('')
        $(body).appendTo('body')
        resolve($('#__VIEWSTATE').val())
    })
})

const getIframeLakkana = (viewState, chartInfo) => new Promise((resolve, reject) => {
    // chartInfo Object Model
    // {
    //     day: 6,
    //     month: 9,
    //     year: 2537,
    //     hour: 12,
    //     minute: 00,
    //     country: 'Thailand'
    // }
    const country = countries[chartInfo.country]
    const payload = {
        'dd_day': chartInfo.day,
        'dd_month': chartInfo.month,
        'dd_year': chartInfo.year,
        'dd_hh': chartInfo.hour,
        'dd_mm': chartInfo.minute,
        'txt_lat_th': country.lat,
        'txt_lon_th': country.lon,
        'txt_utc_th': country.utc,
        'txt_dst_th': 0,
        'dd_year2': 2560,
        'txt_lat_th2': 13,
        'txt_lon_th2': 100,
        'txt_utc_th2': 7,
        'txt_dst_th2': 0,
        'caltype': 'rb_nirayana',
        'btn_submit': 'ทำนาย',
        '__VIEWSTATEENCRYPTED': '',
        '__VIEWSTATE': viewState
    }
    request.post(myHoraUrl_Hora, {form: payload}, (error, response, body) => {
        if(error) {
            reject(error)
        }
        $('body').html('')
        $(body).appendTo('body')
        resolve($('iframe:eq(1)').attr('src'))
    })
})

const getChartInfo = (chartUrl) => new Promise((resolve, reject) => {
    try {
        let chartMap = {}
        let chartArray = chartUrl.split('&')
        chartArray[0] = chartArray[0].split('?')[1]
        chartArray = chartArray.slice(0, 14)
        chartArray.forEach((chartString) => {

            const chartSlot = chartString.split('=')
            const chartVal = chartSlot[1].split(',')[0]

            chartMap[chartSlot[0]] = chartVal
            
        })
        resolve(chartMap)
    }
    catch(error) {
        resolve({lux : -1})
    }
})

const filterChartMap = (chartMap) => new Promise((resolve, reject) => {
    let newChartMap = {}
    let i = 0;
    for(let star in chartMap) {
        if(i < 10) {
            // If has a value
            if(chartMap[star] >= 0) {
                newChartMap[star] = chartMap[star]
            }
            i++
        }
    }
    newChartMap['slak'] = chartMap['lux']
    resolve(newChartMap)
})

app.post('/chart', (req, res) => {
    // chartInfo Object Model
    // {
    //     day: 6,
    //     month: 9,
    //     year: 2537,
    //     hour: 12,
    //     minute: 00,
    //     country: 'Thailand'
    // }
    const chartInfo = req.body
    chartInfo.day = parseInt(chartInfo.day)
    chartInfo.month = parseInt(chartInfo.month)
    chartInfo.hour = parseInt(chartInfo.hour)
    chartInfo.minute = parseInt(chartInfo.minute)
    chartInfo.year = parseInt(chartInfo.year) + 543
    console.log(chartInfo)
    getViewState()
        .then((viewState) => getIframeLakkana(viewState, chartInfo))
        .then(getChartInfo)
        .then(filterChartMap)
        .then((chartMap) => res.send(chartMap))
})

app.listen(7000, () => console.log('Server start at port 7000'))
