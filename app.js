const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const morgan = require('morgan')

const app = express()
const cors = require('cors')

app.use(morgan('tiny'));
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT;


const authorizationRoute = require('./routes/authorizeRoute')
app.use('/', authorizationRoute)

const userRouter = require('./routes/usersRoute')
app.use('/', userRouter)

const productRouter = require('./routes/productRoute')
app.use('/', productRouter)

const recipeRouter = require('./routes/recipeRoute')
app.use('/', recipeRouter)

const tutorialRouter = require('./routes/tutorialRoute')
app.use('/', tutorialRouter)

mongoose.connect(process.env.DBCONNECTION, {useNewUrlParser: true, useUnifiedTopology: true}, err => {
    if(!err){
        console.log("database connected")
    }else{
      console.log("cannot connect to db")  
      console.log(err)
    }
})

app.listen(PORT, (req, res, next) => {
    console.log(`listening on server ${PORT}`)
})