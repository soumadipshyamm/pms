const CommonController = require("../controllers").Common;
const sessionMiddleware = require("../middlewares")._isLoggedIn;
const fileUploaderSingle = require("../helpers").fileUploader.fileUploaderSingle;

module.exports = (app) => {
  app.post("/generic-status-change-delete", sessionMiddleware, CommonController.statusChange);
  app.post("/get-states-by-country", CommonController.getStates);
  app.post("/get-city-by-state", CommonController.getCites);
  app.post("/get-city-by-state", CommonController.getCites);
  app.post("/upload-temp-files", CommonController.uploadTempFiles);
  app.post("/temp-file-list", CommonController.fetchTempFiles);
  app.post("/temp-file-delete", CommonController.deleteTempFiles);
  app.post("/clear-temp-files", CommonController.clearTempFiles);
  app.get("/access-forbidden",async (req,res)=>{
      res.render("pages/access-forbidden", {
        layout: false,
      });
  });
};
