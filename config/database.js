const { Sequelize } = require("sequelize");
require("dotenv").config();

const db = new Sequelize(process.env.db, process.env.user, process.env.pw, {
  host: process.env.host,
  dialect: process.env.dialect,
  logging: false,
  timezone: process.env.timezone,
});

module.exports = db;
