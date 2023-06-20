const userModel = require("../models").User;
const countryModel = require("../models").Country;
const vendorInfoModel = require("../models").Vendor;
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const validator = require("../helpers").validator;
const fileUploaderSingle =
  require("../helpers").fileUploader.fileUploaderSingle;
  const menmuAccess = require("../middlewares").menuAccess;
const {
  dateFormatDDMMYYYY,
  fullDatetimeFormat,
  fullDatetimeFormatDDMMYYYYHHIIAA,
  encryptText,
  decryptText,
} = require("../helpers").utilities;
const index = (req, res) => {
  return res.render("pages/vendor/list", {
    title: "Contractor & Consultant List",
  });
};
const add = async (req, res) => {
  let title = "Contractor & Consultant Add";
  let oldData = null;
  let countries = await countryModel.findById(191);
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    oldData = await userModel.findById(decryptText(encryptedId));
    oldData.vendorInfo = await oldData.getVendor_info();
    title = "Contractor & Consultant Edit";
  }
  return res.render("pages/vendor/add", {
    title,
    oldData,
    countries,
  });
};
const createAndUpdate = async (req, res) => {
  const validationRule = {
    first_name: "required|string",
    last_name: "required|string",
    email: "required|string|email",
    phone: "required|string",
    sub_type: "required|string",
    // dob: "required",
    // gender: "required",
    organization: "required|string",
    organization_email: "required|string|email",
    organization_phone: "required|string",
    organization_address: "required|string",
    commercial_register_no: "required|string",
    iban_no: "required|string",
    // country_id: "required",
    // state_id: "required",
    // city_id: "required",
    profile_id: "required",
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
    var message = "";
    if (req.body.profile_id === "4") {
      message = "Contructor";
    }
    if (req.body.profile_id === "5") {
      message = "Consultant";
    }
    if (req.body.profile_id === "9") {
      message = "Supplier";
    }
    if (req.body.updateId == "") {
      let emailExists = await userModel.checkExists({
        email: req.body.email,
        status: { [Op.not]: "3" },
      });
      if (emailExists) {
        return res.send({
          status: false,
          message: "Email Already exists!",
          data: [],
          redirect: "",
        });
      }
      let phoneExists = await userModel.checkExists({
        phone: req.body.phone,
        status: { [Op.not]: "3" },
      });
      if (phoneExists) {
        return res.send({
          status: false,
          message: "Phone Already exists!",
          data: [],
          redirect: "",
        });
      }
      let userSave = await userModel.createRecord({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        profile_id: req.body.profile_id,
        password: bcrypt.hashSync("secret", 8),
        created_at: fullDatetimeFormat(new Date()),
        created_by: req.session.userId,
      });
      if (userSave) {
        var infoTobeInserted = {
          user_id: userSave.id,
          organization: req.body.organization,
          organization_phone: req.body.organization_phone,
          organization_email: req.body.organization_email,
          organization_address: req.body.organization_address,
          commercial_register_no: req.body.commercial_register_no,
          iban_no: req.body.iban_no,
          sub_type: req.body.sub_type,
          created_at: fullDatetimeFormat(new Date()),
          created_by: req.session.userId,
        };
        if (req?.files?.gosi_certificate) {
          let image = await fileUploaderSingle(
            "./public/uploads/vendor/",
            req.files.gosi_certificate
          );
          infoTobeInserted.gosi_certificate = image.newfileName;
        }
        if (req?.files?.vat_registration_certificate) {
          let image = await fileUploaderSingle(
            "./public/uploads/vendor/",
            req.files.vat_registration_certificate
          );
          infoTobeInserted.vat_registration_certificate = image.newfileName;
        }
        if (req?.files?.saudization_certificate) {
          let image = await fileUploaderSingle(
            "./public/uploads/vendor/",
            req.files.saudization_certificate
          );
          infoTobeInserted.saudization_certificate = image.newfileName;
        }
        await vendorInfoModel.createRecord(infoTobeInserted);
        return res.send({
          status: true,
          message: `${message} Created Successfully!`,
          data: [],
          redirect: "vendor-list",
        });
      } else {
        return res.send({
          status: false,
          message: "Something went wrong!",
          data: [],
          redirect: "",
        });
      }
    } else {
      let emailExists = await userModel.checkExists({
        email: req.body.email,
        id: { [Op.not]: req.body.updateId },
        status: { [Op.not]: "3" },
      });
      if (emailExists) {
        return res.send({
          status: false,
          message: "Email Already exists!",
          data: [],
          redirect: "",
        });
      }
      let phoneExists = await userModel.checkExists({
        phone: req.body.phone,
        id: { [Op.not]: req.body.updateId },
        status: { [Op.not]: "3" },
      });
      if (phoneExists) {
        return res.send({
          status: false,
          message: "Phone Already exists!",
          data: [],
          redirect: "",
        });
      }
      let userSave = await userModel.updateRecord(
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          phone: req.body.phone,
          // dob: req.body.dob,
          // gender: req.body.gender,
          profile_id: req.body.profile_id,
          country_id: req.body.country_id,
          state_id: req.body.state_id,
          city_id: req.body.city_id,
          updated_at: fullDatetimeFormat(new Date()),
          updated_by: req.session.userId,
        },
        { id: req.body.updateId }
      );
      if (userSave) {
        if (
          !(await vendorInfoModel.checkExists({ user_id: req.body.updateId }))
        ) {
          var dataTobeInserted = {
            user_id: req.body.updateId,
            organization: req.body.organization,
            organization_phone: req.body.organization_phone,
            organization_email: req.body.organization_email,
            organization_address: req.body.organization_address,
            commercial_register_no: req.body.commercial_register_no,
            iban_no: req.body.iban_no,
            sub_type: req.body.sub_type,
            created_at: fullDatetimeFormat(new Date()),
            created_by: req.session.userId,
          };
          if (req?.files?.gosi_certificate) {
            let image = await fileUploaderSingle(
              "./public/uploads/vendor/",
              req.files.gosi_certificate
            );
            dataTobeInserted.gosi_certificate = image.newfileName;
          }
          if (req?.files?.vat_registration_certificate) {
            let image = await fileUploaderSingle(
              "./public/uploads/vendor/",
              req.files.vat_registration_certificate
            );
            dataTobeInserted.vat_registration_certificate = image.newfileName;
          }
          if (req?.files?.saudization_certificate) {
            let image = await fileUploaderSingle(
              "./public/uploads/vendor/",
              req.files.saudization_certificate
            );
            dataTobeInserted.saudization_certificate = image.newfileName;
          }
          await vendorInfoModel.createRecord(dataTobeInserted);
        } else {
          var dataTobeUpdated = {
            organization: req.body.organization,
            organization_phone: req.body.organization_phone,
            organization_email: req.body.organization_email,
            organization_address: req.body.organization_address,
            commercial_register_no: req.body.commercial_register_no,
            iban_no: req.body.iban_no,
            updated_at: fullDatetimeFormat(new Date()),
            updated_by: req.session.userId,
          };
          if (req?.files?.gosi_certificate) {
            let image = await fileUploaderSingle(
              "./public/uploads/vendor/",
              req.files.gosi_certificate
            );
            dataTobeUpdated.gosi_certificate = image.newfileName;
          }
          if (req?.files?.vat_registration_certificate) {
            let image = await fileUploaderSingle(
              "./public/uploads/vendor/",
              req.files.vat_registration_certificate
            );
            dataTobeUpdated.vat_registration_certificate = image.newfileName;
          }
          if (req?.files?.saudization_certificate) {
            let image = await fileUploaderSingle(
              "./public/uploads/vendor/",
              req.files.saudization_certificate
            );
            dataTobeUpdated.saudization_certificate = image.newfileName;
          }
          await vendorInfoModel.updateRecord(dataTobeUpdated, {
            user_id: req.body.updateId,
          });
        }
        return res.send({
          status: true,
          message: `${message} Updated Successfully!`,
          data: [],
          redirect: "vendor-list",
        });
      } else {
        return res.send({
          status: false,
          message: "Something went wrong!",
          data: [],
          redirect: "",
        });
      }
    }
  }).catch((err) => {
    return res.send({
      status: false,
      message: "Something Went wrong!",
      data: err,
      redirect: "",
    });
  });
};
const ajaxDataTable = async (req, res) => {
  let draw = req.body.draw;
  let start = req.body.start;
  let rowperpage = req.body.length;
  let columnNameArr = req.body.columns;
  let orderArr = req.body.order;
  let searchArr = req.body.search;
  let columnIndex = orderArr[0]["column"];
  let columnName = columnNameArr[columnIndex]["data"];
  let coloumnSortOrder = orderArr[0]["dir"];
  let searchValue = searchArr["value"];
  let condition = {
    status: { [Op.not]: "3" },
    profile_id: { [Op.in]: ["4", "5", "9"] },
  };
  let totalRecords = await userModel.countDataAndFetch(condition);
  let totalRecorsWithFilter = await userModel.countDataAndFetch(condition);
  let records = await userModel.dataFetch(
    condition,
    rowperpage,
    start,
    columnName,
    coloumnSortOrder
  );
  let tempArr = [];
  for (let [key, val] of Object.entries(records)) {
    var id = encryptText(String(val.id));
    var encryptedID = id.encryptedData + "-" + id.iv;
    if (val.status === "1") {
      var status = `<div class="form-switch switch_cbox">
                          <input class="form-check-input change-status" type="checkbox" role="switch" id="${encryptedID}" data-table="users" data-status="0" data-key="id" data-id="${encryptedID}" checked>
                          <label class="form-check-label" for=""></label>
                        </div>`;
    } else {
      var status = `<div class="form-switch switch_cbox">
                          <input class="form-check-input change-status" type="checkbox" role="switch" id="${encryptedID}" data-table="users" data-status="1" data-key="id" data-id="${encryptedID}" >
                          <label class="form-check-label" for=""></label>
                        </div>`;
    }

    var action = `<div class="action_icon">`;
    if (
      await menmuAccess(
        "vendor-management",
        req.session.profileId,
        req.session.userId,
        "edit"
      )
    ) {
      action += `<a href="/vendor-edit/${encryptedID}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></a>`;
    }
    if (
      await menmuAccess(
        "vendor-management",
        req.session.profileId,
        req.session.userId,
        "delete"
      )
    ) {
      action += `<a href="javascript:void(0)" class="change-status" title="Delete" id="${encryptedID}" data-table="users" data-status="3" data-key="id" data-id="${encryptedID}">
                          <i class="fa-solid fa-trash text-danger"></i></a>`;
    }
    action += `</div>`;
    tempArr.push({
      id: Number(key) + 1,
      type: (await val.getProfile()).name,
      sub_type: (await val.getVendor_info())?.sub_type ?? "N/A",
      first_name: val.first_name + " " + val.last_name,
      email: val.email,
      phone: val.phone,
      // gender: val.gender,
      // dob: dateFormatDDMMYYYY(val.dob),
      status: status,
      created_at: fullDatetimeFormatDDMMYYYYHHIIAA(val.createdAt),
      action: action,
    });
  }
  return res.json({
    draw: draw,
    recordsTotal: totalRecords.count,
    recordsFiltered: totalRecorsWithFilter.count,
    data: tempArr,
  });
};
module.exports = {
  index,
  add,
  createAndUpdate,
  ajaxDataTable,
};
