const EstadosPedidos = require('../models/estadoPedido');
const Producto = require('../models/producto');
const Role = require('../models/role');
const SubastaVenta = require('../models/subastaVenta');
const Tipo = require('../models/tipo');
const Usuario = require('../models/usuario');

const isValidRol = async (nombre = '') => {
    const existeRole = await Role.findOne({ where: { nombre } });
    if (!existeRole) {
        throw new Error(`El rol ${nombre} no está registrado en la DB`);
    }
}

const isValidType = async (nombre = '') => {
    const existeTipo = await Tipo.findOne({ where: { nombre } });
    if (!existeTipo) {
        throw new Error(`El tipo ${nombre} no está registrado en la DB`);
    }
}

const isValidState = async (nombre = '') => {
    const existState = await EstadosPedidos.findOne({ where: { nombre } });
    if (!existState) {
        throw new Error(`El rol ${nombre} no está registrado en la DB`);
    }
}

const emailExist = async (email = '') => {
    // Verificar si el correo electrónico existe
    const emailExistente = await Usuario.findOne({ where: { email } });

    if (emailExistente) {
        throw new Error(`El email ${email}, ya está en uso`);
    }
}



const existUserId = async (id) => {
    // Verificar si el correo electrónico existe
    const usuarioIdExistente = await Usuario.findByPk(id);

    if (!usuarioIdExistente) {
        throw new Error(`El usuario con id n° ${id}, no existe. `);
    }
}

const existSubVenId = async (id) => {
    // Verificar si el correo electrónico existe
    const subastaIdExistente = await SubastaVenta.findByPk(id);

    if (!subastaIdExistente) {
        throw new Error(`El usuario con id n° ${id}, no existe. `);
    }
}

const existProductId = (validateStatus = false) => {
    return async (id) => {
        const producto = await Producto.findByPk(id);

        if (!producto) {
            throw new Error(`El producto con id n° ${id}, no existe.`);
        }

        if (validateStatus && producto.status !== 1) {
            throw new Error(`El producto con id n° ${id}, no está en estado activo.`);
        }
    };
};








module.exports = {
    isValidRol,
    emailExist,
    existUserId,
    isValidType,
    existProductId,
    isValidState,
    existSubVenId
}