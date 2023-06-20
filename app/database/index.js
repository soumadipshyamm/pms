const Sequelize = require('sequelize');
const dbConfig  = require('../config').MYSQL
const sequelize = new Sequelize(dbConfig.dbName, dbConfig.user, dbConfig.pwd, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: dbConfig.debug
});
sequelize
  .authenticate()
  .then(() => {
    console.log("DB is on.");
  })
  .catch((err) => {
    console.error("Unable to connect to the DB:", err);
  });
sequelize.sync({
  alter: true,
  force: false,
});
module.exports = {
  Sequelize,
  sequelize,
};
