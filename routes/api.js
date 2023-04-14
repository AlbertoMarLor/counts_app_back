const { checkToken } = require('../helpers/middlewares');

const router = require('express').Router();


router.use('/groups', checkToken, require('./api/group'));
router.use('/users', require('./api/users'));



module.exports = router;