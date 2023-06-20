const userModel = require("../models").User;
const countryModel = require("../models").Country;
const clientInfoModel = require("../models").ClientInfo;
const clientTypeModel = require("../models").clientType;
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const validator = require("../helpers").validator;
const menuAccess = require("../middlewares").menuAccess;
const {
  dateFormatDDMMYYYY,
  fullDatetimeFormat,
  fullDatetimeFormatDDMMYYYYHHIIAA,
  encryptText,
  decryptText,
} = require("../helpers").utilities;
const index = async (req, res) => {
  if (
    !(await menuAccess(
      "client-management",
      req.session.profileId,
      req.session.userId,
      "view"
    ))
  ) {
    return res.status(403).redirect("/access-forbidden");
  }
  return res.render("pages/client/list", {
    title: req.i18n_texts.ClientManagement.title.list,
  });
};
const add = async (req, res) => {
  let title = req.i18n_texts.ClientManagement.title.add;
  let oldData = null;
  let countries = await countryModel.findById(191);
  let clientTypes = await clientTypeModel.fetchAllWithCondition({
    status: "1",
  });
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    oldData = await userModel.findById(decryptText(encryptedId));
    oldData.clientInfo = await oldData.getClient_info();
    title = req.i18n_texts.ClientManagement.title.edit;
    if (
      !(await menuAccess(
        "client-management",
        req.session.profileId,
        req.session.userId,
        "edit"
      ))
    ) {
      return res.status(403).redirect("/access-forbidden");
    }
  } else {
    if (
      !(await menuAccess(
        "client-management",
        req.session.profileId,
        req.session.userId,
        "add"
      ))
    ) {
      return res.status(403).redirect("/access-forbidden");
    }
  }
  return res.render("pages/client/add", {
    title,
    oldData,
    countries,
    clientTypes,
  });
};
const createAndUpdate = async (req, res) => {
  const validationRule = {
    first_name: "required|string",
    last_name: "required|string",
    email: "required|string|email",
    phone: "required|string",
    client_type_id: "required|string",
    // dob: "required",
    // gender: "required",
    organization: "required|string",
    country_id: "required",
    state_id: "required",
    city_id: "required",
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
        client_type_id: req.body.client_type_id,
        // dob: req.body.dob,
        // gender: req.body.gender,
        country_id: req.body.country_id,
        state_id: req.body.state_id,
        city_id: req.body.city_id,
        profile_id: "6",
        password: bcrypt.hashSync("secret", 8),
        created_at: fullDatetimeFormat(new Date()),
        created_by: req.session.userId,
      });
      if (userSave) {
        await clientInfoModel.createRecord({
          user_id: userSave.id,
          organization: req.body.organization,
          created_at: fullDatetimeFormat(new Date()),
          created_by: req.session.userId,
        });
        return res.send({
          status: true,
          message: "Client Created successfully!",
          data: [],
          redirect: "client-list",
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
          client_type_id: req.body.client_type_id,
          // dob: req.body.dob,
          // gender: req.body.gender,
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
          !(await clientInfoModel.checkExists({ user_id: req.body.updateId }))
        ) {
          await clientInfoModel.createRecord({
            user_id: req.body.updateId,
            organization: req.body.organization,
            created_at: fullDatetimeFormat(new Date()),
            created_by: req.session.userId,
          });
        } else {
          await clientInfoModel.updateRecord(
            {
              organization: req.body.organization,
              updated_at: fullDatetimeFormat(new Date()),
              updated_by: req.session.userId,
            },
            {
              user_id: req.body.updateId,
            }
          );
        }
        return res.send({
          status: true,
          message: "Client Updated successfully!",
          data: [],
          redirect: "client-list",
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
    profile_id: "6",
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
      await menuAccess(
        "client-management",
        req.session.profileId,
        req.session.userId,
        "edit"
      )
    ) {
      action += `<a href="/client-edit/${encryptedID}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></a>`;
    }
    if (
      await menuAccess(
        "client-management",
        req.session.profileId,
        req.session.userId,
        "delete"
      )
    ) {
      action += `<a href="javascript:void(0)" class="change-status" title="Delete" id="${encryptedID}" data-table="users" data-status="3" data-key="id" data-id="${encryptedID}">
                          <i class="fa-solid fa-trash text-danger"></i></a>`;
    }
    action += `<a href="/project-list?clientId=${encryptedID}" class="btn btn-info btn-xs" title="View Projects">View Projects</a>`;
    action += `</div>`;

    var clientType = await val?.getClient_type();
    tempArr.push({
      id: Number(key) + 1,
      type: clientType?.name ?? "N/A",
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
const clientTypeList = async (req, res) => {
  if (
    !(await menuAccess(
      "client-type-management",
      req.session.profileId,
      req.session.userId,
      "view"
    ))
  ) {
    return res.status(403).redirect("/access-forbidden");
  }
  return res.render("pages/client/type-list", {
    title: "Client Type List",
  });
};
const clientTypeAdd = async (req, res) => {
  let title = "Add  Client Type";
  let oldData = null;
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    oldData = await clientTypeModel.findById(decryptText(encryptedId));
    title = "Edit  Client Type";
    if (
      !(await menuAccess(
        "client-type-management",
        req.session.profileId,
        req.session.userId,
        "edit"
      ))
    ) {
      return res.status(403).redirect("/access-forbidden");
    }
  } else {
    if (
      !(await menuAccess(
        "client-type-management",
        req.session.profileId,
        req.session.userId,
        "add"
      ))
    ) {
      return res.status(403).redirect("/access-forbidden");
    }
  }
  return res.render("pages/client/type-add", {
    title,
    oldData,
  });
};
const clientTypeCreateAndUpdate = async (req, res) => {
  const validationRule = {
    name: "required|string",
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
    if (req.body.updateId == "") {
      let clientTypeExists = await clientTypeModel.checkExists({
        name: { [Op.like]: "%" + req.body.name + "%" },
        status: { [Op.not]: "3" },
      });
      if (clientTypeExists) {
        return res.send({
          status: false,
          message: "Client Type Already exists!",
          data: [],
          redirect: "",
        });
      }
      let clientTypeSave = await clientTypeModel.createRecord({
        name: req.body.name,
        created_at: fullDatetimeFormat(new Date()),
        created_by: req.session.userId,
      });
      if (clientTypeSave) {
        return res.send({
          status: true,
          message: "Client Type Created successfully!",
          data: [],
          redirect: "client-type-list",
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
      let clientTypeExists = await clientTypeModel.checkExists({
        name: { [Op.like]: "%" + req.body.name + "%" },
        id: { [Op.not]: req.body.updateId },
        status: { [Op.not]: "3" },
      });
      if (clientTypeExists) {
        return res.send({
          status: false,
          message: "Client Type Already exists!",
          data: [],
          redirect: "",
        });
      }
      let clientTypeSave = await clientTypeModel.updateRecord(
        {
          name: req.body.name,
          updated_at: fullDatetimeFormat(new Date()),
          updated_by: req.session.userId,
        },
        { id: req.body.updateId }
      );
      if (clientTypeSave) {
        return res.send({
          status: true,
          message: "Client Type Updated successfully!",
          data: [],
          redirect: "client-type-list",
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
const clientTypeAjaxDataTable = async (req, res) => {
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
  };
  let totalRecords = await clientTypeModel.countDataAndFetch(condition);
  let totalRecorsWithFilter = await clientTypeModel.countDataAndFetch(
    condition
  );
  let records = await clientTypeModel.dataFetch(
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
                          <input class="form-check-input change-status" type="checkbox" role="switch" id="${encryptedID}" data-table="clint_types" data-status="0" data-key="id" data-id="${encryptedID}" checked>
                          <label class="form-check-label" for=""></label>
                        </div>`;
    } else {
      var status = `<div class="form-switch switch_cbox">
                          <input class="form-check-input change-status" type="checkbox" role="switch" id="${encryptedID}" data-table="clint_types" data-status="1" data-key="id" data-id="${encryptedID}" >
                          <label class="form-check-label" for=""></label>
                        </div>`;
    }
    var action = `<div class="action_icon">`;
    if (
      await menuAccess(
        "client-management",
        req.session.profileId,
        req.session.userId,
        "edit"
      )
    ) {
      action += `<a href="/client-type-edit/${encryptedID}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></a>`;
    }
    if (
      await menuAccess(
        "client-management",
        req.session.profileId,
        req.session.userId,
        "delete"
      )
    ) {
      action += `<a href="javascript:void(0)" class="change-status" title="Delete" id="${encryptedID}" data-table="clint_types" data-status="3" data-key="id" data-id="${encryptedID}">
                          <i class="fa-solid fa-trash text-danger"></i></a>`;
    }
    action += ` </div>`;

    tempArr.push({
      id: Number(key) + 1,
      name: val.name,
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
const clientListByType = async (req, res) => {
  try {
    let data = await userModel.dataFetch(
      { client_type_id: req.body.id },
      false,
      false,
      "first_name",
      "ASC"
    );
    if (data) {
      return res.json({
        status: true,
        message: "Request processed Successfully!",
        redirect: "",
        data: data,
      });
    }
    return res.json({
      status: false,
      message: "No Data Found!",
      redirect: "",
      data: [],
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Oops somthing went wrong!",
      redirect: "",
      data: [],
    });
  }
};
module.exports = {
  index,
  add,
  createAndUpdate,
  ajaxDataTable,
  clientTypeList,
  clientTypeAdd,
  clientTypeCreateAndUpdate,
  clientTypeAjaxDataTable,
  clientListByType,
};
