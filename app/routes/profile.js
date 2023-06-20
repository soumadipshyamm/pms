const ProfileController = require("../controllers").Profile;
const sessionMiddleware = require("../middlewares")._isLoggedIn;

module.exports = (app) => {
    app.get("/profile-list", sessionMiddleware, ProfileController.index);
    app.get("/profile-add", sessionMiddleware, ProfileController.add);
    app.get("/profile-edit/:id", sessionMiddleware, ProfileController.add);
    app.post("/profile-create", sessionMiddleware, ProfileController.createAndUpdate);
    app.post("/profile-ajax-datatable", sessionMiddleware, ProfileController.ajaxDataTable);
    app.get("/profile-permission/:id", sessionMiddleware, ProfileController.profilePermission);
    app.post("/profile-permission-save", sessionMiddleware, ProfileController.profilePermissionSave);
};
