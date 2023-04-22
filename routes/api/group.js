const router = require('express').Router();

const { checkAdmin } = require('../../helpers/middlewares');
const { getAll, deleteById, getGroupById, create, updateById, createUsersHasGroups, addUser, findUser, getUsersFromGroup } = require('../../models/groups.model');



router.get('/', async (req, res) => {
    const userId = req.user.id
    try {
        const [groups] = await getAll(userId);

        res.json(groups);
    } catch (error) {
        res.json({ fatal: error.message })
    }


});


router.get('/:groupId', async (req, res) => {

    const { groupId } = req.params;
    try {
        const [result] = await getGroupById(groupId);
        if (result.length === 0) {
            return res.json({ fatal: 'There is not group with that ID' })
        }
        res.json(result[0]);
    } catch (error) {
        res.json({ fatal: error.message })
    }


});


router.get('/id/:groupId/users', async (req, res) => {

    const { groupId } = req.params;
    try {
        const [users] = await getUsersFromGroup(groupId);
        res.json(users);
    } catch (error) {
        res.json({ fatal: error.message })
    }

})


router.post('/newGroup', async (req, res) => {

    const userId = req.user.id

    try {
        const [newGroup] = await create(req.body);
        const [group] = await getGroupById(newGroup.insertId);

        await createUsersHasGroups(userId, newGroup.insertId);


        res.json(group[0]);
    } catch (error) {
        res.json({ fatal: error.message })
    }

});


router.post('/:groupId/addUser', checkAdmin(), async (req, res) => {

    try {
        const addedUser = await addUser(req.body.userId, req.body.groupId)
        return res.json(addedUser)


    } catch (error) {
        res.json({ fatal: error.message })
    }


}
)


router.put('/edit/:groupId', checkAdmin(), async (req, res) => {

    try {
        const { groupId } = req.params;
        await updateById(groupId, req.body);
        const [group] = await getGroupById(groupId);
        res.json(group[0]);

    } catch (error) {
        res.json({ fatal: error.message })
    }
});


router.delete('/:groupId', checkAdmin(), async (req, res) => {

    const { groupId } = req.params;
    try {
        const [group] = await getGroupById(groupId);
        if (group.length === 0) {
            return res.json({ fatal: 'No existe un grupo con ese ID' });

        }

        await deleteById(groupId);

        res.json(group[0]);
    } catch (error) {
        res.json({ fatal: error.message })
    }

});


router.get('/:groupId/search/:word', async (req, res) => {

    try {

        const user = await findUser(req.params)

        res.json(user[0])


    } catch (error) {
        res.json({ fatal: error.message })
    }


})



module.exports = router;
