const router = require('express').Router();


const { getById, deleteBill, getAll, create, updateById, getUsersHasGroups, createGroupsHasBills, getUsersHasBills, creditorUsersHasBills, getTotalAmount, findBillByName } = require('../../models/bills.model');
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

router.get('/amount/:groupId/%/users', async (req, res) => {
    const { groupId } = req.params;
    try {
        const [totalAmount] = await getTotalAmount(groupId);
        const [deptors] = await getUsersFromGroup(groupId)
        const [nMembers] = await countGroupMembers(groupId);
        const memberDebt = totalAmount / nMembers;
        let result = { username: '', dept: 0 }

        /*  const creditor = checkAdmin;
         if(!creditor){
            for(let deptor of deptors ){
             result = {username: deptor.username, dept: memberDebt}
            }
            return result;
         } 
         const totalDebt =  totalAmount - memberDebt; */

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
        const { id } = req.user;
        const admin = req.admin[0].role;

        const [result] = await create(req.body);
        const [newBill] = await getById(result.insertId);
        const [membersGroup] = await getUsersFromGroup(groupId);

        //console.log(membersGroup);
        //console.log(admin)

        await createGroupsHasBills(groupId, newBill[0].id)
        for (let member of membersGroup) {
            //console.log(member.role)
            if (member.role === admin) {
                const res1 = await creditorUsersHasBills(member.id, newBill[0].id, 1, newBill[0].quantity)


            } else {
                const res2 = await creditorUsersHasBills(member.id, newBill[0].id, 0, newBill[0].quantity)
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
