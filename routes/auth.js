const router = require('express').Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth.middleware');
const MIDDLEWARES = [authenticate];
// const passport = require("passport");
// const MIDDLEWARES = [passport.authenticate('jwt', { session: false })];

router
	.route('/login')
	.post(authController.login)

router
	.route('/register')
	.post(authController.register)

router
	.route('/logout')
	.post([MIDDLEWARES], authController.logout)

router
	.route('/token')
	.post([MIDDLEWARES], authController.token)

// router
// .route('/refresh')
// .post(authController.refresh)

module.exports = router;