
const passportConfig = require('../config/passport.config');
const { Strategy, ExtractJwt } = require('passport-jwt');
const models = require('../models/index');

const applyPassportStrategy = passport => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = passportConfig.TOKEN_SECRET;
  passport.use(
    new Strategy(options, (payload, done) => {
      models.User.findOne({ where: { username: payload.username } }, (err, user) => {
        if (err) return done(err, false);
        if (user) {
          delete user.password // Remove Password
          return done(null, user);
        }
        return done(null, false);
      });
    })
  );
};

module.exports = { applyPassportStrategy };
