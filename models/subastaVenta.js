const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../db/config'); // Importa la conexión a la base de datos
const Usuario = require('./usuario');
const Producto = require('./producto');

const SubastaVenta = sequelize.define('SubastaVenta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    precioEstimado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    precioPuja: {
        type: DataTypes.DECIMAL(10, 2),
    },
    revendedorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    clienteID: {
        type: DataTypes.INTEGER,
    },
    productoID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id'
        }
    },
    fechaHora: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    estadoPedido: {
        type: DataTypes.ENUM(
            'pendienteRev',
            'aceptadoRev',
            'enviandoAdm',
            'aceptadoAdm',
            'completado',
            'canceladoRev',
            'canceladoAdm',
            'enviandoUsu',
            'recibidoUsu',
            'procesando',
        ),
    }
},
    {
        timestamps: false,
    });

module.exports = SubastaVenta;