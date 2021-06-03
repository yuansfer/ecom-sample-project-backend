const router = require('express').Router();
const cartController = require('../controllers/cartController');

router
    .route('/')
    .get(cartController.findAll)
    .post(cartController.addORupdate);

router
    .route('/mode')
    .get(cartController.getMode)

router
    .route('/:id(\\d+)')
    .get(cartController.findOne)
    .delete(cartController.emptyCart);

// router
//     .route('/:id/product/:product_id')
//     .delete(cartController.removeProduct);

router
    .route('/:id(\\d+)/cart-product/:cart_product_id')
    .delete(cartController.removeProduct);

router
    .route('/:id(\\d+)/shipping')
    .put(cartController.addShipping)

router
    .route('/:id(\\d+)/product/:product_id')
    .put(cartController.updateProduct)

module.exports = router;