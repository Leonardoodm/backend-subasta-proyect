const express = require('express');
const cors = require('cors');
const { sequelize, connectDatabase } = require('../db/config');
// const usuario = require('./usuario');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
                auth: '/api/auth',
            usuarios: '/api/usuarios',
            productos: '/api/productos',
            subastaVenta: '/api/subastaVenta',
        };


        // Ejecutar la función connectDatabase para verificar la conexión
        this.database();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async database() {
        await connectDatabase();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.usuarios, require('../routes/user.routes'));
        this.app.use(this.paths.productos, require('../routes/producto.routes'));
        this.app.use(this.paths.subastaVenta, require('../routes/subastaVenta.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }



}




module.exports = Server;
