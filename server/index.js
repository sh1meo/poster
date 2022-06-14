require('dotenv').config()
const sequelize = require('./db.js')
const express = require('express')
const cookieParser = require('cookie-parser')
const models = require('./models/models.js')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index.js')
const ErrorHandler = require('./middleware/ErrorHandler.js')  
const path = require('path')  

const Port = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

app.use(ErrorHandler)

app.get('/', (req, res) => {
    res.status(200).json({message: `successful request`})
})

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(Port, () => console.log(`Server started at port ${Port}`))
    } catch (e) {
        console.log(e)
    }
} 

start()