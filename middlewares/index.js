const validarCampos = require('./validar-campos');
const validarPassword = require('./validarPassword');
const validarJWT = require('./validar-jwt');
const validarRoles = require('./validar-roles');


module.exports = {
    ...validarCampos,
    ...validarPassword,
    ...validarJWT,
    ...validarRoles,
}