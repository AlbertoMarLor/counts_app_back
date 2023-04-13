const getById = (billId) => {
    return db.query('select * from bills where id ?', [billId]);
}


const deleteBill = (billId) => {
    return db.query('delete from bills where id = ?', [billId]);
}


module.exports = { getById, deleteBill }