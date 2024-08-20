const { Router } = require('express');
const { check } = require('express-validator');

const { isValidType, existUserId, existProductId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, haveRole} = require('../middlewares');

const { productosGet,
    productosPost,
    productosPut,
    productosDelete,
    productoGetId, 
    productosRevGet} = require('../controllers/productos.controller');
const { isUserCreatedProductOrAdmin } = require('../middlewares/validar-productos');

const router = Router();

router.get('/revendedor', [
    validarJWT,
    haveRole('administrador', 'revendedor'),
    validarCampos,
], productosRevGet);


router.get('/',[
    validarJWT,
    haveRole('administrador', 'revendedor'),
    validarCampos,
], productosGet);

router.get('/:id', [
    check('id', 'No es un id valido').isInt().toInt(),
    check('id').custom(existProductId(false)),
    validarCampos,
], productoGetId);

router.post('/', [
    validarJWT,
    haveRole('administrador', 'revendedor'),
    check('modelo', 'El modelo es obligatorio').not().isEmpty(),
    check('marca', 'La marca es obligatoria').not().isEmpty(),
    check('talla', 'La talla es obligatoria').not().isEmpty(),
    
    check('tipo').custom(isValidType),    
    validarCampos,
], productosPost);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isInt().toInt(),
    check('id').custom(existProductId(false)),
    isUserCreatedProductOrAdmin,
    
    check('modelo', 'El modelo es obligatorio').not().isEmpty(),
    check('marca', 'La marca es obligatoria').not().isEmpty(),
    check('talla', 'La talla es obligatoria').not().isEmpty(),
    
    check('tipo').custom(isValidType),    

    validarCampos,
], productosPut);



router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isInt().toInt(),
    check('id').custom(existProductId),
    isUserCreatedProductOrAdmin,
    validarCampos,
], productosDelete);


module.exports = router;