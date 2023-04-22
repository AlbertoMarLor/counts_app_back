const getAll = (userId) => {
    return db.query(`SELECT g.id, g.name, g.date, g.description FROM counts_app.users_has_groups as uhg
    JOIN counts_app.groups as g ON groups_id = g.id
    JOIN counts_app.users as u ON users_id = u.id 
    WHERE u.id = ?;`, [userId]);
}

const getUsersFromGroup = (groupId) => {
    return db.query(`SELECT u.id, u.username FROM counts_app.users as u
    JOIN counts_app.users_has_groups as uhg ON users_id = u.id
    JOIN counts_app.groups as g ON g.id = groups_id
    WHERE g.id = ?;`, [groupId]);
}

const getGroupById = (groupId) => {
    return db.query('select * from counts_app.groups where id = ?',
        [groupId]
    )
}

const createUsersHasGroups = (userId, groupId) => {

    return db.query(`INSERT INTO counts_app.users_has_groups
    (users_id,
    groups_id,
    role)VALUES(?,?,"admin");`,
        [userId, groupId])
}



const addUser = (userId, groupId) => {
    return db.query(`INSERT INTO counts_app.users_has_groups
        (users_id,
        groups_id,
        role)
        VALUES 
        (?,?, "regular");`, [userId, groupId])
}


const updateById = (groupId, { name, date, description }) => {
    return db.query(
        `update counts_app.groups set
        name = ?,
        date = ?,
        description = ? where id = ?
        `,
        [name, date, description, groupId]
    )
}



const create = ({ name, date, description }) => {
    return db.query(`INSERT INTO counts_app.groups
    (name,
    date,
    description)
    VALUES
    (?,?,?);`,
        [name, date, description]
    )
}

const deleteById = (groupId) => {
    return db.query('DELETE FROM counts_app.groups WHERE id = ?',
        [groupId]
    )
}

const findUser = ({ word }) => {

    return db.query("SELECT * FROM counts_app.users WHERE users.username LIKE '%" + word + "%'")
}



module.exports = { getAll, create, deleteById, getGroupById, updateById, createUsersHasGroups, addUser, findUser, getUsersFromGroup }