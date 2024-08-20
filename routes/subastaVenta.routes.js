const { Router } = require('express');
const { check } = require('express-validator');

const { existProductId, existSubVenId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, haveRole, isAdminRol } = require('../middlewares');

const {
    subastaGetId,
    subastaGet,
    subastaPost,
    subastaPut,
    subastaAdmPut,
    buySubastaPut,
    subastaUsuPut,
    subastaStateGet,
    comprasClienteGet, } = require('../controllers/subastaVentas.controller');


const router = Router();


router.get('/', [
    validarJWT,
    haveRole('administrador', 'revendedor'),
    validarCampos,
], subastaStateGet);



router.get('/public', subastaGet);

router.get('/compras', [
    validarJWT,
    validarCampos,
], comprasClienteGet);


router.get('/:id', [
    check('id', 'No es un id valido').isInt().toInt(),
    check('id').custom(existSubVenId),
    validarCampos,
], subastaGetId);



router.post('/', [
    validarJWT,
    haveRole('administrador', 'revendedor'),
    check('precioEstimado', 'La precioEstimado es obligatorio').not().isEmpty(),
    check('productoID').custom(existProductId(true)),
    validarCampos,
], subastaPost);



router.put('/buySubasta/:id', [
    validarJWT,
    check('id', 'No es un id valido').isInt().toInt(),
    check('precioPuja', 'El modelo es obligatorio').not().isEmpty(),
    validarCampos,
], buySubastaPut);


// valida el revendedor el producto a vender 
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isInt().toInt(),
    haveRole('administrador', 'revendedor'),
    check('estadoPedido', 'El estadoPedido es obligatorio').not().isEmpty(),
    validarCampos,
], subastaPut);

// valida el administrador el producto del revendedor
router.put('/checkAdm/:id', [
    validarJWT,
    isAdminRol,
    check('id', 'No es un id valido').isInt().toInt(),
    check('estadoPedido', 'El estadoPedido es obligatorio').not().isEmpty(),
    validarCampos,
], subastaAdmPut);

// valida el usuario que ha llegado el producto
router.put('/checkUsu/:id', [
    validarJWT,
    check('id', 'No es un id valido').isInt().toInt(),
    check('estadoPedido', 'El estadoPedido es obligatorio').not().isEmpty(),
    validarCampos,
], subastaUsuPut);

// router.delete('/:id', [
//     validarJWT,
//     check('id', 'No es un id valido').isInt().toInt(),
//     check('id').custom(existProductId),
//     isUserCreatedProductOrAdmin,
//     validarCampos,
// ], productosDelete);


module.exports = router;