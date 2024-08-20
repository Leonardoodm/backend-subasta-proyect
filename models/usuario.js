const { DataTypes } = require('sequelize');
const {sequelize} = require('../db/config'); // Importa la conexión a la base de datos



const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('usuario', 'administrador', 'revendedor'),
        // values: ['usuario', 'administrador', 'revendedor'],
        allowNull: false
    }
    
},
    {
        timestamps: false,
    });


    
module.exports = Usuario;