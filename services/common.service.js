
require('dotenv').config()
//const yuansfer = require('../utils/Yuansfer-js-sdk');
var models = require('../models/index');

var _ = require('lodash');
const moment = require('moment');
const { _getError, _compareDate } = require('../utils/helper');
const { _purchaseMode, _messages } = require('../constants');

var ycs = require('../services/yuansfer.service');

const _refreshToken = async (auto_debit_no) => {

	return new Promise(async (resolve, reject) => {
		try {
			await ycs._init()

			//if (yuansfer) {

			await ycs._autoDebitApplyToken({
					autoDebitNo: auto_debit_no,
					grantType: ycs._grantType.REFRESH_TOKEN,
				}).then(async tokenData => {
					if (tokenData) {

						console.log('REFRESH TOKEN RESPONSE', tokenData)

						const { ret_code, ret_msg, result } = tokenData
						if (ret_code === ycs._responseCode.SUCCESS) {
							resolve(result);
						}
					}
				})
			//}

		} catch (error) {
			reject(_getError(error));
		}
	})
}

const _createNewToken = async (auto_debit_no) => {

	return new Promise(async (resolve, reject) => {
		try {
			await ycs._init()

			//if (yuansfer) {

			await ycs._autoDebitApplyToken({
					autoDebitNo: auto_debit_no,
					grantType: ycs._grantType.AUTHORIZATION_CODE,
				}).then(async tokenData => {
					if (tokenData) {
						const { ret_code, ret_msg, result } = tokenData
						if (ret_code === ycs._responseCode.SUCCESS) {
							resolve(result);
						}
					}
				}).catch(async error => {
					console.log(`CREATE NEW TOKEN > ERROR`, error);
					reject(_getError(error));
				})
			//}

		} catch (error) {
			reject(_getError(error));
		}
	})
}

const _applyToken = async ({ customer_id, order_id = 0, tmp }) => {

	return new Promise(async (resolve, reject) => {

		const recurringAuth = await models.RecurringAuthorization.findOne({
			where: {
				customer_id: customer_id,
				...(!tmp && order_id) && {
					order_id: order_id
				},
				...(tmp && !order_id) && {
					temp_id: tmp,
				},
			}
		})

		if (recurringAuth) {
			const { id, auto_debit_no, vendor } = recurringAuth

			try {
				await ycs._init()

				//if (yuansfer) {
					const token = await models.Token.findOne({
						where: {
							customer_id: customer_id,
							auto_debit_no: auto_debit_no,
						}
					})

					if (!token) {
						console.log('token doest not exists')

						/* If no token exists, apply for new token */
						const tokenData = await ycs._autoDebitApplyToken({
							autoDebitNo: auto_debit_no,
							grantType: ycs._grantType.AUTHORIZATION_CODE,
						})

						if (tokenData) {

							console.log('APPLY TOKEN RESPONSE', tokenData)

							const { ret_code, ret_msg, result } = tokenData
							const { accessTokenExpiryTime, autoDebitNo, autoReference, refreshTokenExpiryTime } = result

							if (ret_code === ycs._responseCode.SUCCESS) {

								try {
									await models.Token.create({
										recurring_auth_id: id,
										customer_id: customer_id,
										auto_debit_no: autoDebitNo,
										auto_reference: autoReference,
										vendor: vendor,
										access_token_expiry_time: accessTokenExpiryTime,
										refresh_token_expiry_time: refreshTokenExpiryTime,
										success_code: ret_code,
										success_message: ret_msg,
									})
									resolve(token);
								} catch (error) {
									reject(_getError(error));
								}
							} else {
								reject(ret_msg);
							}
						} else {
							reject(_getError(error));
						}

					} else {

						console.log('token exists')
						/***
						 *  If token exists, then check access expiry time
						 *  If it is expired, refresh it
						 */
						const isTokenValid = _compareDate(moment(token.access_token_expiry_time), moment())

						if (!isTokenValid) {
							const tokenData = await ycs._autoDebitApplyToken({
								autoDebitNo: auto_debit_no,
								grantType: ycs._grantType.REFRESH_TOKEN,
							})

							if (tokenData) {

								console.log('REFRESH TOKEN RESPONSE', tokenData)
								const { ret_code, ret_msg, result } = tokenData

								if (ret_code === ycs._responseCode.SUCCESS) {
									const { accessTokenExpiryTime, refreshTokenExpiryTime } = result
									token.access_token_expiry_time = accessTokenExpiryTime
									token.refresh_token_expiry_time = refreshTokenExpiryTime
									token.success_code = ret_code
									token.success_message = ret_msg
									await token.save()
								}
							}
						}
						//return await token;
						resolve(token);
					}
				//}
			} catch (error) {
				reject(_getError(error));
			}
		} else {
			reject("Invalid Apply Token Access");
		}
	});
}

const _addOrderData = async ({ cart_id, customer_id, vendor }) => {

	return new Promise(async (resolve, reject) => {

		try {

			const cart = await models.Cart.findOne({
				where: {
					id: cart_id,
					customer_id: customer_id,
				},
				include: [
					{
						required: true,
						model: models.CartProduct,
						as: 'products',
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

			if (cart) {

				const { shipping_address, shipping_city_state, shipping_country, shipping_email, shipping_phone, products } = cart

				const order = await models.Order.create({
					customer_id: customer_id,
					address: shipping_address,
					city_state: shipping_city_state,
					country: shipping_country,
					email: shipping_email,
					phone: shipping_phone,
					vendor: vendor,
				})

				if (order) {

					const order_id = order.id;

					for (let p of products) {
						await models.OrderProduct.create({
							order_id: order_id,
							product_id: _.get(p, 'product.id', 0),
							qty: p.qty,
							price: _.get(p, 'product.price', 0),
							purchase_mode: p.purchase_mode,
							...(p.purchase_mode === _purchaseMode.SUBSCRIBE && p.subscribe_month) && {
								subscribe_month: p.subscribe_month,
							},
						})
					}

					// EMPTY CART & IT'S PRODUCTS ONCE PAYMENT DONE [START]
					await models.CartProduct.destroy({ where: { cart_id: cart_id } })

					await models.Cart.destroy({ where: { id: cart_id, customer_id: customer_id } })
					// EMPTY CART & IT'S PRODUCTS ONCE PAYMENT DONE [END]

					resolve({ order_id: order_id });
				}
			} else {
				reject(_messages.CART_EMPTY);
			}
		} catch (error) {
			reject(_getError(error));
		}
	})
}

module.exports = {
	_applyToken,
	_addOrderData,
	_createNewToken,
	_refreshToken,
}