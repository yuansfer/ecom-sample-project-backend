const jwt = require("jsonwebtoken");
var models = require('../models/index');

const passportConfig = require('../config/passport.config');
const { _error, _messages } = require('../constants');

const authenticate = async (req, res, next) => {

  let token = req.header('Authorization');
  if (!token) return res.status(401).send(_error([], _messages.ACCESS_DENIED))

  try {
    if (token.startsWith(`${passportConfig.TOKEN_FORMAT} `)) {
      // Remove "Bearer" from string
      token = token.slice(7, token.length).trimLeft();
    }

    const options = {
      expiresIn: passportConfig.TOKEN_LIFE,
      // issuer: process.env.ROOT_URL
    };

    const verified = jwt.verify(token, passportConfig.SECRET_KEY, options);
    if (verified.user_type === 'customer' && verified.id) { // Check authorization, 1 = Admin

      const user = await models.User.findByPk(verified.id)
      if (!user) return res.status(401).send(_error([], _messages.UNAUTHORIZED_ACCESS))

      //let req_url = req.baseUrl + req.route.path;      
      // if (req_url.includes("users/:id") && parseInt(req.params.id) !== verified.id) {
      //   return res.status(401).send(_error([], _messages.UNAUTHORIZED_ACCESS))
      // }
      delete user.password;
      req.user = user;
      next();
    } else {
      return res.status(400).send(_error([], _messages.INVALID_TOKEN))
    }
  }
  catch (err) {
    return res.status(400).send(_error([], _messages.INVALID_TOKEN))
  }
}

module.exports = {
  authenticate,
}