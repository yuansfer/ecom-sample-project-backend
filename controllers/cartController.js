var models = require('../models/index');
const { _success, _error, _notifications, _messages, _purchaseMode } = require('../constants');
const { _getError, } = require('../utils/helper');

// var cs = require('../services/common.service');
var numeral = require('numeral');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  /**
  * @method get
  * @description To check payment mode of purchase for purticular customer user
  * @param req, customer_id
  * @returns {object}
  */
  getMode: async (req, res) => {
    const { customer_id, session_id } = req.query;

    if (!customer_id && !session_id) {
      res.status(200).send(_error([], _messages.CUSTOMER_MISSING))
    } else {
      const cart = await models.Cart.findOne({
        attributes: ['id', 'customer_id', 'session_id'],
        where: {
          ...(session_id) && { session_id: session_id },
          ...(customer_id) && { customer_id: customer_id },
        },
        include: [
          {
            attributes: ['cart_id', 'product_id', 'purchase_mode'],
            model: models.CartProduct,
            as: 'products',
          },
        ],
      })

      var response = { mode: '' }
      if (cart) {
        const { products } = cart;
        if (products && products[0] && products[0].purchase_mode) {
          response.mode = products[0].purchase_mode
        }
      }
      res.status(200).send(_success(response))
    }
  },

  /**
  * @method get
  * @description To get list of all cart details with product information
  * @param req,
  * @returns {object}
  */
  findAll: async (req, res) => {

    try {
      const carts = await models.Cart.findAll({
        include: [
          {
            model: models.CartProduct,
            as: 'products',
            include: [
              {
                model: models.Product,
                as: 'product',
              }
            ],
          },
        ],
      })

      res.status(200).send(_success(carts))
    } catch (error) {
      res.status(400).send(_error([], _getError(error)))
    }
  },

  /**
  * @method get
  * @description To get a cart details with product information
  * @param req,
  * @returns {object}
  */
  findOne: async (req, res) => {

    const { id } = req.params
    const { purchase_mode, customer_id, session_id } = req.query;

    if (!id) {
      res.status(200).send(_error([], _messages.UNKNOWN_CART))
    }

    try {

      const cart = await models.Cart.findOne({
        where: {
          ...(id) && { id: id },
          ...(customer_id) && { customer_id: customer_id },
          ...(session_id) && { session_id: session_id },
          ...(purchase_mode) && { '$products.purchase_mode$': purchase_mode },
        },
        include: [
          {
            model: models.CartProduct,
            as: 'products',
            include: [
              {
                model: models.Product,
                as: 'product',
              }
            ],
          },
        ],
      })

      res.status(200).send(_success(cart))
    } catch (error) {
      res.status(400).send(_error([], _getError(error)))
    }
  },

  /**
  * @method post
  * @description To Add new product into cart OR Update existed product information of cart
  * @param req, customer_id, product_id and other product detail
  * @returns {object}
  */
  addORupdate: async (req, res) => {
    const { customer_id, session_id, product_id, qty, size, purchase_mode, subscribe_month } = req.body
    let errorMessage;

    if (!customer_id && !session_id) {
      errorMessage = _messages.CUSTOMER_MISSING
    } else if (!product_id) {
      errorMessage = _messages.PRODUCT_MISSING
    } else if (!size) {
      errorMessage = _messages.PRODUCT_SIZE_MISSING
    } else if (!qty) {
      errorMessage = _messages.PRODUCT_QTY_INVALID
    } else if (purchase_mode === _purchaseMode.SUBSCRIBE) {
      if (!subscribe_month) {
        errorMessage = _messages.SUBSCRIPTION_MONTH_MISSING
      }
    }

    if (errorMessage) {
      res.status(200).send(_error([], errorMessage))
    } else {
      try {

        var cart = await models.Cart.findOne({
          where: {
            ...(customer_id) && { customer_id: customer_id },
            ...(session_id) && { session_id: session_id },
          }
        })

        if (!cart) {
          cart = await models.Cart.create({
            ...(customer_id) && { customer_id: customer_id },
            ...(session_id) && { session_id: session_id },
          })
        }

        const cartProduct = await models.CartProduct.findOne({
          where: {
            product_id: product_id,
            cart_id: cart.id,
            purchase_mode: purchase_mode,
            size: size,
          }
        })

        if (cartProduct) {

          cartProduct.qty = parseInt(cartProduct.qty) + parseInt(qty)
          if (subscribe_month) {
            cartProduct.subscribe_month = parseInt(subscribe_month)
          }
          await cartProduct.save()

          let successMessage = _messages.CART_UPDATED;
          if (purchase_mode === _purchaseMode.SUBSCRIBE) {
            successMessage = _messages.SUBSCRIBED_PRODUCT_UPDATED
          }
          res.status(200).send(_success([cart], successMessage))

        } else {
          await models.CartProduct.create({
            cart_id: cart.id,
            product_id: product_id,
            qty: qty,
            size: size,
            purchase_mode: purchase_mode,
            ...(subscribe_month) && { subscribe_month: parseInt(subscribe_month) }
          })

          let successMessage = _messages.PRODUCT_ADDED;
          if (purchase_mode === _purchaseMode.SUBSCRIBE) {
            successMessage = _messages.PRODUCT_SUBSCRIBED
          }
          res.status(200).send(_success([cart], successMessage))
        }

      } catch (error) {
        res.status(400).send(_error([], _getError(error)))
      }
    }
  },

  /**
  * @method put
  * @description To Update product information of cart
  * @param req, cart_id, product_id and other product detail
  * @returns {object}
  */
  updateProduct: async (req, res) => {

    const { cart_id, cart_product_id, product_id, qty, size, subscribe_month } = req.body
    let errorMessage;

    if (!cart_product_id) {
      errorMessage = _messages.UNKNOWN_CART_PRODUCT
    } else if (!product_id) {
      errorMessage = _messages.PRODUCT_MISSING
    } else if (!cart_id) {
      errorMessage = _messages.UNKNOWN_CART
    }

    if (errorMessage) {
      res.status(200).send(_error([], errorMessage))
    } else {
      try {

        const cartProduct = await models.CartProduct.findOne({
          where: {
            id: cart_product_id,
            product_id: product_id,
            cart_id: cart_id,
          }
        })

        if (cartProduct) {

          cartProduct.qty = parseInt(cartProduct.qty)

          if (subscribe_month) {
            cartProduct.subscribe_month = parseInt(subscribe_month)
          }

          if (size) {
            cartProduct.size = size
          }

          if (qty) {
            cartProduct.qty = parseInt(cartProduct.qty) + parseInt(qty)
          }

          await cartProduct.save()

          if (cartProduct.purchase_mode === _purchaseMode.SUBSCRIBE) {
            res.status(200).send(_success([cartProduct], _messages.SUBSCRIBED_PRODUCT_UPDATED))
          } else {
            res.status(200).send(_success([cartProduct], _messages.CART_UPDATED))
          }
        } else {
          res.status(200).send(_error([], _messages.NO_SUCH_PRODUCT_IN_CART))
        }

      } catch (error) {
        res.status(400).send(_error([], _getError(error)))
      }
    }
  },

  /**
  * @method put
  * @description To add shipping address detail of buyer
  * @param req, customer_id, shipping address detail
  * @returns {object}
  */
  addShipping: async (req, res) => {

    const { id } = req.params
    const { address, city_state, country, email, phone } = req.body

    let errorMessage;
    if (!address) {
      errorMessage = _messages.SHIPPING_ADDRESS_MISSING
    } else if (!city_state) {
      errorMessage = _messages.SHIPPING_CITY_STATE_MISSING
    } else if (!country) {
      errorMessage = _messages.SHIPPING_COUNTRY_MISSING
    } else if (!email) {
      errorMessage = _messages.SHIPPING_EMAIL_MISSING
    } else if (!phone) {
      errorMessage = _messages.SHIPPING_PHONE_MISSING
    }

    if (errorMessage) {
      res.status(200).send(_error([], errorMessage))
    } else {
      try {

        const cart = await models.Cart.findOne({
          where: { id: id }
        })

        if (cart) {
          cart.shipping_address = address
          cart.shipping_city_state = city_state
          cart.shipping_country = country
          cart.shipping_email = email
          cart.shipping_phone = phone
          await cart.save()
          res.status(200).send(_success([cart], _messages.SHIPPING_ADDRESS_UPDATED))
        }
      } catch (error) {
        res.status(400).send(_error([], _getError(error)))
      }
    }
  },

  /**
  * @method delete
  * @description To delete product from cart
  * @returns success message
  */
  removeProduct: async (req, res) => {

    const { id, cart_product_id } = req.params
    let errorMessage;

    if (!id) {
      errorMessage = _messages.UNKNOWN_CART
    } else if (!cart_product_id) {
      errorMessage = _messages.UNKNOWN_CART_PRODUCT
    }

    if (errorMessage) {
      res.status(200).send(_error([], errorMessage))
    } else {
      try {

        await models.CartProduct.destroy({
          where: {
            cart_id: id,
            id: cart_product_id,
          }
        })
        res.status(200).send(_success([], _messages.PRODUCT_REMOVED))

      } catch (error) {
        res.status(400).send(_error([], _getError(error)))
      }
    }
  },

  /**
 * @method put
 * @description Update Cart Details
 * @returns success message
 */
  updateCart: async (req, res) => {

    const { id } = req.params
    const { customer_id } = req.body
    let errorMessage;

    if (!id) {
      errorMessage = _messages.UNKNOWN_CART
    } else if (!customer_id) {
      res.status(200).send(_error([], _messages.CUSTOMER_MISSING))
    }

    if (errorMessage) {
      res.status(200).send(_error([], errorMessage))
    } else {
      try {

        const cart = await models.Cart.findOne({
          where: {
            id: id,
          }
        })

        if (cart) {
          cart.session_id = ""
          cart.customer_id = customer_id
          await cart.save();
        }
        res.status(200).send(_success([], _messages.CART_UPDATED))

      } catch (error) {
        res.status(400).send(_error([], _getError(error)))
      }
    }
  },
};