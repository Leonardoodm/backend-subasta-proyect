const { response, request } = require('express');

const Producto = require('../models/producto');
const SubastaVenta = require('../models/subastaVenta');


const productoGetId = async (req = request, res = response) => {

    const { id } = req.params;

    try {
        const producto = await Producto.findByPk(id);


        res.status(200).json({
            producto
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }

}

const productosGet = async (req = request, res = response) => {

    // const { page = 0, size = 15 } = req.query;

    // let options = {
    //     limit: +size,
    //     offset: (+page) * (+size)
    // }

    // const { count, rows } = await producto.findAndCountAll(options)

    const { status = 1 } = req.query;
    try {
        const productos = await Producto.findAll({ where: { status: status } });

        res.status(200).json({
            productos
            // count, rows
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }

}

const productosRevGet = async (req = request, res = response) => {
    const { id } = req.userAutenticated;

    try {
        // Obtener todos los productos del revendedor
        const productosRev = await Producto.findAll({ where: { revendedorID: id } });

        // Obtener todos los productos en subasta con estado de pedido 'canceladoAdm'
        const productosCancelados = await SubastaVenta.findAll({ 
            where: { estadoPedido: 'canceladoAdm' },
            attributes: ['productoID'] 
        });

        // Crear un conjunto con los IDs de los productos cancelados
        const productosCanceladosIDs = new Set(productosCancelados.map(prod => prod.productoID));

        // Filtrar los productos del revendedor para excluir los cancelados y seleccionar solo los de status 0, 1 o 2
        const productosFiltrados = productosRev.filter(prod => 
            !productosCanceladosIDs.has(prod.id) && [0, 1].includes(prod.status)
        );

        // Enviar la respuesta con los productos filtrados
        res.status(200).json({
            productosRev: productosFiltrados
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};




const productosPost = async (req, res = response) => {

    const { modelo, marca, talla, descripcion, tipo } = req.body;
    const { id } = req.userAutenticated;
    const revendedorID = id;
    const status = 1;


    // Guardar en la base de datos
    try {
        const newProduct = await Producto.create({ modelo, marca, talla, descripcion, tipo, status, revendedorID });

        res.status(201).json({
            msg: 'El producto fue creado correctamente',
            newProduct
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }

}

const productosPut = async (req, res = response) => {
    const { id } = req.params;
    const { modelo, marca, talla, descripcion, tipo, status } = req.body;

    try {
        const productoUpdate = await Producto.findByPk(id);

        
        // Crear un objeto con los campos a actualizar
        const updatedFields = {};
        if (modelo !== undefined) updatedFields.modelo = modelo;
        if (marca !== undefined) updatedFields.marca = marca;
        if (talla !== undefined) updatedFields.talla = talla;
        if (descripcion !== undefined) updatedFields.descripcion = descripcion;
        if (tipo !== undefined) updatedFields.tipo = tipo;
        if (status !== undefined) updatedFields.status = status;


        // Actualizar el producto en la base de datos
        await productoUpdate.update(updatedFields);
        res.status(200).json({
            msg: 'El producto fue actualizado correctamente',
            productoUpdate,

        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};



const productosDelete = async (req, res = response) => {
    const { id } = req.params;
    // console.log(req);


    try {
        const { userAutenticated } = req;
        const productoDelete = await Producto.findByPk(id);

        productoDelete.status = 0;


        await productoDelete.save();

        res.status(200).json({
            msg: `El producto ${id}, fue eliminado correctamente`,
            userAutenticated
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}




module.exports = {
    productosGet,
    productosPost,
    productosPut,
    productosDelete,
    productoGetId,
    productosRevGet,
}