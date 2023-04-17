const router = require('express').Router();

const { checkAdmin } = require('../../helpers/middlewares');
const { getAll, deleteById, getGroupById, create, updateById, createUsersHasGroups, getUserByUsername, addUser } = require('../../models/groups.model');



router.get('/', async (req, res) => {

    try {
        const [groups] = await getAll();

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
            return res.json({ fatal: 'No existe pelicula con ese ID' })
        }
        res.json(result[0]);
    } catch (error) {
        res.json({ fatal: error.message })
    }




});


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


router.post('/:groupId/addUsers/:username', checkAdmin(), async (req, res) => {


    try {


        const { groupId } = req.params
        const username = await getUserByUsername(req.body.username)
        const userId = username[0][0].id

        if (!username) {
            return res.json('Este usuario no existe, debe registrarse')

        }
        const addedUser = await addUser(userId, groupId)

        return res.json(addedUser)




    } catch (error) {
        res.json({ fatal: error.message })
    }


}
)


router.put('/:groupId', checkAdmin(), async (req, res) => {

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


module.exports = router;
