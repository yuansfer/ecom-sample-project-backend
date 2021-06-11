const jwt = require("jsonwebtoken");
var models = require('../models/index');

const passportConfig = require('../config/passport.config');
const { _error, _messages } = require('../constants');

const authenticate = async (req, res, next) => {

  let token = req.header('Authorization');
  if (!token) return res.status(401).send(_error([], _messages.ACCESS_DENIED))

  try {

    if (token.startsWith(`${passportConfig.TOKEN_TYPE} `)) {
      token = token.slice(7, token.length).trimLeft();
    }

    const options = {
      expiresIn: passportConfig.TOKEN_LIFE,
      // issuer: process.env.ROOT_URL
    };

    const verified = jwt.verify(token, passportConfig.TOKEN_SECRET, options);

    if (['customer', 'merchant'].includes(verified.user_type) && verified.username) {
      const user = await models.User.findOne({
        where: {
          username: verified.username
        }
      })

      if (!user) return res.status(200).send(_error([], _messages.UNAUTHORIZED_ACCESS))
      delete user.password;
      req.user = user;
      next();
    } else {
      return res.status(200).send(_error([], _messages.INVALID_TOKEN))
    }
  }
  catch (err) {
    return res.status(200).send(_error([], _messages.INVALID_TOKEN))
  }
}

module.exports = {
  authenticate,
}