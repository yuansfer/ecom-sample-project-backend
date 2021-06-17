const bcrypt = require('bcrypt');
var models = require('../models/index');
const { _success, _error, _notifications, _messages } = require('../constants');
const { _generateToken, _getError, _extractToken, _generateHasPassword } = require('../utils/helper');
const { isUserExist, createUser } = require('../services/user.service');
const { createCustomer } = require('../services/customer.service');
const passportConfig = require('../config/passport.config');
const { httpApiError } = require('../utils/errorBaseClass')

module.exports = {

  /**
  * @method post
  * @description To initiate a login request to get access system
  * @returns {object}
  */
  login: async (req, res, next) => {

    const { username, password } = req.body;

    let errorMessage;

    if (!username) {
      errorMessage = _messages.USERNAME_MISSING
    }

    if (!password) {
      errorMessage = _messages.PASSWORD_MISSING
    }

    if (errorMessage) {
      next(new httpApiError(400, errorMessage))
    } else {
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
              role_id: user.role_id || '',
              user_type: user.user_type,
              username: user.username,
              ...(user.user_type === 'customer') && {
                customer_id: user.customer_id
              }
            };

            const token = await _generateToken(payload)
            const refreshToken = await _generateToken(payload, 'refresh')

            /* Create/Update LoggedIn user's tokens */
            const userToken = await models.UserToken.findOne({
              where: {
                username: user.username,
              }
            })

            if (userToken) {
              userToken.token = token
              userToken.refresh_token = refreshToken
              await userToken.save()
            } else {
              await models.UserToken.create({
                username: user.username,
                token: token,
                refresh_token: refreshToken,
              })
            }

            const response = {
              userId: user.id,
              userType: user.user_type,
              ...(user.user_type === 'customer') && {
                customerId: user.customer_id
              },
              token: token,
              refreshToken: refreshToken,
              tokenType: passportConfig.TOKEN_TYPE,
              expiresIn: passportConfig.TOKEN_LIFE,
            }
            res.status(200).send(_success([response], _messages.LOGIN_SUCCESS))
          } else {
            throw new httpApiError(400, _messages.INVALID_CREDENTIAL)
          }
        } else {
          throw new httpApiError(400, _messages.INVALID_CREDENTIAL)
        }
      } catch (error) {
        next(new httpApiError(400, _getError(error)))
      }
    }
  },

  /**
  * @method post
  * @description To create a request that generated new token based on the refresh token
  * @returns {object}
  */
  token: async (req, res, next) => {

    const { refreshToken } = req.body;
    let errorMessage;

    if (!refreshToken) {
      errorMessage = _messages.REFRESH_TOKEN_MISSING
    }

    if (errorMessage) {
      next(new httpApiError(400, errorMessage))
    } else {

      const data = await _extractToken(refreshToken, 'refresh')
      const userToken = await models.UserToken.findOne({
        where: {
          username: data.username,
          refresh_token: refreshToken,
        }
      })

      if (userToken) {
        let payload = {
          role_id: data.role_id || '',
          user_type: data.user_type,
          username: data.username,
          ...(user.user_type === 'customer') && {
            customer_id: user.customer_id
          }
        };

        const newToken = await _generateToken(payload)
        const newRefreshToken = await _generateToken(payload, 'refresh')

        userToken.token = newToken
        userToken.refresh_token = newRefreshToken
        await userToken.save()

        const response = {
          token: newToken,
          refreshToken: newRefreshToken,
          tokenType: passportConfig.TOKEN_TYPE,
          expiresIn: passportConfig.TOKEN_LIFE,
        }
        res.status(200).send(_success([response], _messages.TOKEN_REFRESHED_SUCCESS))
      } else {
        throw new httpApiError(400, _messages.INVALID_TOKEN)
      }
    }
  },

  /**
  * @method post
  * @description To initiate a new user registration request to create an account
  * @returns {object}
  */
  register: async (req, res, next) => {

    const { role_id, user_type, firstname, lastname, username, email, password } = req.body;
    let errorMessage;

    // if (!role_id) {
    //   errorMessage = _messages.ROLE_MISSING
    // }

    if (!user_type) {
      errorMessage = _messages.USER_TYPE_MISSING
    } else if (!firstname) {
      errorMessage = _messages.FIRST_NAME_MISSING
    } else if (!lastname) {
      errorMessage = _messages.LAST_NAME_MISSING
    } else if (!email) {
      errorMessage = _messages.EMAIL_MISSING
    } else if (!password) {
      errorMessage = _messages.PASSWORD_MISSING
    } else if (!username) {
      errorMessage = _messages.USERNAME_MISSING
    } else {
      var isExist = await isUserExist(username)
      if (isExist) {
        errorMessage = _messages.USER_EXIST
      }
    }

    if (errorMessage) {
      next(new httpApiError(400, errorMessage))
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

        if (user) {
          await createCustomer({
            ...(firstname) && { firstname: firstname },
            ...(lastname) && { lastname: lastname },
          })
        }
        res.status(200).send(_success([user], _messages.REGISTER_SUCCESS))
      } catch (error) {
        next(new httpApiError(400, _getError(error)))
      }
    }
  },

  /**
  * @method post
  * @description To logout from system
  * @returns null
  */
  logout: async (req, res, next) => {
    const { username } = req.user;
    await models.UserToken.destroy({
      where: {
        username: username
      }
    })
    res.status(200).send(_success([], _messages.LOGOUT_SUCCESS))
  }
};