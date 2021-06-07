const express = require('express');
require('dotenv').config()
var cors = require('cors');
const app = express();

/*
var passportConfig = require('./config/passport.config');
const passport = require('passport');
const passportJWT = require('passport-jwt');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = passportConfig.SECRET_KEY;

var models = require('./models/index');

// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
	console.log('payload received', jwt_payload);

	models.User.findOne({
		where: {
			email: payload.email
		}
	}).then(user => {
		if (user) {
			console.log('user', user)
			delete user.password; // Remove Password
			done(null, user);
		} else {
			done(null, false)
		}
	})

});
// use the strategy
passport.use(strategy);

passport.serializeUser((user, callback) => {
	callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
	models.User.findByPk(id, (err, user) => {
		if (err) {
			return callback(err);
		}
		callback(null, user);
	});
});
*/

/*
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = passportConfig.SECRET_KEY;

lets create our strategy for web token
let strategy = new Strategy(options, (payload, done) => {
	console.log('payload received', payload);
	const user = models.User.findOne({
		where: {
			email: payload.email
		}
	})

	console.log('user', user)

	if (user) {
		delete user.password; // Remove Password
		done(null, user);
	} else {
		done(null, false)
	}
})
use the strategy
passport.use(strategy);
const { applyPassportStrategy } = require('./services/passport.service');
// Apply strategy to passport
applyPassportStrategy(passport);

app.use(passport.initialize());
*/



app.use(cors());
app.options('*', cors());

const routes = require('./routes');
const PORT = process.env.PORT || 3000;

/*
const db = require("./models");
db.sequelize.sync(); // CREATE SCHEMA BASED ON MODEL AUTOMATICALLY
*/

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});

require("./crons/cron.schedule").cronSchedule();