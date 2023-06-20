const UserController = require("../controllers").User;
const sessionMiddleware = require("../middlewares")._isLoggedIn;

module.exports = (app) => {
    app.get("/user-list", sessionMiddleware, UserController.index);
    app.get("/user-add", sessionMiddleware, UserController.add);
    app.get("/user-edit/:id", sessionMiddleware, UserController.add);
    app.post("/user-create", sessionMiddleware, UserController.createAndUpdate);
    app.post("/user-ajax-datatable", sessionMiddleware, UserController.ajaxDataTable);
    app.get("/user-permission/:id", sessionMiddleware, UserController.permissions);
    app.post("/user-permission-save", sessionMiddleware, UserController.permissionsSave);
    
};
