const router = require('express').Router();
const authController = require('../controllers/authController');

router
	.route('/login')
	.post(authController.login)

router
	.route('/register')
	.post(authController.register)

router
	.route('/logout')
	.post(authController.logout)

// router
// .route('/refresh')
// .post(authController.refresh)

module.exports = router;