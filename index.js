const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require("dotenv").config()
const initRoutes = require('./src/route/index')

app.use('/public', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 3000

initRoutes(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


// const initWebRoutes = require('./route/routes.js')


