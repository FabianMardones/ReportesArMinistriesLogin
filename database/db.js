const mysql = require('mysql')
const connectionEncuentros = mysql.createConnection({
    host: process.env.ENCUENTRO_BD_HOST,
    user: process.env.ENCUENTRO_DB_USER,
    password: process.env.ENCUENTRO_DB_PASSWORD,
    database: process.env.ENCUENTRO_DB_DATABASE
})

connectionEncuentros.connect((error) => {
    if (error) {
        console.log('El error de conexión es: ' + error);
        return;
    }
    console.log('Conectado a la base de datos de encuentros');
});
module.exports = connectionEncuentros;