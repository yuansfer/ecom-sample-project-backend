const bcrypt = require('bcrypt');
var models = require('../models/index');
const { _success, _error, _notifications, _messages } = require('../constants');
const { _generateToken, _generateHasPassword } = require('../utils/helper');
const { isUserExist, createUser } = require('../services/user.service');

module.exports = {

  /**
  * @method post
  * @description To initiate a login request to get access system
  * @returns {object}
  */
  login: async (req, res) => {

    const { username, password } = req.body;

    if (!username) {
      res.status(200).send(_error([], _messages.USERNAME_MISSING))
    }

    if (!password) {
      res.status(200).send(_error([], _messages.PASSWORD_MISSING))
    }

    try {
      const user = await models.User.findOne({
        where: {
          username: username
        },
        include: [
          {
            model: models.Role,
            as: 'role',
            attributes: ['status'],
          }
        ]
      })

      if (user) {
        const match = bcrypt.compareSync(password, user.password);
        if (match) {
          let payload = {
            id: user.id,
            role_id: user.role_id,
            user_type: user.user_type,
          };
          const token = await _generateToken(payload)
          res.send(_success([{ token: token }], _messages.LOGIN_SUCCESS))
        } else {
          res.status(200).send(_error([], _messages.INVALID_CREDENTIAL))
        }
      } else {
        res.status(200).send(_error([], _messages.INVALID_CREDENTIAL))
      }
    } catch (error) {
      res.status(400).json(_error(error))
    }
  },

  /**
  * @method post
  * @description To initiate a new user registration request to create an account
  * @returns {object}
  */
  register: async (req, res) => {

    const { role_id, user_type, firstname, lastname, username, email, password } = req.body;
    let errorMessage;

    // if (!role_id) {
    //   errorMessage = _messages.ROLE_MISSING
    // }

    if (!user_type) {
      errorMessage = _messages.USER_TYPE_MISSING
    }

    if (!firstname) {
      errorMessage = _messages.FIRST_NAME_MISSING
    }

    if (!lastname) {
      errorMessage = _messages.LAST_NAME_MISSING
    }

    if (!username) {
      errorMessage = _messages.USERNAME_MISSING
    } else {
      var isExist = await isUserExist(username)
      if (isExist) {
        errorMessage = _messages.USER_EXIST
      }
    }

    if (!email) {
      errorMessage = _messages.EMAIL_MISSING
    }

    if (!password) {
      errorMessage = _messages.PASSWORD_MISSING
    }

    if (errorMessage) {
      res.status(200).send(_error([], errorMessage))
    } else {

      try {
        const hashPassword = await _generateHasPassword(password);
        const user = await createUser({
          ...(role_id) && { role_id: role_id },
          ...(user_type) && { user_type: user_type },
          ...(firstname) && { firstname: firstname },
          ...(lastname) && { lastname: lastname },
          ...(username) && { username: username },
          ...(email) && { email: email },
          ...(password) && { password: hashPassword },
        })
        res.status(200).send(_success([user], _messages.REGISTER_SUCCESS))
      } catch (error) {
        res.status(400).json(_error(error))
      }
    }
  },

  /**
  * @method post
  * @description To logout from system
  * @returns {object}
  */
  logout: async (req, res) => {

  }
};