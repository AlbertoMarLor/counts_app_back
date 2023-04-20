const { checkToken, checkAdmin } = require('../helpers/middlewares');

const router = require('express').Router();


router.use('/groups', checkToken, require('./api/group'));
router.use('/users', require('./api/users'));
router.use('/groups/bills', checkToken, require('./api/bills'));



module.exports = router;