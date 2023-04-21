const getAll = (groupId) => {
    return db.query(`SELECT b.id, b.name, b.date, b.quantity FROM counts_app.groups_has_bills as ghb
    JOIN counts_app.groups as g ON groups_id = g.id
    JOIN counts_app.bills as b ON bills_id = b.id 
    WHERE g.id = ?;`, [groupId]);
}

const create = ({ name, quantity }) => {
    return db.query(`INSERT INTO counts_app.bills
    (name,
    quantity)
    VALUES
    (?,?)`,
        [name, quantity]
    );
}

const getAdmin = () => {
    return db.query(`SELECT * from counts_app.users, counts_app.users_has_groups WHERE users.id = users_has_groups.users_id AND role = admin`)
}

const getUsersHasGroups = (userId, groupId) => {
    return db.query('SELECT * FROM counts_app.users_has_groups WHERE users_id = ? AND groups_id = ? AND role = "admin"', [userId, groupId])
}

const createGroupsHasBills = (groups_id, bills_id) => {
    return db.query(`INSERT INTO counts_app.groups_has_bills
        (groups_id,
        bills_id)
        VALUES
        (?,?)`,
        [groups_id, bills_id]);
}


const getById = (billId) => {
    return db.query('select * from counts_app.bills where id = ?', [billId]);
}

const updateById = (billId, { name, quantity, date }) => {
    return db.query(
        `update counts_app.bills 
        set name = ?,
        quantity = ?,
        date = ?
        WHERE id = ?`,
        [name, quantity, date, billId]
    );
}


const deleteBill = (billId) => {
    return db.query('delete from bills where id = ?', [billId]);
}


module.exports = { getById, deleteBill, getAll, create, updateById, getAdmin, getUsersHasGroups, createGroupsHasBills }