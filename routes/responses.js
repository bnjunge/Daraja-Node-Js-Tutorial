const express = require('express')

const routes = express.Router();

routes.get('/', (req, resp) => {
    resp.send("We are on responses")
})


module.exports = routes;