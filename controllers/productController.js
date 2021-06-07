var models = require('../models/index');
const { _success, _error, _notifications } = require('../constants');

module.exports = {

	/**
	* @method get
	* @description To get list of all products
	* @param req,
	* @returns {object}
	*/
	findAll: async (req, res) => {
		try {
			const products = await models.Product.findAll()
			await res.send(_success(products))
		} catch (error) {
			res.status(400).json(_error(error))
		}

	},

	/**
	* @method get
	* @description To get single product
	* @param req,
	* @returns {object}
	*/
	findByPk: async (req, res) => {
		const { id } = req.params
		try {
			const product = await models.Product.findByPk(id)
			await res.send(_success(product))
		} catch (error) {
			res.status(400).json(_error(error))
		}
	},
};