const dashboardController = require("../controllers").Dashboard;
const sessionMiddleware   = require('../middlewares')._isLoggedIn;
module.exports = (app) => {
  app.get("/dashboard", sessionMiddleware, dashboardController.index);
};