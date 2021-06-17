var models = require('../models/index');
const { _success, _error, _notifications, _messages } = require('../constants');
const { _getError, } = require('../utils/helper');
const { httpApiError } = require('../utils/errorBaseClass')

module.exports = {

	/**
	* @method get
	* @description To get list of all historical orders details of customers with payment, refund and subscription information
	* @param req,
	* @returns {object}
	*/
	findAll: async (req, res, next) => {
		console.log('hi')
		const { customer_id, purchase_mode } = req.query;

		try {
			const orders = await models.Order.findAll({
				attributes: ['id', 'customer_id', 'vendor'],
				where: {
					...(customer_id) && { customer_id: customer_id },
					...(purchase_mode) && { '$products.purchase_mode$': purchase_mode },
				},
				include: [
					{
						model: models.OrderProduct,
						as: 'products',
						attributes: ['id', 'order_id', 'price', 'product_id', 'qty', 'size', 'purchase_mode', 'subscribe_month',
							// [Sequelize.literal('(qty * price)'), 'total_price']
						],
						//IFNULL(qty, 0)
						include: [
							{
								model: models.Product,
								as: 'product',
								attributes: ['id', 'title', 'type'],
							}
						],
					},

					{
						model: models.Payment,
						as: 'payment',
						attributes: ['id', 'customer_id', 'order_id', 'paid_amount', 'vendor', 'transaction_no', 'success_code'],
					},
					{
						model: models.Refund,
						as: 'refund',
						attributes: ['id', 'payment_id', 'customer_id', 'order_id', 'reference', 'refund_reference', 'refund_transaction_no', 'status', 'success_code'],
					},
					{
						model: models.SubscribePayment,
						as: 'subscribe_payment',
						attributes: ['id', 'customer_id', 'order_id', 'paid_amount', 'auto_debit_no', 'reference', 'transaction_no', 'success_code'],
						include: [
							{
								model: models.RecurringAuthorization,
								as: 'recurring_auth',
								attributes: ['id', 'vendor', 'auto_reference'],
							}
						],
					},
					{
						model: models.CancelSubscription,
						as: 'cancel_subscription',
						attributes: ['id', 'customer_id', 'order_id', 'vendor', 'auto_debit_no', 'auto_reference'],
					},
					{
						model: models.Customer,
						as: 'customer',
					}
				]
			})

			await res.status(200).send(_success(orders))
		} catch (error) {
			next(new httpApiError(400, _getError(error)))
		}
	},

	/**
	* @method get
	* @description To get an order details of customer with subscription information
	* @param req,
	* @returns {object}
	*/
	findOne: async (req, res, next) => {
		const { id } = req.params

		if (!id) {
			next(new httpApiError(400, _messages.UNKNOWN_ORDER))
		}

		try {
			const order = await models.Order.findOne({
				where: {
					id: id,
				},
				include: [
					{
						model: models.OrderProduct,
						as: 'products',
						include: [
							{
								model: models.Product,
								as: 'product',
							}
						],
					}, {
						model: models.SubscribePayment,
						as: 'subscribe_payment',
						attributes: ['id', 'customer_id', 'order_id', 'paid_amount', 'auto_debit_no', 'transaction_no', 'reference']
					}
				],
			})
			await res.status(200).send(_success(order))
		} catch (error) {
			next(new httpApiError(400, _getError(error)))
		}
	},
};