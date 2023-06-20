const AdminSettingsController = require("../controllers").AdminSettings;
const sessionMiddleware = require("../middlewares")._isLoggedIn;
module.exports = (app) => {
  app.get("/my-profile", sessionMiddleware, AdminSettingsController.userProfile);
  app.post("/update-profile-pic", sessionMiddleware, AdminSettingsController.updateProfileImage);
  app.post("/profile-update", sessionMiddleware, AdminSettingsController.profileUpdate);
};
