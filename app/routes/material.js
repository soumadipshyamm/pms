const materialController = require("../controllers").Material;
const sessionMiddleware = require("../middlewares")._isLoggedIn;

module.exports = (app) => {
    app.get("/material-list", sessionMiddleware, materialController.index);
    app.get("/material-add", sessionMiddleware, materialController.add);
    app.get("/material-edit/:id", sessionMiddleware, materialController.add);
    app.post("/material-create", sessionMiddleware, materialController.createAndUpdate);
    app.post("/material-ajax-datatable", sessionMiddleware, materialController.ajaxDataTable);
};
