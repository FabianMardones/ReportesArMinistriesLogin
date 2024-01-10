const express = require('express');
const cors = require('cors')
const hostname = '127.0.0.1'
const port = 3001
const app = express();
const cookieParser = require('cookie-parser')


app.use(cors())

app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'))

app.use(express.urlencoded({extended:true}))
app.use(express(express.json))

app.set('view engine', 'ejs');

const dotenv = require('dotenv')
dotenv.config({path:'./env/.env'})

app.use(cookieParser())

app.use('/', require('./routes/router'));

app.use(function(req, res, next){
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    }
    next()
})

app.get('/register', (req, res) => {
    res.render('register')
})


app.get('/vistasAlmas', (req, res) => {
    res.render('vistasAlmas')
})


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});