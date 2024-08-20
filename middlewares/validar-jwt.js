const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) return res.status(401).json({ msg: 'No hay token en la peticion' });

    try {

        const { id } = jwt.verify(token, process.env.SECRET_KEY);

        const userAutenticated = await Usuario.findByPk(id);

        // Verificar si el usuario autenticado existe
        if (!userAutenticated) return res.status(401).json({
            msg: 'Token no válido - usuario no existe en DB'
        });

        // Verificar si el usuario autenticado está activo
        if (userAutenticated.status === 0) return res.status(401).json({
            msg: 'Token no válido - usuario con estado inactivo'
        });

        req.userAutenticated = userAutenticated;
        next()
    } catch (error) {
        res.status(401).json({
            msg: 'Token no valido.'
        })
    }

}

module.exports = {
    validarJWT
}