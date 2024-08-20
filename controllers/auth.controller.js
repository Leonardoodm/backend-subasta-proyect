const { response, request } = require('express');
const encryption = require('bcryptjs');

const Usuario = require('../models/usuario');
const { createdJWT } = require('../helpers/created-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        //Obtenemos el usuario por el email
        const usuario = await Usuario.findOne({ where: { email } })
        //Verificar el email
        if (!usuario) return res.status(400).json({ msg: 'El email o contraseña no son correctos' })
        //verificar el status del usuario
        if (usuario.status === 0) return res.status(404).json({ msg: 'El usuario no existe' })
        //verificar la contraseña
        const validPassword = encryption.compareSync(password, usuario.password)
        if (!validPassword) return res.status(400).json({ msg: 'El email o contraseña no son correctos' })
        //Generar el JWT
        const token = await createdJWT(usuario.id);

        res.status(200).json({
            msg: 'logged in',
            usuario,
            token
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }

}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {
        const { name, email } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            const data = {
                nombre: name,
                email,
                password: ':p',  // Asegúrate de que la contraseña está adecuadamente gestionada en producción
                status: 1,
                rol: 'usuario',
            };

            usuario = await Usuario.create(data);
        }
        //TODO: no requerido para el proyecto pero que se puede implementar verificar que aunque sea usuario de google ver que este activo ese usuario o otras modificaciones 
        // Generar el JWT
        const token = await createdJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.error(error); // Asegúrate de registrar el error para depuración
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }
};

module.exports = {
    login,
    googleSignIn
}