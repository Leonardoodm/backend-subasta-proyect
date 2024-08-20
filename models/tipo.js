const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config'); // Importa la conexión a la base de datos

const Tipo = sequelize.define('Tipo', {
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

module.exports = Tipo;