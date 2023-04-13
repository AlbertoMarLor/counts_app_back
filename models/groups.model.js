const getAll = () => {
    return db.query('SELECT * FROM groups;');
}

const getById = (groupId) => {
    return db.query('select * from groups where id = ?',
        [groupId]
    )
}


const create = ({ name, date, description }) => {
    return db.query(`INSERT INTO groups
    (name,
    date,
    description)
    VALUES
    (?,?,?);`,
        [name, date, description]
    )
}

const deleteById = (groupId) => {
    return db.query('DELETE FROM groups WHERE id = ?',
        [groupId]
    )
}

module.exports = { getAll, create, deleteById, getById }