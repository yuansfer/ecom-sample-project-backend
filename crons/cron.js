let models = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
//const yuansfer = require('../utils/Yuansfer-js-sdk');
// var cs = require('../services/common.service');
var ycs = require('../services/yuansfer.service');

var _cron = require("node-cron");

const { _getError, _referenceNo } = require('../utils/helper');

const _ = require('lodash');
const moment = require('moment');

//let schedule_time = '*/5 * * * * *'; // TESTING PURPOSE ONLY

const autoDebitPay = async () => {

	try {

		let schedule_time = process.env.AUTO_DEBIT_PAY_SCHEDULE;
		console.log('Schedule Time', schedule_time)

		var AutoDebitPayCron = _cron.schedule(schedule_time, async () => {

			let cronLogData = await models.CronLog.create({
				name: 'AUTO_DEBIT_PAY_SCHEDULE',
				start_at: new Date(),
			});

			let log = {}

			const currentDate = moment().format('YYYY-MM-DD');

			if (cronLogData.id) {

				await models.sequelize.transaction(async () => {

					let successLogs = []
					let errorLogs = []

					const subscriptionsData = await models.Subscription.findAll({
						include: [
							{
								required: true,
								model: models.Product,
								as: 'product',
							},
							{
								required: true,
								model: models.Customer,
								as: 'customer',
							},
						],
					})

					if (subscriptionsData) {
						for (let subscription of subscriptionsData) {

							const subscriptionId = subscription.id
							const { customer_id, order_id, product_id, amount, start_date, subscribe_month, auto_debit_no } = subscription

							const subscriptionDate = moment(start_date).add(parseInt(subscribe_month), 'months').format('YYYY-MM-DD')
							console.log('----------------------------------')
							console.log('Start Subscription Date', start_date)
							console.log('Today', currentDate)
							console.log('Next Subscription Date', subscriptionDate)
							console.log('----------------------------------')

							let query = `SELECT id FROM subscribe_payments WHERE subscription_id = '${subscriptionId}' AND DATE(created_at) = DATE(NOW()) AND customer_id='${customer_id}' AND order_id = '${order_id}'`

							const subscribePaymentData = await models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT })

							if (!subscribePaymentData.length) {
								if (Number(amount) > 0) {

									if (auto_debit_no) {

										await ycs._init()
										const autoPayData = await ycs._autoDebitPay({
												autoDebitNo: `${auto_debit_no}`,
												amount: `${amount}`,
												currency: `${process.env.CURRENCY}`,
												settleCurrency: `${process.env.SETTLECURRENCY}`,
												reference: _referenceNo(),
												ipnUrl: `${process.env.BACKEND_ENDPOINT_URL}` + '/payments/test3',
											}).catch(async error => {

												errorLogs.push({
													customer_id: customer_id,
													order_id: order_id,
													product_id: product_id,
													amount: amount,
													subscribe_payment_error: JSON.stringify(error)
												})
												throw new Error(_getError(error));

											})

											if (autoPayData) {

												console.log('AUTO DEBIT RESPONSE', autoPayData)
												const { ret_code, ret_msg, result } = autoPayData
												const { amount, autoDebitNo, currency, reference, settleCurrency, transactionNo, status } = result

												if (ret_code === ycs._responseCode.SUCCESS && status === 'success') {

													/* Create subscription payment [START] */
													await models.SubscribePayment.create({
														subscription_id: subscriptionId,
														customer_id: customer_id,
														order_id: order_id,
														paid_amount: amount,
														auto_debit_no: autoDebitNo,
														currency: currency,
														reference: reference,
														settle_currency: settleCurrency,
														transaction_no: transactionNo,
														status: status,
														success_code: ret_code,
														success_message: ret_msg,
													}).catch(async error => {
														errorLogs.push({
															customer_id: customer_id,
															order_id: order_id,
															product_id: product_id,
															amount: amount,
															subscribe_payment_error: JSON.stringify(result)
														})
														throw new Error(_getError(error));
													})

													successLogs.push({
														customer_id: customer_id,
														order_id: order_id,
														product_id: product_id,
														amount: amount,
														subscribe_payment_result: JSON.stringify(result)
													})

													/* Create subscription payment [END] */
												} else {
													errorLogs.push({
														customer_id: customer_id,
														order_id: order_id,
														product_id: product_id,
														amount: amount,
														subscribe_payment_error: JSON.stringify(result)
													})
													throw new Error(ret_msg);
												}
											}
									}

								} else {
									errorLogs.push({
										customer_id: customer_id,
										order_id: order_id,
										product_id: product_id,
										amount: amount,
										subscribe_payment_error: JSON.stringify({ error: 'Invalid Amount Issue' })
									})
									throw new Error(`Invalid Amount Issue`);
								}
							}
						}
					}

					log = {
						success: successLogs,
						error: errorLogs,
					}
					await models.CronLog.update({
						log: JSON.stringify(log),
						end_at: new Date(),
					}, {
						where: {
							id: cronLogData.id
						}
					});

				}).catch(async error => {
					_getError(error)
				});
			}
		}, {
			scheduled: true,
			timezone: process.env.TIME_ZONE
		});
		AutoDebitPayCron.start();

	} catch (error) {
		console.log('error', error);
	}
};

module.exports = {
	autoDebitPay,
}