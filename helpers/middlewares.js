//Todos los middleswares para expres tienen (req(obj entrante), res(respuesta) y next(que siga para adelante la funcion))

const jwt = require('jsonwebtoken');
const { getById } = require("../models/users.model");

const checkToken = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.json({ fatal: 'Debes incluir la cabecera Autorization' });
    }
    const token = req.headers['authorization'];

    let obj;
    try {
        obj = jwt.verify(token, 'clave ultrasecreta');
    } catch (err) {
        res.json({ fallo: 'error en el token' })
    }

    const [result] = await getById(obj.user_id);
    req.user = result[0].username;

    next();
}

const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.json({ fatal: 'Debes ser admin' })
    }
    next();
}


module.exports = {
    checkToken, checkAdmin
}