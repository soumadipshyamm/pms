const bcrypt = require("bcryptjs");
const validator = require("../helpers").validator;
const userModel = require("../models").User;
const fs = require("fs");
const fileUploaderSingle =
  require("../helpers").fileUploader.fileUploaderSingle;
const {
  dateFormatDDMMYYYY,
  fullDatetimeFormat,
  fullDatetimeFormatDDMMYYYYHHIIAA,
  encryptText,
  decryptText,
} = require("../helpers").utilities;
const userProfile = async (req, res) => {
  const profileData = await userModel.findById(req.session.userId);
  return res.render("pages/admin-settings/profile", {
    title: "My Profile",
    profileData,
  });
};
const updateProfileImage = async (req, res) => {
  if (req.files.document) {
    let image = await fileUploaderSingle(
      "./public/uploads/profile_images/",
      req.files.document
    );
    const existingData = await userModel.findById(req.session.userId);
    if (existingData) {
      fs.unlink(
        `./public/uploads/profile_images/${existingData.profile_image}`,
        function (err) {
          if (err) return console.log(err);
          console.log("file deleted successfully");
        }
      );
    }
    const recordUpdated = userModel.updateRecord(
      {
        profile_image: image.newfileName,
        updated_by: req.session.userId,
      },
      {
        id: req.session.userId,
      }
    );
    if (recordUpdated) {
      req.session.profileImage = image.newfileName;
      return res.json({
        status: true,
        message: "Profile Picture Uploaded successfully!",
        redirect: "",
        data: [],
      });
    }
    return res.json({
      status: false,
      message: "Oops somthing went wrong!",
      redirect: "",
      data: [],
    });
  }
  return res.json({
    status: false,
    message: "No file is present in the request",
    redirect: "",
    data: [],
  });
};
const profileUpdate = async (req, res) => {
  const validationRule = {
    first_name: "required|string",
    last_name: "required|string",
    email: "required|string|email",
    phone: "required|string",
    address: "required|string",
  };
  await validator(req.body, validationRule, {}, async (err, status) => {
    if (!status) {
      return res.send({
        status: false,
        message: "Invalid Data!",
        data: err,
        redirect: "",
      });
    }
    let userSave = await userModel.updateRecord(
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        updated_at: fullDatetimeFormat(new Date()),
        updated_by: req.session.userId,
      },
      { id: req.session.userId }
    );
    if (userSave) {
      req.session.name = req.body.first_name + " " + req.body.last_name;
      req.session.email = req.body.email;
      req.session.phone = req.body.phone;
      req.session.address = req.body.address;
      return res.send({
        status: true,
        message: "Profile Updated successfully!",
        data: [],
        redirect: "my-profile",
      });
    }
  }).catch((err) => {
    return res.send({
      status: false,
      message: req.i18n_texts.controller.generic.err,
      data: err,
      redirect: "",
    });
  });
};
module.exports = {
  userProfile,
  updateProfileImage,
  profileUpdate,
};
