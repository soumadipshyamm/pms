require("dotenv").config();
let HTTP = {
  port: process.env.APP_ENV == "production" ? process.env.SERVER_PORT : 8080,
};
let APPNAME = {
  port: process.env.APP_ENV == "production" ? process.env.APP_NAME : "OrBit Me",
};
let APPURL =
  process.env.APP_ENV == "production"
    ? process.env.APP_URL
    : "http://localhost:8080/";
let APIKEY =
  process.env.APP_ENV == "production"
    ? process.env.APP_KEY
    : "0547fdb5c1b853f20c99f9602dd5b226";
let source = ["post", "mob"];
let MYSQL = {
  host: process.env.APP_ENV == "production" ? process.env.DB_HOST : "localhost",
  user: process.env.APP_ENV == "production" ? process.env.DB_USER : "root",
  pwd: process.env.APP_ENV == "production" ? process.env.DB_PASSWORD : "",
  dialect:
    process.env.APP_ENV == "production" ? process.env.DB_DIALECT : "mysql",
  dbName: process.env.APP_ENV == "production" ? process.env.DB_NAME : "aawpms",
  debug: process.env.APP_ENV == "production" ? false : false,
};
let Mail = {
  auth: {
    user:
      process.env.APP_ENV == "production"
        ? process.env.SMTP_USER
        : "somnath.bhunia@shyamfuture.com",
    pass:
      process.env.APP_ENV == "production"
        ? process.env.SMTP_PASSWORD
        : "8tDh6vs4WOKprgqf",
  },
  host:
    process.env.APP_ENV == "production"
      ? process.env.SMTP_HOST
      : "smtp-relay.sendinblue.com",
  port: process.env.APP_ENV == "production" ? process.env.SMTP_PORT : 587,
  fromName:
    process.env.APP_ENV == "production" ? process.env.FROM_NAME : "Orbit Me",
  fromMail:
    process.env.APP_ENV == "production"
      ? process.env.FROM_EMAIL
      : "no-reply@shyamfuture.com",
};
let SESSION = {
  secret:
    process.env.APP_ENV == "production"
      ? process.env.SESSION_SECRET
      : "the-silly-session-secret",
  maxAge:
    process.env.APP_ENV == "production"
      ? process.env.SESSION_COOKIE_MAX_AGE
      : 86400000,
  cookieSecure: process.env.APP_ENV == "production" ? false : false,
};
let timezone = process.env.APP_ENV == "production" ? process.env.timezone: "Asia/Calcutta";
module.exports = {
  HTTP,
  MYSQL,
  Mail,
  APIKEY,
  source,
  APPURL,
  APPNAME,
  SESSION,
  timezone
};
