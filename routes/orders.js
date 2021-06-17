const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/auth.middleware');
const MIDDLEWARES = [authenticate];
// const passport = require("passport");
// const MIDDLEWARES = [passport.authenticate('jwt', { session: false })];

router
    .route('/')
    .get([MIDDLEWARES], orderController.findAll)

router
    .route('/:id')
    .get([MIDDLEWARES], orderController.findOne)


module.exports = router;