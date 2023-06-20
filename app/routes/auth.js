const AuthController = require('../controllers').Auth
module.exports = (app) => {
  app.get("/", AuthController.login);
  app.post("/user-check", AuthController.userCheck);
  app.get("/reset-password", AuthController.resetPassword);
  app.get("/log-out", AuthController.logout);
};