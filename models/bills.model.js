const getAll = () => {
    return db.query('select * from counts_app.bills');
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


const getById = (billId) => {
    return db.query('select * from bills where id = ?', [billId]);
}


const deleteBill = (billId) => {
    return db.query('delete from bills where id = ?', [billId]);
}


module.exports = { getById, deleteBill, getAll, create }