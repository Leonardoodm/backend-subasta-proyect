const jwt = require('jsonwebtoken');

const createdJWT = ( id = '') => {
    return new Promise( (resolve, reject) => {

        const payload = { id }

        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '3h'
        }, (err, token) => {
            if (err) return reject('No se pudo generar el token');
            resolve(token);
        })
    })
} 

module.exports = {
    createdJWT
}