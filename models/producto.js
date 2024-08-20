const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config'); // Importa la conexión a la base de datos

const Usuario = require('../models/usuario');

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    talla: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    tipo: {                 
        type: DataTypes.ENUM('H', 'M', 'NH', 'NM'),
        // H => Hombre, M => Mujer, NH => niño, NM => niña
        // values: ['usuario', 'administrador', 'revendedor'],
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        //0 => cancelado, 1 => vigente, 2 => procesando, 3 => comprado
    },
    revendedorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Usuario,
          key: 'id'
        }
      },
    // Fotos: {
    //     type: DataTypes.ARRAY(DataTypes.STRING), // Puedes usar un array de strings para almacenar las rutas de las imágenes
    //     allowNull: true
    // }
},
    {
        timestamps: false,
    });

module.exports = Producto;
