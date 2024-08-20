const Producto = require('../models/producto'); // Asegúrate de que la ruta sea correcta
const Usuario = require('../models/usuario'); // Asegúrate de que la ruta sea correcta

const isUserCreatedProductOrAdmin = async (req = request, res = response, next) => {
    try {
        const { id: userId } = req.userAutenticated;
        const { id: productId } = req.params; // Asume que el ID del producto se pasa como parámetro de ruta

        // Obtener el producto
        const producto = await Producto.findByPk(productId);
        
        // Verificar si el producto existe
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Verificar si el usuario autenticado es el creador del producto
        if (producto.revendedorID === userId) {
            return next(); // El usuario es el creador del producto, continuar con la solicitud
        }

        // Obtener el usuario autenticado
        const usuario = await Usuario.findByPk(userId);

        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Verificar si el usuario tiene el rol de administrador
        if (usuario.rol === 'administrador') {
            return next(); // El usuario es un administrador, continuar con la solicitud
        }

        // Si no es el creador del producto ni un administrador, denegar el acceso
        return res.status(403).json({ msg: 'No tiene permisos para realizar esta acción' });
    } catch (error) {
        console.error('Error en isUserCreatedProductOrAdmin:', error);
        return res.status(500).json({ msg: 'Error del servidor' });
    }
};

module.exports = {
    isUserCreatedProductOrAdmin
};