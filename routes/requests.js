const express = require('express')
const route = express.Router();
const access_token = require('../app/access_token')
const register_url = require('../app/register_url')

route.get('/', (req, res) => {
    res.send("Hello World")
})

route.get('/access_token', access_token)

module.exports = route;