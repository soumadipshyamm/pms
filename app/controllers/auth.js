const bcrypt    = require("bcryptjs");
const validator = require('../helpers').validator;
const userModel = require('../models').User;
const tempFileModel = require("../models").tempFiles;
const fs = require("fs");
const login = async (req,res)=>{
    if(req.session.userId){
      return res.redirect('dashboard');
    }
    return res.render("pages/login", {
      layout: "layouts/without-login"
    });
};
const userCheck = async (req,res)=>{
    const validationRule = {
      email: "required|string|email",
      password: "required|string",
    };
    await validator(req.body, validationRule, {}, async (err, status) => {
        if(!status) {
            return res.send({
              status: false,
              message: req.i18n_texts.controller.generic.invalidData,
              data: err,
              redirect: "",
            });
        } 
        let user  = await userModel.findByEmail(req.body.email);
        if(user){
            if(!bcrypt.compareSync(req.body.password,user.password)){
               return res.send({
                 status: false,
                 message: req.i18n_texts.controller.auth.userCheck.passwordDoesNotMatch,
                 data: [],
                 redirect: "",
               });
            }
            req.session.userId        = user.id;
            req.session.email         = user.email;
            req.session.phone         = user.phone;
            req.session.name          = user.first_name+" "+user.last_name;
            req.session.profileImage  = user.profile_image;
            req.session.address       = user.address;
            req.session.profileId     = user.profile_id;
            return res.send({
              status: true,
              message: req.i18n_texts.controller.auth.userCheck.loginSuccess,
              data: [],
              redirect: "dashboard",
            });
        }else{
          return res.send({
            status: false,
            message: req.i18n_texts.controller.auth.userCheck.emailDoesNotMatch,
            data: [],
            redirect: "",
          });
        }
    }).catch( err => {
       return res.send({
         status: false,
         message: req.i18n_texts.controller.generic.err,
         data: err,
         redirect: "",
       });
    });
}
const resetPassword = (req,res)=>{
    if (req.session.userId) {
      return res.redirect("dashboard");
    }
    return res.render("pages/reset-password", {
      layout: "layouts/without-login",
      title: "Reset Password"
    });
};
const sendResetPasswordMail = async (req, res) => {
  if (req.session.userId) {
    return res.redirect("dashboard");
  }
  const validationRule = {
      email: "required|string|email",
    };
  await validator(req.body, validationRule, {}, async (err, status) => {
      if(!status) {
          return res.send({
                  status: false,
                  message: 'Invalid Data!',
                  data: err,
                  redirect:''
              });
      } 
      let user  = await userModel.findByEmail(req.body.email);
      if(user){
          return res.send({
            status: true,
            message: "Log In successfull!",
            data: [],
            redirect: "dashboard",
          });
      }else{
        return res.send({
          status: false,
          message: "Email Does not match!",
          data: [],
          redirect: "",
        });
      }
  }).catch( err => {
      return res.send({
        status: false,
        message: "Something Went wrong!",
        data: err,
        redirect: "",
      });
  });
};
const logout = async (req,res)=>{
 
  try {
     const data = await tempFileModel.fetchAllWithCondition({
       cookie_id: req.cookies["connect.sid"].split("s:")[1],
     });

     if (data) {
       for (let [key, val] of Object.entries(data)) {
         fs.unlink(
           `./public/uploads/project_documents/${val.file}`,
           function (err) {
             if (err) return console.log(err);
             console.log("file deleted successfully");
           }
         );
         await tempFileModel.permaDelete({
           id: val.id,
         });
       }
        
     }
    req.session.destroy((err) => {
      return res.redirect("/"); // will always fire after session is destroyed
    });
  } catch (err) {
    
     return res.json({
       status: false,
       message: "Oops somthing went wrong!",
       redirect: "",
       data: [],
     });
  }
  
}
module.exports = {
  login,
  resetPassword,
  userCheck,
  logout,
};