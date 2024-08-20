const { Router } = require('express');
const { check } = require('express-validator');

const { isValidRol, emailExist, existUserId } = require('../helpers/db-validators');

const { validarCampos,validarPassword, validarJWT, isAdminRol} = require('../middlewares');

const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuarioGetId } = require('../controllers/usuarios.controller');

const router = Router();


router.get('/', usuariosGet);

router.get('/:id', [
    check('id', 'No es un id valido').isInt().toInt(),
    check('id').custom(existUserId),
    validarCampos,
], usuarioGetId);

router.put('/:id', [
    check('id', 'No es un id valido').isInt().toInt(),
    check('id').custom(existUserId),
    validarCampos,
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email no es valido').isEmail(),
    check('email').custom(emailExist),
    ...validarPassword(),
    // check('rol', 'No es un rol válido').isIn(['usuario', 'administrador', 'revendedor' ]),
    // check('rol').custom(isValidRol),
    validarCampos,
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    isAdminRol,
    check('id', 'No es un id valido').isInt().toInt(),
    check('id').custom(existUserId),
    validarCampos,
], usuariosDelete);


module.exports = router;