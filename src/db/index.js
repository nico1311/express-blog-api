const Sequelize = require('sequelize');

const db = process.env.NODE_ENV === 'test' ? process.env.MYSQL_TEST_DB : process.env.MYSQL_DB;

/**
 * @type {import('sequelize').Sequelize}
 */
const sequelize = new Sequelize(db, process.env.MYSQL_USER, process.env.MYSQL_PASS, {
  host: process.env.MYSQL_HOST || 'localhost',
  dialect: 'mysql'
});

module.exports = {
  sequelize
};
