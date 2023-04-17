const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');


const createToken = (user) => {
    const obj = {
        user_id: user.id,
        exp: dayjs().add(5, 'days').unix()
    }
    return jwt.sign(obj, 'clave ultrasecreta')
}



module.exports = {
    createToken
}
