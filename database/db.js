const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.ENCUENTRO_DB_HOST,
    user: process.env.ENCUENTRO_DB_USER,
    password: process.env.ENCUENTRO_DB_PASSWORD,
    database: process.env.ENCUENTRO_DB_DATABASE
});

connection.connect((error) => {
    if (error) {
        console.error('El error de conexión es: '+ error);
        return;
    }
    console.log('Conectado a la Base de datos de Encuentros');
})

module.exports = connection;