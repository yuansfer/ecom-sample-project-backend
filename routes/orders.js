const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/auth.middleware');
const MIDDLEWARES = [authenticate];

router
    .route('/')
    .get([MIDDLEWARES], orderController.findAll)

router
    .route('/:id')
    .get([MIDDLEWARES], orderController.findOne)


module.exports = router;