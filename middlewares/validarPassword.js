const { check } = require('express-validator');

const validarPassword = () => {
    return [
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
    ];
};

module.exports = {
    validarPassword
};