const router = require('express').Router();


const { getById, deleteBill, getAll, create, updateById, createGroupsHasBills, getUsersHasBills, creditorUsersHasBills, getTotalAmount, findBillByName, updateMemberDebt, getTotalMemberDebt, operations, getOperations, quantityOperations, updateOperations } = require('../../models/bills.model');
const { getUserById } = require('../../models/users.model')
const { getUsersFromGroup, countGroupMembers, getGroupById } = require('../../models/groups.model');
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

    } catch (error) {
        res.json({ fatal: error.message });
    }
})

router.get('/getTotalDebt/:groupId', async (req, res) => {
    const { groupId } = req.params;
    console.log(req.admin)

    try {
        //lo que debe cada miembro
        const [totalDebt] = await getTotalMemberDebt(groupId);

        return res.json(totalDebt)


    } catch (error) {
        res.json({ fatal: error.message })
    }
})


router.get('/amount/debts/:groupId/users', checkAdmin(), async (req, res) => {
    const { groupId } = req.params;
    try {

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
        const [nMembers] = await countGroupMembers(groupId);
        const [allOperations] = await getOperations(groupId)

        let { totalMembers } = nMembers[0]
        const addBill = (Number(newBill[0].quantity));
        //console.log('Addbill:', addBill)

        //lo que debe cada participante en cada bill
        const memberDebt = addBill / totalMembers
        //console.log('memberDebt:', memberDebt);

        await updateMemberDebt(memberDebt, result.insertId)



        //inserción tabla intermedia operations: INACABADO
        const [totalAmount] = await getTotalAmount(groupId);

        //lo que debe cada miembro (tabla bills)
        const [totalDebt] = await getTotalMemberDebt(groupId);

        //lo que tiene que cobrar el admin
        const totalAdmin = (totalAmount - totalDebt)
        const groupIdNum = Number(groupId)


        /* 
        
                if (allOperations.length === 0) {
                    console.log('funciona')
                    for (let member of membersGroup) {
                        if (member.role === admin) {
                            return await operations(member.id, member.username, totalAdmin, groupId)
                        } else {
                            return await operations(member.id, member.username, totalDebt, groupId)
                        }
                    }
        
                } else {
                    console.log('no existe el grupo')
                } */


        await createGroupsHasBills(groupId, newBill[0].id)
        for (let member of membersGroup) {
            if (member.role === admin) {
                await creditorUsersHasBills(member.id, newBill[0].id, 1, addBill)


            } else {
                await creditorUsersHasBills(member.id, newBill[0].id, 0, addBill)
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
