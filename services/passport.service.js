const { ExtractJwt, Strategy } = require('passport-jwt');

var models = require('../models/index');
var passportConfig = require('../config/passport.config');

const applyPassportStrategy = passport => {

  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = passportConfig.TOKEN_SECRET;

  passport.use(
    new Strategy(options, (payload, done) => {
      console.log('payload received', payload);
      const user = models.User.findOne({
        where: {
          email: payload.email
        }
      })

      console.log('user', user)

      if (user) {
        delete user.password; // Remove Password
        return done(null, user);
      } else {
        return done(null, false)
      }
    })
  );
};

module.exports = {
  applyPassportStrategy
}
