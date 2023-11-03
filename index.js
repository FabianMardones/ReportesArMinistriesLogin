const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const mysql = require('mysql')
const path = require('path')
const router = express.Router()


app.use(express.urlencoded({extended:true}))
app.use(express.json())


const dotenv = require('dotenv')
dotenv.config({path:"./env/.env"})


app.use('/resources', express.static(('public')))
app.use('/resources', express.static(__dirname + '/public'))



app.use(cookieParser())

app.use('/', require('./routes/router'))


app.set('view engine', 'ejs');


const bcryptjs = require('bcryptjs')


const session = require('express-session')
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))


const connection = require('./database/db')
const connection2 = require('./database/db2')


app.listen(3000, function(){
    console.log("Servidor creado http://localhost:3000");
});
