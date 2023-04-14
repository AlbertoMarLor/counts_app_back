const router = require('express').Router();

const { getAll, deleteById, getById, create } = require('../../models/groups.model');



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
        const [result] = await getById(groupId);
        if (result.length === 0) {
            return res.json({ fatal: 'No existe pelicula con ese ID' })
        }
        res.json(result[0]);
    } catch (error) {
        res.json({ fatal: error.message })
    }




});


router.post('/newGroup', async (req, res) => {


    try {
        const [newGroup] = await create(req.body);
        const [group] = await getById(newGroup.insertId);
        res.json(group[0]);
    } catch (error) {
        res.json({ fatal: error.message })
    }

});


router.delete('/:groupId', async (req, res) => {

    const { groupId } = req.params;
    try {
        const [group] = await getById(groupId);
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
