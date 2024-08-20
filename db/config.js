const { Sequelize } = require('sequelize');


// Configura la conexión a la base de datos
const sequelize = new Sequelize('dbName', 'User', 'Password', {
    host: 'localhost',
    dialect: 'mysql' // Cambia esto según el tipo de base de datos que estés utilizando
});


// Verifica la conexión a la base de datos
async function connectDatabase() {
    try {
        // await sequelize.authenticate(); //Verifica la conexion
        await sequelize.sync();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {
    sequelize,
    connectDatabase
}



