module.exports = (app)=>{
    console.log("Main router OK");
    app.get('/health-check',(req,res)=>{
        const healthcheck = {
          uptime: process.uptime(),
          processtime: process.hrtime(),
          message: "OK",
          timestamp: Date.now(),
        };
        try {
          res.send(healthcheck);
        } catch (error) {
          healthcheck.message = error;
          res.status(503).send();
        }
    });
    require("./auth")(app);
    require("./dashboard")(app);
    require("./user")(app);
    require("./profile")(app);
    require("./common")(app);
    require("./role")(app);
    require("./client")(app);
    require("./vendor")(app)
    require("./project")(app);
    require("./adminSettings")(app);
    require("./material")(app);
    require("./projectExtra")(app);
    

}