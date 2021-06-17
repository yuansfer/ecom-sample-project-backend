var models = require('../models/index');
const { _success, _error, _notifications } = require('../constants');
const { _getError } = require('../utils/helper');
const { httpApiError } = require('../utils/errorBaseClass')

module.exports = {

	/**
	* @method get
	* @description To get list of all products
	* @param req,
	* @returns {object}
	*/
	findAll: async (req, res, next) => {
		try {
			const products = await models.Product.findAll()
			await res.status(200).send(_success(products))
		} catch (error) {
			next(new httpApiError(400, _getError(error)))
		}
	},

	/**
	* @method get
	* @description To get single product
	* @param req,
	* @returns {object}
	*/
	findByPk: async (req, res, next) => {
		const { id } = req.params
		try {
			const product = await models.Product.findByPk(id)
			await res.status(200).send(_success(product))
		} catch (error) {
			next(new httpApiError(400, _getError(error)))
		}
	},
};