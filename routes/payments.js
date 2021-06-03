const router = require('express').Router();
const paymentController = require('../controllers/paymentController');

router.route('/secure-pay')
    .post(paymentController.securePay)

router.route('/refund-request')
    .post(paymentController.refundRequest)

router.route('/revoke-auto-pay')
    .post(paymentController.revokeAutoPay)

router
    .route('/authorize')
    .post(paymentController.authorize);

router
    .route('/auto-debit-pay')
    .post(paymentController.autoDebitPay);

router.route('/test')
    .get(paymentController.test)

router.route('/test1')
    .get(paymentController.test1)

module.exports = router;