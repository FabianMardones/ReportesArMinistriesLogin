const express      = require('express')
const app          = express()
const hostname     = '127.0.0.1';
const port         = 3002;
const cookieParser = require('cookie-parser')
const path         = require('path')
const fs           = require('fs')


app.use('/resources', express.static(('public')))
app.use('/resources', express.static(__dirname + '/public'))

app.use(express.urlencoded({extended:true}))
app.use(express.json())


const dotenv = require('dotenv')
dotenv.config({path:"./env/.env"})


app.use(cookieParser())

app.use('/', require('./routes/router'))


app.set('view engine', 'ejs');


app.get('/datos-encuentros', (req, res) => {
    const jsonFilePath = path.join(__dirname, 'database', 'encuentros.json');
    const datos = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    res.json(datos);
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
