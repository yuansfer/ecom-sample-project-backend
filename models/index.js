'use strict';
const fs = require('fs');
const path = require('path');
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const cls = require('cls-hooked');
const namespace = cls.createNamespace('yuansfer');
Sequelize.useCLS(namespace);

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: false
});


let db = {};
var files = fs.readdirSync(__dirname);
for (const file of files) {
  if (file.search("model.js") !== -1) {
    try {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize);
      db[model.name] = model
      console.log('Model : ', model.name);
    } catch (error) {
      console.log(error)
    }
  }
}

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database Connected');
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err);
  });


db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;