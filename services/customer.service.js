var models = require('../models/index');

/* Create new customer */
const createCustomer = async (params) => await models.Customer.create(params)

module.exports = {
  createCustomer,
}
