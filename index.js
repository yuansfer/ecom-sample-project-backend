const express = require('express');
require('dotenv').config()
var cors = require('cors');

const { errorResponder } = require('./middlewares/error.middleware');

const app = express();

/*
const passport = require('passport');
const { applyPassportStrategy } = require('./store/passport');
applyPassportStrategy(passport)

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

app.use(cors());
app.options('*', cors());

const routes = require('./routes');
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);
app.use(errorResponder)

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});

require("./crons/cron.schedule").cronSchedule();