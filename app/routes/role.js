const RoleController = require("../controllers").Role;
const sessionMiddleware = require("../middlewares")._isLoggedIn;

module.exports = (app) => {
    app.get("/role-list", sessionMiddleware, RoleController.index);
    app.post("/role-create", sessionMiddleware, RoleController.createAndUpdate);
};