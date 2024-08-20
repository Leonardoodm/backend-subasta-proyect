const { response, request } = require("express");

const isAdminRol = (req = request, res = response, next) => {

    if (!req.userAutenticated) return res.json(500).json({ msg: 'Se requiere verificar el rol sin validar el token.' })

    const { rol, nombre } = req.userAutenticated;

    if (rol !== 'administrador') return res.status(401).json({
        msg: `${nombre} no es administrador`
    })

    next()
}

const haveRole = (...roles) => {

    return (req = request, res = response, next) => {
        if (!req.userAutenticated) return res.json(500).json({ msg: 'Se requiere verificar el rol sin validar el token.' })

        if (!roles.includes(req.userAutenticated.rol)) return res.status(401).json({
            msg: `El servicio requiere alguno de estos roles ${roles}`
        })
        next()
    }
}



module.exports = {
    isAdminRol,
    haveRole
}