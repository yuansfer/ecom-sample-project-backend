const router = require('express').Router();

router.use('/products', require('./products'));
router.use('/carts', require('./carts'));
router.use('/orders', require('./orders'));
router.use('/payments', require('./payments'));
router.use('/auth', require('./auth'));

module.exports = router;