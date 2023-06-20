const express         = require('express');
const bodyParser      = require("body-parser");
const morgan          = require("morgan");
const helmet          = require("helmet");
const cors            = require("cors");
const path            = require("path");
const expressLayouts  = require("express-ejs-layouts");
const cookieParser    = require("cookie-parser");
const app             = express();
const session         = require("express-session");
const i18n            = require("i18n-express");
//config
const httpConfig      = require("./app/config").HTTP;
const expressFileUpload = require("express-fileupload");

//db sync
require("./app/database");
const DB = require("./app/database/schemas").DB;
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressFileUpload({ parseNested :true}));
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy:false,
  })
);
app.use(morgan("dev"));
app.set("PORT", httpConfig.port);
//csrf configuration
const csrfProtection  = require("./app/middlewares").CSRF
const _excludeCSRFprotection = ["/api"];
app.use((req, res, next) => {
  if (_excludeCSRFprotection.includes(req.url)) {
    next();
  } else {
    csrfProtection(req, res, next);
  }
});
//session config
const { secret, maxAge, cookieSecure } = require("./app/config").SESSION;
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: secret,
    resave: false,
    store: DB.sequelizeSessionStore,
    saveUninitialized: true,
    cookie: {
      secure: cookieSecure,
      maxAge:Number(maxAge),
    },
  })
);
//view config
app.set("views", path.join(__dirname, "app/views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/index");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
//local variable store
app.use(function (req, res, next) {
  res.locals.baseUrl = require("./app/config").APPURL;
  res.locals._csrfToken = req.csrfToken();
  res.locals.currentUrl = req.url.split("/")[1];
  res.locals.currentSubUrl = req.url.split("/")[2];
  res.locals._sessionUser = req.session;
  next();
});
app.use(
  i18n({
    translationsPath: path.join(__dirname, "lang"), // <--- use here. Specify translations files path.
    siteLangs: ["en", "ar"],
    defaultLang :"en",
    textsVarName: "translation",
  })
);
//routing
const Router = require("./app/routes");
Router(app);
//listen
app.listen(app.get("PORT"), () => {
  console.log("Server listening on port ", app.get("PORT"));
});