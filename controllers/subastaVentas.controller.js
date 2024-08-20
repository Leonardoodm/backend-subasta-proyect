const { response, request } = require('express');

const Producto = require('../models/producto');
const SubastaVenta = require('../models/subastaVenta');
const { Op } = require('sequelize');
const Usuario = require('../models/usuario');


const subastaGetId = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const subastaVenta = await SubastaVenta.findByPk(id);

        if (!subastaVenta) {
            return res.status(404).json({
                msg: 'SubastaVenta no encontrada'
            });
        }

        const revendedorData = await Usuario.findByPk(subastaVenta.revendedorID);
        const clienteData = await Usuario.findByPk(subastaVenta.clienteID);
        const productoData = await Producto.findByPk(subastaVenta.productoID);

        const rev = revendedorData ? { id: revendedorData.id, nombre: revendedorData.nombre } : null;
        const cli = clienteData ? { id: clienteData.id, nombre: clienteData.nombre } : null;
        const produc = productoData ? { id: productoData.id, modelo: productoData.modelo, marca: productoData.marca, talla: productoData.talla, descripcion: productoData.descripcion,  tipo: productoData.tipo,} : null;

        const subastaVentaDetails = {
            ...subastaVenta.toJSON(),
            revendedor: rev,
            cliente: cli,
            producto: produc
        };

        res.status(200).json({
            subastaVenta: subastaVentaDetails
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};


const comprasClienteGet = async (req = request, res = response) => {
    const {status = 'completado'} = req.query;
    const { id } = req.userAutenticated;

    try {
        const subastaVenta = await SubastaVenta.findAll({
            where: {
                [Op.and]: [
                    { estadoPedido: status },
                    { clienteID: id }
                ]
            }
        });

        if (subastaVenta.length === 0) {
            return res.status(404).json({
                subastaVenta: []
            });
        }
        console.log(subastaVenta);

        const subastaVentaDetails = await Promise.all(subastaVenta.map(async (item) => {
            const revendedorData = await Usuario.findByPk(item.revendedorID);
            const clienteData = await Usuario.findByPk(item.clienteID);
            const productoData = await Producto.findByPk(item.productoID);

            const rev = revendedorData ? { id: revendedorData.id, nombre: revendedorData.nombre } : null;
            const cli = clienteData ? { id: clienteData.id, nombre: clienteData.nombre } : null;
            const produc = productoData ? { id: productoData.id, modelo: productoData.modelo, marca: productoData.marca, talla: productoData.talla, descripcion: productoData.descripcion,  tipo: productoData.tipo,} : null;

            return {
                ...item.toJSON(),
                revendedor: rev,
                cliente: cli,
                producto: produc
            };
        }));

        res.status(200).json({
            subastaVenta: subastaVentaDetails
        });

    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};
const subastaGet = async (req = request, res = response) => {
    const { status = 'procesando' } = req.query; // Obtener parámetro de consulta, no de ruta

    try {
        const subastaVenta = await SubastaVenta.findAll({ where: { estadoPedido: status } });

        if (subastaVenta.length === 0) {
            return res.status(404).json({
                subastaVenta: []
            })
        }

        res.status(200).json({
            subastaVenta
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};

const subastaStateGet = async (req = request, res = response) => {
    const { status } = req.query;
    const { id, rol } = req.userAutenticated;

    try {
        // Construir la condición del where dinámicamente
        let whereCondition = {};

        if (rol === 'administrador') {
            // Si el rol es administrador y status no está vacío, filtrar por estadoPedido
            if (status) {
                whereCondition.estadoPedido = status;
            }
        } else {
            // Si el rol no es administrador, añadir la condición del revendedorID
            whereCondition = {
                revendedorID: id
            };
            // Añadir la condición del estadoPedido si status no está vacío
            if (status) {
                whereCondition.estadoPedido = status;
            }
        }

        const subastaVenta = await SubastaVenta.findAll({
            where: whereCondition
        });

        if (subastaVenta.length === 0) {
            return res.status(404).json({
                subastaVenta: []
            });                     
        }
       
        // Obtener detalles adicionales
        const subastaVentaDetails = await Promise.all(subastaVenta.map(async (item) => {
            const revendedorData = await Usuario.findByPk(item.revendedorID);
            const clienteData = await Usuario.findByPk(item.clienteID);
            const productoData = await Producto.findByPk(item.productoID);

            const rev = revendedorData ? { id: revendedorData.id, nombre: revendedorData.nombre } : null;
            const cli = clienteData ? { id: clienteData.id, nombre: clienteData.nombre } : null;
            const produc = productoData ? { id: productoData.id, modelo: productoData.modelo, marca: productoData.marca, talla: productoData.talla, descripcion: productoData.descripcion,  tipo: productoData.tipo,} : null;

            return {
                ...item.toJSON(),
                revendedor: rev,
                cliente: cli,
                producto: produc
            };
        }));

        res.status(200).json({
            subastaVenta: subastaVentaDetails
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};



const subastaPost = async (req, res = response) => {
    const { precioEstimado, productoID } = req.body;
    const clienteID = 0;
    const precioPuja = 0;
    const estadoPedido = 'procesando';

    try {
        // Obtener el producto
        const producto = await Producto.findByPk(productoID);

        const { revendedorID } = producto;
        const status = 2;



        // Guardar en la base de datos
        const newVentaSubasta = await SubastaVenta.create({
            precioPuja,
            precioEstimado,
            productoID,
            clienteID,
            estadoPedido,
            revendedorID
        });

        // Actualizar el estado del producto
        await producto.update({ status });

        res.status(201).json({
            msg: 'La subasta fue creada correctamente',
            newVentaSubasta
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};

// hace la compra
const buySubastaPut = async (req, res = response) => {
    const { id: subastaId } = req.params;
    const { precioPuja } = req.body;
    const estadoPedido = 'pendienteRev';
    const { id: userId } = req.userAutenticated;

    try {

        const buySubastaUpdate = await SubastaVenta.findByPk(subastaId);



        await buySubastaUpdate.update({
            precioPuja: precioPuja,
            clienteID: userId,
            estadoPedido: estadoPedido
        });

        res.status(201).json({
            msg: 'La compra fue realizada exitosamente, espere respuesta del seguimiento',
            buySubastaUpdate
        });

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};

// putRevendedor
const subastaPut = async (req, res = response) => {
    const { id: subastaId } = req.params;
    const { estadoPedido, postAgain = 0 } = req.body;
    const { id: userId, rol } = req.userAutenticated;

    try {

        const subastaUpdate = await SubastaVenta.findByPk(subastaId);


        if (rol === 'administrador' || userId === subastaUpdate.revendedorID) {
            const productoUpdate = await Producto.findByPk(subastaUpdate.productoID);

            switch (estadoPedido) {
                case 'aceptadoRev':
                    await subastaUpdate.update({ estadoPedido: 'enviandoAdm' });
                    return res.status(200).json({
                        msg: 'El producto fue actualizado correctamente',
                        // subastaUpdate
                    });

                case 'canceladoRev':
                    await subastaUpdate.update({ estadoPedido: estadoPedido });
                    await productoUpdate.update({ status: postAgain === 1 ? 1 : 0 });

                    return res.status(200).json({
                        msg: 'El producto fue actualizado correctamente',
                        // subastaUpdate,
                    });

                default:
                    return res.status(400).json({
                        msg: `El estado del pedido ${estadoPedido} no es válido.`
                    });
            }
        } else {
            return res.status(403).json({
                msg: 'No tienes permiso para actualizar esta subasta.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};

// putAdmin
const subastaAdmPut = async (req, res = response) => {
    const { id: subastaId } = req.params;
    const { estadoPedido } = req.body;

    try {

        const subastaAdmUpdate = await SubastaVenta.findByPk(subastaId);

        const productoAdmUpdate = await Producto.findByPk(subastaAdmUpdate.productoID);

        switch (estadoPedido) {
            case 'aceptadoAdm':
                await subastaAdmUpdate.update({ estadoPedido: 'enviandoUsu' });
                return res.status(200).json({
                    msg: 'El producto fue actualizado correctamente',
                    // subastaUpdate
                });

            case 'canceladoAdm':
                await subastaAdmUpdate.update({ estadoPedido: estadoPedido });
                await productoAdmUpdate.update({ status: 0 });

                return res.status(200).json({
                    msg: 'El producto fue actualizado correctamente',
                    // subastaUpdate,
                });

            default:
                return res.status(400).json({
                    msg: `El estado del pedido ${estadoPedido} no es válido.`
                });
        }
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};

// putUsuario
const subastaUsuPut = async (req, res = response) => {
    const { id: subastaId } = req.params;
    const { estadoPedido } = req.body;

    try {

        const subastaUsuUpdate = await SubastaVenta.findByPk(subastaId);

        const productoUsuUpdate = await Producto.findByPk(subastaUsuUpdate.productoID);

        switch (estadoPedido) {
            case 'recibidoUsu':
                await subastaUsuUpdate.update({ estadoPedido: 'completado' });
                await productoUsuUpdate.update({ status: 3 });
                return res.status(200).json({
                    msg: 'El producto fue actualizado correctamente',
                    // subastaUpdate
                });

            default:
                return res.status(400).json({
                    msg: `El estado del pedido ${estadoPedido} no es válido.`
                });
        }
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};

// const subastaDelete = async (req, res = response) => {
//     const { id } = req.params;
//     // console.log(req);


//     try {
//         const { userAutenticated } = req;
//         const productoDelete = await Producto.findByPk(id);

//         productoDelete.status = 0;


//         await productoDelete.save();

//         res.status(200).json({
//             msg: `El producto ${id}, fue eliminado correctamente`,
//             userAutenticated
//         });
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// }




module.exports = {
    subastaGetId,
    subastaGet,
    subastaStateGet,
    subastaPost,
    subastaPut,
    // subastaDelete,
    subastaAdmPut,
    buySubastaPut,
    subastaUsuPut,
    comprasClienteGet,
}


