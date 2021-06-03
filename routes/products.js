const router = require('express').Router();
const productController = require('../controllers/productController');

router
	.route('/')
	.get(productController.findAll)

router
	.route('/:id')
	.get(productController.findByPk)

module.exports = router;