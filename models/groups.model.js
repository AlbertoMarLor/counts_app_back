const getAll = () => {
    return db.query('SELECT * FROM counts_app.groups');
}

const getGroupById = (groupId) => {
    return db.query('select * from counts_app.groups where id = ?',
        [groupId]
    )
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

module.exports = { getAll, create, deleteById, getGroupById, updateById }