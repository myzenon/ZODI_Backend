const $ = require('jquery')(require("jsdom").jsdom().defaultView);

const request = require('request')
const express = require('express')
const app = express()

const payload = {
    "cb_foreign": "on",
    "dd_country": 83
}

request('https://www.myhora.com/%E0%B8%94%E0%B8%B9%E0%B8%94%E0%B8%A7%E0%B8%87-%E0%B9%82%E0%B8%AB%E0%B8%A3%E0%B8%B2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B9%84%E0%B8%97%E0%B8%A2.aspx', { form: payload }, (error, response, body) => {
    $(body).appendTo('body')
    console.log($('#__VIEWSTATE').val())
    console.log($('#txt_lat').val())
})

// app.listen(7000, () => console.log('Server start at port 7000'))
