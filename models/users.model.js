const create = ({ username, email, password }) => {
    return db.query('insert into users (username, email, password) values(?,?,?)', [username, email, password]);
}

const getByEmail = (email) => {
    return db.query('select * from users where email = ?', [email]);
}

const getUserById = (userId) => {
    return db.query('select * from users where id = ?', [userId]);
}

const getUserByUsername = (username) => {
    return db.query('SELECT users.id FROM counts_app.users WHERE users.username = ?', [username])
}



module.exports = { create, getByEmail, getUserById, getUserByUsername }