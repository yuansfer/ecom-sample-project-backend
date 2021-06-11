const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middlewares/auth.middleware');
const MIDDLEWARES = [authenticate];

router.route('/secure-pay')
    .post([MIDDLEWARES], paymentController.securePay)

router.route('/refund-request')
    .post([MIDDLEWARES], paymentController.refundRequest)

router.route('/revoke-auto-pay')
    .post([MIDDLEWARES], paymentController.revokeAutoPay)

router
    .route('/authorize')
    .post([MIDDLEWARES], paymentController.authorize);

router
    .route('/auto-debit-pay')
    //.post([MIDDLEWARES], paymentController.autoDebitPay);
    .post(paymentController.autoDebitPay);

router.route('/test')
    .get(paymentController.test)

router.route('/test1')
    .get(paymentController.test1)

module.exports = router;