const ClientController = require("../controllers").Client;
const sessionMiddleware = require("../middlewares")._isLoggedIn;

module.exports = (app) => {
  app.get("/client-list", sessionMiddleware, ClientController.index);
  app.get("/client-add", sessionMiddleware, ClientController.add);
  app.get("/client-edit/:id", sessionMiddleware, ClientController.add);
  app.post("/client-create", sessionMiddleware, ClientController.createAndUpdate);
  app.post("/client-ajax-datatable",sessionMiddleware,ClientController.ajaxDataTable);
  app.get("/client-type-list",sessionMiddleware,ClientController.clientTypeList);
  app.post("/client-type-ajax-datatable",sessionMiddleware,ClientController.clientTypeAjaxDataTable);
  app.get("/client-type-add",sessionMiddleware,ClientController.clientTypeAdd);
  app.get("/client-type-edit/:id", sessionMiddleware, ClientController.clientTypeAdd);
  app.post("/client-type-create", sessionMiddleware, ClientController.clientTypeCreateAndUpdate);
  app.post("/client-list-by-type", sessionMiddleware, ClientController.clientListByType);

};
