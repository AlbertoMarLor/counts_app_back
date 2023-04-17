const router = require('express').Router();


const { getById, deleteBill, getAll, create, updateById, getUsersHasGroups, createGroupsHasBills } = require('../../models/bills.model');
const { getUserById } = require('../../models/users.model');


router.get('/', async (req, res) => {
    try {
        const [bills] = await getAll();
        res.json(bills);
    } catch (error) {
        res.json({ fallo: error.message })
    }
});



router.get('/:billId', async (req, res) => {
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




router.post('/:groupId/newBill', async (req, res) => {
    try {
        const { groupId } = req.params

        const userId = req.user.id


        const usersGroups = await getUsersHasGroups(userId, groupId);

        if ([usersGroups][0][0].length !== 0) {

            const [result] = await create(req.body)
            const [newBill] = await getById(result.insertId)

            await createGroupsHasBills(groupId, newBill[0].id)


            return res.json(newBill[0]);

        }

        res.json('El ID del usuario y/o el grupo no coinciden o no es Admin')

    } catch (error) {
        res.json({ fallo: error.message });
    }
})


router.put('/:billId', async (req, res) => {
    const { billId } = req.params;
    try {
        await updateById(billId, req.body);
        const [bill] = await getById(billId)
        res.json(bill);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});


router.delete('/:billId', async (req, res) => {
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
