const getAll = (groupId) => {
    return db.query(`SELECT b.id, b.name, b.date, b.quantity, b.memberDebt FROM counts_app.groups_has_bills as ghb
    JOIN counts_app.groups as g ON groups_id = g.id
    JOIN counts_app.bills as b ON bills_id = b.id 
    WHERE g.id = ?;`, [groupId]);
}

const create = ({ name, date, quantity }) => {
    return db.query(`INSERT INTO counts_app.bills
    (name,
    date,
    quantity)
    VALUES
    (?,?,?)`,
        [name, date, quantity]
    );
}

const updateMemberDebt = (memberDebt, billId) => {
    return db.query(`update counts_app.bills 
    set memberDebt = ?
    WHERE id = ?`,
        [memberDebt, billId]);
}


const getAdmin = () => {
    return db.query(`SELECT * from counts_app.users, counts_app.users_has_groups WHERE users.id = users_has_groups.users_id AND role = admin`)
}

const getUsersHasGroups = (userId, groupId) => {
    return db.query('SELECT * FROM counts_app.users_has_groups WHERE users_id = ? AND groups_id = ? AND role = "admin"', [userId, groupId])
}

const getUsersHasBills = (groupId) => {
    return db.query(`SELECT u.id, u.username as "groupId" FROM counts_app.users as u
    JOIN counts_app.users_has_groups as uhg ON users_id = u.id
    JOIN counts_app.groups as g ON g.id = groups_id
    WHERE g.id = ?`, [groupId]);
}

const createGroupsHasBills = (groups_id, bills_id) => {
    return db.query(`INSERT INTO counts_app.groups_has_bills
        (groups_id,
        bills_id)
        VALUES
        (?,?)`,
        [groups_id, bills_id]);
}

const creditorUsersHasBills = (users_id, bills_id, creditor, amount) => {
    return db.query(`INSERT INTO counts_app.users_has_bills
    (users_id,
    bills_id,
    creditor,
    amount)
    VALUES(?,?,?,?)`, [users_id, bills_id, creditor, amount])

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

const operations = (id, username, quantity, groupId) => {
    return db.query(`INSERT INTO counts_app.operations
        (users_id,
            users_username,
            quantity,
            group_id)
    VALUES
            (?,?,?,?)`, [id, username, quantity, groupId]);
}
const getOperations = (groupId) => {
    return db.query(`SELECT o.users_id, o.users_username, o.quantity, o.group_id FROM counts_app.operations as o
    JOIN counts_app.groups as g ON g.id = o.group_id
    WHERE g.id = ?`, [groupId]);
}
const quantityOperations = (userId) => {
    return db.query(`SELECT o.quantity FROM counts_app.operations as o
    JOIN counts_app.users as u ON u.id = o.users_id
    JOIN counts_app.groups as g ON g.id = o.group_id
    WHERE u.id = ?;`, [userId])
}
const updateOperations = (quantity, groupId) => {
    return db.query(`update counts_app.operations 
        set quantity = ?`, [quantity, groupId])
}


const deleteBill = (billId) => {
    return db.query('delete from bills where id = ?', [billId]);
}


const getTotalAmount = (groupId) => {
    return db.query(`SELECT SUM(b.quantity) as "suma" from counts_app.bills as b
    JOIN counts_app.groups_has_bills as ghb ON ghb.bills_id = b.id
    JOIN counts_app.groups as g ON g.id = ghb.groups_id
    where g.id = ?;`, [groupId])
}

const getTotalMemberDebt = (groupId) => {
    return db.query(`SELECT SUM(b.memberDebt) as "totalMemberDebt" from counts_app.bills as b
    JOIN counts_app.groups_has_bills as ghb ON ghb.bills_id = b.id
    JOIN counts_app.groups as g ON g.id = ghb.groups_id
    where g.id = ?;`, [groupId])
}

const findBillByName = ({ word }, groupId) => {
    console.log(word)
    return db.query("select b.id, b.name, b.quantity, b.date from counts_app.bills as b JOIN counts_app.groups_has_bills as ghb ON ghb.bills_id = b.id JOIN counts_app.groups as g ON g.id = ghb.groups_id WHERE b.name LIKE '%" + word + "%' and g.id = ?", [groupId])

    /* "select * from counts_app.bills WHERE bills.name LIKE '%" + word + "%'" */
}

module.exports = { getById, deleteBill, getAll, create, updateById, getAdmin, getUsersHasGroups, createGroupsHasBills, getUsersHasBills, creditorUsersHasBills, getTotalAmount, findBillByName, updateMemberDebt, getTotalMemberDebt, operations, getOperations, quantityOperations, updateOperations }