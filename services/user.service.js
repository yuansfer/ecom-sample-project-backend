var models = require('../models/index');

/* To check user existancy using username */
const isUserExist = async (username) => await models.User.findOne({ where: { username: username } })

/* Create new user */
const createUser = async (params) => await models.User.create(params)

module.exports = {
  isUserExist,
  createUser,
}
