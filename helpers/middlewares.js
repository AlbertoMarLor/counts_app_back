//Todos los middleswares para expres tienen (req(obj entrante), res(respuesta) y next(que siga para adelante la funcion))

const jwt = require('jsonwebtoken');
const { getUserById } = require("../models/users.model");

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

    const [result] = await getUserById(obj.user_id);
    req.user = result[0]

    next();
}

const checkAdmin = () => {

    return async (req, res, next) => {
        const userId = req.user.id
        const { groupId } = req.params

        const [admin] = await db.query(`SELECT * FROM counts_app.users_has_groups WHERE users_id = ? AND groups_id = ? AND role = "admin"`, [userId, groupId])

        if (admin.length > 0 && admin[0].role === "admin") {
            req.admin = admin;
            return next()
        }


        res.json({ fatal: 'Debes ser Admin' })

    }

}


module.exports = {
    checkToken, checkAdmin
}