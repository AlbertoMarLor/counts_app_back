const router = require('express').Router();


const { getById, deleteBill, getAll, create, updateById, createGroupsHasBills, getUsersHasBills, creditorUsersHasBills, getTotalAmount, findBillByName, operations, getOperations } = require('../../models/bills.model');
const { getUsersFromGroup, countGroupMembers } = require('../../models/groups.model');
const { checkAdmin } = require('../../helpers/middlewares');



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

router.get('/totalAmount/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        const [totalAmount] = await getTotalAmount(groupId);
        res.json(totalAmount);
        console.log(totalAmount);
    } catch (error) {
        res.json({ fatal: error.message });
    }
})

router.get('/amount/debts/:groupId/users', checkAdmin(), async (req, res) => {
    const { groupId } = req.params;
    try {
        const [totalAmount] = await getTotalAmount(groupId);
        const [members] = await getUsersFromGroup(groupId)
        const [nMembers] = await countGroupMembers(groupId);
        const admin = req.admin[0].role;


        const { suma } = totalAmount[0];
        const { totalMembers } = nMembers[0]

        //Lo que debe cada participante del grupo
        const memberDebt = suma / totalMembers;
        //Lo que tiene que cobrar el acreedor (admin del grupo)
        const totalDept = suma - memberDebt;


        for (let member of members) {
            console.log(member)
            if (member.role === admin) {
                const res = await operations(member.id, member.username, totalDept, groupId)
                console.log(res)

            } else {
                const res2 = await operations(member.id, member.username, memberDebt, groupId)
                console.log(res2)
            }
        }

        const [finalOperations] = await getOperations(groupId)
        return res.json(finalOperations)


    } catch (error) {
        res.json({ fatal: error.message })
    }
})


router.get('/search/:groupId/:word', async (req, res) => {
    try {
        const bill = await findBillByName(req.params)
        res.json(bill[0]);

    } catch (error) {
        res.json({ fatal: error.message });
    }
})


router.post('/:groupId/newBill', checkAdmin(), async (req, res) => {
    try {
        const { groupId } = req.params;
        const admin = req.admin[0].role;

        const [result] = await create(req.body);
        const [newBill] = await getById(result.insertId);
        const [membersGroup] = await getUsersFromGroup(groupId);

        await createGroupsHasBills(groupId, newBill[0].id)
        for (let member of membersGroup) {
            if (member.role === admin) {
                await creditorUsersHasBills(member.id, newBill[0].id, 1, newBill[0].quantity)


            } else {
                await creditorUsersHasBills(member.id, newBill[0].id, 0, newBill[0].quantity)
            }


        }


        res.json(newBill[0]);


    } catch (error) {
        res.json({ fallo: error.message });
    }
})


router.put('/edit/:groupId/:billId', checkAdmin(), async (req, res) => {
    const { billId } = req.params;
    try {
        await updateById(billId, req.body);
        const [bill] = await getById(billId)
        res.json(bill);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});


router.delete('/:groupId/:billId', checkAdmin(), async (req, res) => {
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
