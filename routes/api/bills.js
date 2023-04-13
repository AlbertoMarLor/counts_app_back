const { getById, deleteBill } = require('../../models/bills.model');

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
