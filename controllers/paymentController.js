var models = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// const yuansfer = require('../utils/Yuansfer-js-sdk');
require('dotenv').config()

const { _success, _error, _messages, _purchaseMode } = require('../constants');
const { _getError, _uuid, _referenceNo, _extractObject } = require('../utils/helper');
const moment = require('moment');
var _ = require('lodash');
var numeral = require('numeral');

var cs = require('../services/common.service');
var ycs = require('../services/yuansfer.service');

module.exports = {
	securePay: async (req, res) => {

		const { cart_id, customer_id, vendor, redirect_url } = req.body;
		let errorMessage;

		if (!process.env.MERCHANT_NO) {
			errorMessage = _messages.MERCHANT_NO_MISSING
		} else if (!process.env.STORE_NO) {
			errorMessage = _messages.MERCHANT_STORE_NO_MISSING
		} else if (!process.env.TOKEN) {
			errorMessage = _messages.MERCHANT_TOKEN_MISSING
		} else if (!process.env.ENVIRONMENT) {
			errorMessage = _messages.MERCHANT_ENVIRONMENT_MISSING
		} else if (!process.env.CURRENCY) {
			errorMessage = _messages.CURRENCY_MISSING
		} else if (!process.env.SETTLECURRENCY) {
			errorMessage = _messages.SETTLECURRENCY
		} else if (!process.env.TERMINAL) {
			errorMessage = _messages.TERMINAL_MISSING
		} else if (!customer_id) {
			errorMessage = _messages.CUSTOMER_MISSING
		} else if (!cart_id) {
			errorMessage = _messages.UNKNOWN_CART
		} else if (!redirect_url) {
			errorMessage = _messages.REDIRECT_URL_MISSING
		} else if (!vendor) {
			errorMessage = _messages.VENDOR_MISSING
		}

		if (errorMessage) {
			await res.status(200).send(_error([], errorMessage))
		} else {
			try {

				var paidResult;
				await models.sequelize.transaction(async () => {

					let query = `
										SELECT p.title,p.type,p.price,cp.qty, p.price*cp.qty AS total
										FROM products p
										LEFT JOIN cart_products cp ON cp.product_id = p.id AND cp.purchase_mode ='buy'
										JOIN carts c ON c.id = cp.cart_id
										WHERE c.id = ${cart_id} AND c.customer_id = ${customer_id}`

					const cartProducts = await models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT })

					if (!cartProducts.length) {
						throw new Error(_getError(_messages.CART_EMPTY));
					}

					var goodsInfo = _.map((cartProducts || []), p => {
						return {
							goods_name: [_.get(p, 'title', ''), _.get(p, 'type', '')].join(' '),
							quantity: `${p.qty}`,
						};
					});

					const amount = _.sumBy(cartProducts, (p) => numeral(p.total).value());

					await ycs._init()

					//if (yuansfer) {

					var securePayResponse = await ycs._securePay({
						amount: `${amount}`,
						callbackUrl: redirect_url,
						currency: `${process.env.CURRENCY}`,
						...(vendor === 'truemoney') && {    // FOR TRUE-MONEY
							currency: `THB`,
						},
						...(vendor === 'tng') && {    // FOR TOUCH-N-GO
							currency: `MYR`,
						},
						...(vendor === 'gcash') && {    // FOR GCash
							currency: `PHP`,
						},
						...(vendor === 'dana') && {    // FOR Dana
							currency: `IDR`,
						},
						...(vendor === 'paypay') && {    // FOR PayPay
							currency: `JPY`,
						},
						...(vendor === 'kakaopay') && {    // FOR Kakao Pay
							currency: `KRW`,
						},
						...(vendor === 'bkash') && {    // FOR bKash
							currency: `BDT`,
						},
						...(vendor === 'easypaisa') && {    // FOR Easy-Paisa
							currency: `PKR`,
						},
						goodsInfo: JSON.stringify(goodsInfo),
						ipnUrl: redirect_url,
						reference: "ORDER#" + new Date().getTime(),
						settleCurrency: `${process.env.SETTLECURRENCY}`,
						terminal: `${process.env.TERMINAL}`,
						vendor: vendor,
						...(vendor === 'creditcard') && {
							creditType: 'normal',
						}
					})

					console.log('securePayResponse', securePayResponse)

					if (securePayResponse) {

						console.log('PAYMENT RESPONSE', securePayResponse)

						const { ret_code, ret_msg, result } = securePayResponse

						if (ret_code === ycs._responseCode.SUCCESS) {

							paidResult = result;

							// COPY CART DATA INTO ORDER DATA [START]
							const orderData = await cs._addOrderData({
								cart_id: cart_id,
								customer_id: customer_id,
							})

							if (orderData && orderData.order_id) {

								// ADD PAYMENT DATA [START]
								const { amount, cashierUrl, currency, reference, settleCurrency, transactionNo } = result

								await models.Payment.create({
									customer_id: customer_id,
									order_id: orderData.order_id,
									vendor: vendor,
									reference: reference,
									paid_amount: amount,
									currency: currency,
									settle_currency: settleCurrency,
									transaction_no: transactionNo,
									cashier_url: decodeURI(cashierUrl),
									success_code: ret_code,
									success_message: ret_msg,
								})
								// ADD PAYMENT DATA [END]

								securePayResponse = {
									...securePayResponse,
									...orderData
								}

								await res.send(_success([securePayResponse], _messages.PAYMENT_DONE))
							}
							// COPY CART DATA INTO ORDER DATA [END]

						} else {
							throw new Error(_getError(ret_msg));
						}
					} else {
						throw new Error("Secure Pay Not Done");
					}
					//}
				})
			} catch (error) {

				(async function () {
					/* Revert Payment in case of any issue if paid */
					if (paidResult) {
						const { amount, currency, reference, settleCurrency, transactionNo } = paidResult

						await ycs._refund({
							refundAmount: `${amount}`,
							currency: `${currency}`,
							settleCurrency: `${settleCurrency}`,
							...(transactionNo) && {
								transactionNo: transactionNo,
							},
							...(!transactionNo) && {
								reference: reference,
							}
						})
					}

					await res.status(400).send(_error([], _getError(error)))
				})();
			}
		}
	},

	refundRequest: async (req, res) => {

		const { customer_id, order_id } = req.body;
		let errorMessage;

		if (!process.env.MERCHANT_NO) {
			errorMessage = _messages.MERCHANT_NO_MISSING
		} else if (!process.env.STORE_NO) {
			errorMessage = _messages.MERCHANT_STORE_NO_MISSING
		} else if (!process.env.TOKEN) {
			errorMessage = _messages.MERCHANT_TOKEN_MISSING
		} else if (!process.env.ENVIRONMENT) {
			errorMessage = _messages.MERCHANT_ENVIRONMENT_MISSING
		} else if (!customer_id) {
			errorMessage = _messages.CUSTOMER_MISSING
		} else if (!order_id) {
			errorMessage = _messages.UNKNOWN_ORDER
		}

		if (errorMessage) {
			await res.status(200).send(_error([], errorMessage))
		} else {
			try {

				await models.sequelize.transaction(async () => {

					const payment = await models.Payment.findOne({
						where: {
							customer_id: customer_id,
							order_id: order_id,
						},
					})

					if (payment) {
						const { vendor, reference, paid_amount, currency, settle_currency, transaction_no } = payment

						await ycs._init()

						//if (yuansfer) {
						/**
					* transactionNo, reference cannot exist the same time.
					*/

						const refundData = await ycs._refund({
							refundAmount: paid_amount,
							currency: currency,
							settleCurrency: settle_currency,
							...(transaction_no) && {
								transactionNo: transaction_no,
							},
							...(!transaction_no) && {
								reference: reference,
							},
							//refundReference: '',
						})

						console.log('REFUND REQUEST > RESPONSE', refundData)

						if (refundData) {
							const { result, ret_msg, ret_code } = refundData
							if (ret_code === ycs._responseCode.SUCCESS) {
								const { amount, currency, reference, refundAmount, refundReference, refundTransactionNo, settleCurrency, status, transactionNo } = result

								await models.Refund.create({
									payment_id: payment.id,
									customer_id: customer_id,
									order_id: order_id,
									amount: amount,
									currency: currency,
									reference: reference,
									refund_amount: refundAmount,
									refund_reference: refundReference,
									refund_transaction_no: refundTransactionNo,
									settle_currency: settleCurrency,
									status: status,
									transaction_no: transactionNo,
									success_code: ret_code,
									success_message: ret_msg,
								})
								await res.send(_success([refundData], _messages.REFUND_INITIATED))

							} else {
								console.log('ERROR')
								throw new Error(_getError(ret_msg));
							}
						} else {
							throw new Error(_getError('Refund Error'));
						}
						//}
					} else {
						throw new Error(_getError('Unknown Payment'));
					}

				})
			} catch (error) {
				//await res.status(400).send(_error([], _getError(error)))
				res.send(_error([], _getError(error)))
			}
		}
	},

	authorize: async (req, res) => {

		const { customer_id, vendor, redirect_url } = req.body
		let errorMessage;

		if (!process.env.MERCHANT_NO) {
			errorMessage = _messages.MERCHANT_NO_MISSING
		} else if (!process.env.STORE_NO) {
			errorMessage = _messages.MERCHANT_STORE_NO_MISSING
		} else if (!process.env.TOKEN) {
			errorMessage = _messages.MERCHANT_TOKEN_MISSING
		} else if (!process.env.ENVIRONMENT) {
			errorMessage = _messages.MERCHANT_ENVIRONMENT_MISSING
		} else if (!process.env.TERMINAL) {
			errorMessage = _messages.TERMINAL_MISSING
		} else if (!customer_id) {
			errorMessage = _messages.CUSTOMER_MISSING
		} else if (!vendor) {
			errorMessage = _messages.VENDOR_MISSING
		} else if (!redirect_url) {
			errorMessage = _messages.REDIRECT_URL_MISSING
		}

		if (errorMessage) {
			await res.status(200).send(_error([], errorMessage))
		} else {
			try {

				await ycs._init()

				//if (yuansfer) {

				const temp_id = _uuid();
				const params = {
					autoIpnUrl: `${process.env.BACKEND_ENDPOINT_URL}` + '/payments/test',
					autoRedirectUrl: redirect_url + '/?tmp=' + temp_id,
					autoReference: _referenceNo(),
					terminal: `${process.env.TERMINAL}`,
					vendor: vendor,
				}

				const autoDebitConsultData = await ycs._autoDebitConsult(params)

				if (autoDebitConsultData) {

					console.log('AUTHORIZE RESPONSE', autoDebitConsultData)

					const { ret_code, ret_msg, result } = autoDebitConsultData
					const { authUrl, autoDebitNo, autoReference } = result

					if (ret_code === ycs._responseCode.SUCCESS) {

						await models.RecurringAuthorization.create({
							temp_id: temp_id,
							customer_id: customer_id,
							auth_url: authUrl,
							auto_debit_no: autoDebitNo,
							auto_reference: autoReference,
							vendor: vendor,
							success_code: ret_code,
							success_message: ret_msg,
						})
						await res.send(_success([result], _messages.AUTHORIZE_SUCCESS))
					} else {
						throw new Error(_getError(ret_msg));
					}
				} else {
					throw new Error(_getError(_messages.AUTHORIZE_ERROR));
				}
				//}
			} catch (error) {
				await res.status(400).send(_error([], _getError(error)))
			}
		}
	},

	autoDebitPay: async (req, res) => {

		const { customer_id, tmp } = req.body
		let errorMessage;

		if (!process.env.MERCHANT_NO) {
			errorMessage = _messages.MERCHANT_NO_MISSING
		} else if (!process.env.STORE_NO) {
			errorMessage = _messages.MERCHANT_STORE_NO_MISSING
		} else if (!process.env.TOKEN) {
			errorMessage = _messages.MERCHANT_TOKEN_MISSING
		} else if (!process.env.ENVIRONMENT) {
			errorMessage = _messages.MERCHANT_ENVIRONMENT_MISSING
		} else if (!process.env.CURRENCY) {
			errorMessage = _messages.CURRENCY_MISSING
		} else if (!process.env.SETTLECURRENCY) {
			errorMessage = _messages.SETTLE_CURRENCY_MISSING
		} else if (!customer_id) {
			errorMessage = _messages.CUSTOMER_MISSING
		}

		if (errorMessage) {
			await res.status(200).send(_error([], errorMessage))
		} else {
			try {

				await models.sequelize.transaction(async () => {

					const authData = await models.RecurringAuthorization.findOne({
						where: {
							customer_id: customer_id,
							temp_id: tmp,
						}
					})

					if (!authData.auto_debit_no) {
						throw new Error(_getError(_messages.AUTO_DEBIT_NUMBER_EMPTY));
					}

					const autoDebitNo = authData.auto_debit_no

					const cartData = +await models.Cart.findAll({
						where: {
							customer_id: customer_id,
						},
						include: [
							{
								required: true,
								model: models.CartProduct,
								as: 'products',
								where: {
									purchase_mode: _purchaseMode.SUBSCRIBE,
									subscribe_month: {
										[Op.gte]: 1
									}
								},
								include: [
									{
										required: true,
										model: models.Product,
										as: 'product',
									}
								],
							},
						],
					})

					if (cartData && cartData[0]) {

						const { products, shipping_address, shipping_city_state, shipping_country, shipping_email, shipping_phone } = cartData[0]

						const cartId = cartData[0].id;

						/* Set order information from cart */
						const orderData = await models.Order.create({
							customer_id: customer_id,
							address: shipping_address,
							city_state: shipping_city_state,
							country: shipping_country,
							email: shipping_email,
							phone: shipping_phone,
						})

						for (let cartProduct of products) {

							const { product_id, qty, size, purchase_mode, subscribe_month, product: { price } } = cartProduct
							const amount = (numeral(numeral(price).value() * parseInt(qty)).value())

							if (amount > 0) {

								await ycs._init()

								//if (yuansfer) {

								const tokenData = await cs._applyToken({ customer_id: customer_id, tmp: tmp })

								if (tokenData && tokenData.auto_debit_no && tokenData.auto_reference) {

									/* Secure Pay */
									const autoPayData = await ycs._autoDebitPay({
										autoDebitNo: `${autoDebitNo}`,
										amount: `${amount}`,
										currency: `${process.env.CURRENCY}`,
										settleCurrency: `${process.env.SETTLECURRENCY}`,
										reference: _referenceNo(),
										ipnUrl: `${process.env.BACKEND_ENDPOINT_URL}` + '/payments/test3',
									})

									console.log('AUTO DEBIT RESPONSE', autoPayData)

									const { ret_code, ret_msg, result } = autoPayData
									const { amount, autoDebitNo, currency, reference, settleCurrency, transactionNo, status } = result

									if (ret_code === ycs._responseCode.SUCCESS && status === 'success') {

										/* Delete product from cart */
										await models.CartProduct.destroy({
											where: {
												cart_id: cartId,
												product_id: product_id,
											}
										})

										/* Set order product information from cart product */
										await models.OrderProduct.create({
											order_id: orderData.id,
											product_id: product_id,
											qty: qty,
											price: price,
											size: size,
											purchase_mode: purchase_mode,
											subscribe_month: subscribe_month,
										})

										/* Create subscription for individual product */
										const subscriptionData = await models.Subscription.create({
											customer_id: customer_id,
											order_id: orderData.id,
											product_id: product_id,
											amount: amount,
											start_date: moment().format('YYYY-MM-DD'),
											subscribe_month: subscribe_month,
											auto_debit_no: autoDebitNo,
										})

										/* Create subscription payment */
										await models.SubscribePayment.create({
											subscription_id: subscriptionData.id,
											customer_id: customer_id,
											order_id: orderData.id,
											paid_amount: amount,
											auto_debit_no: autoDebitNo,
											currency: currency,
											reference: reference,
											settle_currency: settleCurrency,
											transaction_no: transactionNo,
											status: status,
											success_code: ret_code,
											success_message: ret_msg,
										})
									} else {
										throw new Error(ret_msg);
									}
								}
								//}
							}
						}

						/* Clear Cart */
						await models.Cart.destroy({ where: { id: cartId, customer_id: customer_id } })
						await res.send(_success([{ order_id: orderData.id }], _messages.AUTO_DEBIT_PAYMENT_SUCCESS))

					} else {
						throw new Error(_messages.CART_EMPTY);
					}
				})
			} catch (error) {
				await res.status(400).send(_error([], _getError(error)))
			}
		}
	},

	revokeAutoPay: async (req, res) => {

		const { customer_id, order_id, auto_debit_no } = req.body;
		let errorMessage;

		if (!process.env.MERCHANT_NO) {
			errorMessage = _messages.MERCHANT_NO_MISSING
		} else if (!process.env.STORE_NO) {
			errorMessage = _messages.MERCHANT_STORE_NO_MISSING
		} else if (!process.env.TOKEN) {
			errorMessage = _messages.MERCHANT_TOKEN_MISSING
		} else if (!process.env.ENVIRONMENT) {
			errorMessage = _messages.MERCHANT_ENVIRONMENT_MISSING
		} else if (!customer_id) {
			errorMessage = _messages.CUSTOMER_MISSING
		} else if (!order_id) {
			errorMessage = _messages.UNKNOWN_ORDER
		} else if (!auto_debit_no) {
			errorMessage = _messages.AUTO_DEBIT_NUMBER_EMPTY
		}

		if (errorMessage) {
			await res.status(200).send(_error([], errorMessage))
		} else {
			try {

				await models.sequelize.transaction(async () => {

					const subscribePaymentData = await models.SubscribePayment.findOne({
						where: {
							customer_id: customer_id,
							order_id: order_id,
							auto_debit_no: auto_debit_no,
						},
					})

					if (subscribePaymentData) {

						await ycs._init()
						const autoDebitRevoke = await ycs.autoDebitRevoke({ autoDebitNo: auto_debit_no, })

						if (autoDebitRevoke) {

							console.log('AUTO DEBIT REVOKE RESPONSE', autoDebitRevoke)
							const { ret_code, ret_msg, result } = autoDebitRevoke

							if (ret_code === ycs._responseCode.SUCCESS) {

								// SET CANCEL SUBSCRIPTION HISTORICAL DATA [START]
								const { autoDebitNo, autoReference, vendor } = result

								await models.CancelSubscription.create({
									customer_id: customer_id,
									order_id: order_id,
									vendor: vendor,
									auto_debit_no: autoDebitNo,
									auto_reference: autoReference,
									success_code: ret_code,
									success_message: ret_msg,
								})
								// SET CANCEL SUBSCRIPTION HISTORICAL DATA [END]

								// REMOVE SUBSCRIPTION PAYMENT [START]
								await models.SubscribePayment.destroy({
									where: {
										customer_id: customer_id,
										order_id: order_id,
									}
								})
								// REMOVE SUBSCRIPTION PAYMENT [END]

								// REMOVE SUBSCRIPTION [START]
								await models.Subscription.destroy({
									where: {
										customer_id: customer_id,
										order_id: order_id,
									}
								})
								// REMOVE SUBSCRIPTION [END]

								// REMOVE RECURRING AUTH [START]
								await models.RecurringAuthorization.destroy({
									where: {
										customer_id: customer_id,
										order_id: order_id,
									}
								})
								// REMOVE RECURRING AUTH [END]

								await res.send(_success([autoDebitRevoke], _messages.AUTO_DEBIT_PAY_REVOKED_SUCCESS))
							} else {
								throw new Error(_getError(ret_msg));
							}
						}
					} else {
						throw new Error(_getError(_messages.NO_SUBSCRIPTION_FOUND));
					}
				})
			} catch (error) {
				await res.status(400).send(_error([error], _getError(error)))
			}
		}
	},

	test: async (req, res) => {
		console.log('test > req', req)
	},

	test1: async (req, res) => {
		console.log('test1 > req', req)
	},

	test2: async (req, res) => {
		console.log('test2 > req', req)
	},
};