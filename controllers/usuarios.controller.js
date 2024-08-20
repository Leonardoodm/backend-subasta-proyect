const { response, request } = require('express');
const encryption = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuarioGetId = async (req = request, res = response) => {

    const { id } = req.params;

    try {
        const user = await Usuario.findByPk(id);


        res.status(200).json({
            user
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }

}

const usuariosGet = async (req = request, res = response) => {

    // const { page = 0, size = 15 } = req.query;

    // let options = {
    //     limit: +size,
    //     offset: (+page) * (+size)
    // }

    // const { count, rows } = await Usuario.findAndCountAll(options)
    // const { status = 1} = req.params;
    try {
        const users = await Usuario.findAll();

        res.status(200).json({
            users
            // count, rows
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }

}

const usuariosPost = async (req, res = response) => {

    const { nombre, email, password: plainPassword } = req.body;
    const rol = 'usuario';
    const status = 1;


    // Hashear o encriptar la contraseña
    const salt = encryption.genSaltSync();
    const password = encryption.hashSync(plainPassword, salt);

    // Guardar en la base de datos
    try {
        const newUser = await Usuario.create({ nombre, email, password, status, rol });

        res.status(201).json({
            msg: 'El usuario fue creado correctamente',
            newUser
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }

}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { nombre, email, password: plainPassword, status, rol } = req.body;

    try {
        const usuarioUpdate = await Usuario.findByPk(id);

        if (nombre !== undefined) usuarioUpdate.nombre = nombre;
        if (email !== undefined) usuarioUpdate.email = email;

        if (plainPassword !== undefined) {
            // Hashear o encriptar la contraseña
            const salt = encryption.genSaltSync();
            const hashedPassword = encryption.hashSync(plainPassword, salt);
            usuarioUpdate.password = hashedPassword; // Asignar la contraseña hasheada
        }

        if (status !== undefined) usuarioUpdate.status = status; // Verifica si status se proporciona

        if (rol !== undefined) usuarioUpdate.rol = rol;
        await usuarioUpdate.save();

        res.status(200).json({
            msg: 'El usuario fue actualizado correctamente',
            usuarioUpdate
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};



const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;
    // console.log(req);
    
    const { userAutenticated } = req;
    
    try {
        const usuarioDelete = await Usuario.findByPk(id);

        usuarioDelete.status = 0;


        await usuarioDelete.save();

        res.status(200).json({
            msg: `El usuario ${id}, fue eliminado correctamente`,
            userAutenticated
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuarioGetId,
}