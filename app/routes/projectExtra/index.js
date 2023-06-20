const ProjectExtraController = require("../../controllers/projectExtra");
const sessionMiddleware = require("../../middlewares")._isLoggedIn;
module.exports = (app) => {
  app.get("/project-folders/:id", sessionMiddleware, ProjectExtraController.index);
  app.post("/get-sub-folders", sessionMiddleware, ProjectExtraController.getSubFolderAndFiles);
  app.post("/create-file-or-folder/:id", sessionMiddleware, ProjectExtraController.createSubFolderAndFiles);

};
