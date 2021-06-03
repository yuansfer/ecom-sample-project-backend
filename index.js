const express = require('express');
require('dotenv').config()

const app = express();

var cors = require('cors');
app.use(cors());
app.options('*', cors());

const routes = require('./routes');

const PORT = process.env.PORT || 3000;

// const db = require("./models");
// db.sequelize.sync(); // CREATE SCHEMA BASED ON MODEL AUTOMATICALLY

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});

require("./crons/cron.schedule").cronSchedule();