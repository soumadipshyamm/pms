const VendorController = require("../controllers").Vendor;
const sessionMiddleware = require("../middlewares")._isLoggedIn;
module.exports = (app) => {
  app.get("/vendor-list", sessionMiddleware, VendorController.index);
  app.get("/vendor-add", sessionMiddleware, VendorController.add);
  app.get("/vendor-edit/:id", sessionMiddleware, VendorController.add);
  app.post("/vendor-create", sessionMiddleware, VendorController.createAndUpdate);
  app.post("/vendor-ajax-datatable",sessionMiddleware,VendorController.ajaxDataTable);
};