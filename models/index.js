const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: console.log
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.users = require('./user.js')(sequelize, DataTypes);

module.exports = db;