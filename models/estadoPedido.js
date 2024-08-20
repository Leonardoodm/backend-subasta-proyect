const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config'); // Importa la conexión a la base de datos

const EstadoPedidos = sequelize.define('EstadoPedidos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

},
    {
        timestamps: false,
    });

module.exports = EstadoPedidos;