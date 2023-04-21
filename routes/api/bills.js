const router = require('express').Router();


const { getById, deleteBill, getAll, create, updateById, getUsersHasGroups, createGroupsHasBills, getUsersHasBills, createUsersHasBills } = require('../../models/bills.model');
const { getUserById } = require('../../models/users.model');


router.get('/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params
        const [bills] = await getAll(groupId);
        res.json(bills);
    } catch (error) {
        res.json({ fallo: error.message })
    }
});



router.get('/id/:billId', async (req, res) => {
    const { billId } = req.params;

    try {

        const [result] = await getById(billId)
        if (result.length === 0) {

            return res.json({ fatal: 'El gasto que buscas no existe' })
        }
        const bill = result[0];

        res.json(bill);
    } catch (error) {
        res.json({ fatal: error.message })
    }
})

router.get('/get/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        const [result] = await getUsersHasBills(groupId)
        if (result.length === 0) {
            return res.json({ fatal: 'This group has no bills' })
        }
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message })
    }

})




router.post('/:groupId/newBill', async (req, res) => {
    try {
        const { groupId } = req.params
        const { userId } = req.user

        const [result] = await create(req.body)
        const [newBill] = await getById(result.insertId)
        const { amount } = newBill
        const { billId } = newBill
        await createGroupsHasBills(groupId, newBill[0].id)
        const res = await createUsersHasBills(userId, billId, 'true', amount)
        console.log(res);

        return res.json(newBill[0]);


    } catch (error) {
        res.json({ fallo: error.message });
    }
})


router.put('/edit/:groupId/:billId', async (req, res) => {
    const { billId } = req.params;
    try {
        await updateById(billId, req.body);
        const [bill] = await getById(billId)
        res.json(bill);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});


router.delete('/:groupId/:billId', async (req, res) => {
    const { billId } = req.params;

    try {
        const [bill] = await getById(billId)
        if (bill.length === 0) {
            return res.json({ fatal: 'El gasto que buscas no existe' })
        }

        await deleteBill(billId);
        res.json(bill[0])
    } catch (error) {
        res.json({ fatal: error.message });
    }
})


module.exports = router;
