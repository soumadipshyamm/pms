const materialModel = require("../models").materials;
const validator = require("../helpers").validator;
const { Op } = require("sequelize");
const menmuAccess = require("../middlewares").menuAccess;

const {
  dateFormatDDMMYYYY,
  fullDatetimeFormat,
  fullDatetimeFormatDDMMYYYYHHIIAA,
  encryptText,
  decryptText,
} = require("../helpers").utilities;
const index = (req, res) => {
  return res.render("pages/material/list", {
    title: "Material Management",
  });
};
const add = async (req, res) => {
  let title = "Material Add";
  let oldData = null;
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    oldData = await materialModel.findById(decryptText(encryptedId));
    title = "Material Edit";
  }
  return res.render("pages/material/add", {
    title,
    oldData,
  });
};
const createAndUpdate = async (req, res) => {
  console.log(req.body);
  const validationRule = {
    name: "required|string",
    code: "required|string",
    unit: "required|string",
    rate: "required|string",
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
      let profileExists = await materialModel.checkExists({
        name: { [Op.like]: "%" + req.body.name + "%" },
        status: { [Op.not]: "3" },
      });
      if (profileExists) {
        return res.send({
          status: false,
          message: "Material Already exists!",
          data: [],
          redirect: "",
        });
      }
      let profileSave = await materialModel.createRecord({
        name: req.body.name,
        code: req.body.code,
        unit: req.body.unit,
        rate: req.body.rate,
        created_at: fullDatetimeFormat(new Date()),
        created_by: req.session.userId,
      });
      if (profileSave) {
        return res.send({
          status: true,
          message: "Material Created successfully!",
          data: [],
          redirect: "material-list",
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
      let profileExists = await materialModel.checkExists({
        name: { [Op.like]: "%" + req.body.name + "%" },
        id: { [Op.not]: req.body.updateId },
        status: { [Op.not]: "3" },
      });
      if (profileExists) {
        return res.send({
          status: false,
          message: "Material Already exists!",
          data: [],
          redirect: "",
        });
      }
      let userSave = await materialModel.updateRecord(
        {
          name: req.body.name,
          code: req.body.code,
          unit: req.body.unit,
          rate: req.body.rate,
          updated_at: fullDatetimeFormat(new Date()),
          updated_by: req.session.userId,
        },
        { id: req.body.updateId }
      );
      if (userSave) {
        return res.send({
          status: true,
          message: "Material Updated successfully!",
          data: [],
          redirect: "material-list",
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
  };
  let totalRecords = await materialModel.countDataAndFetch(condition);
  let totalRecorsWithFilter = await materialModel.countDataAndFetch(condition);
  let records = await materialModel.dataFetch(
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
                          <input class="form-check-input change-status" type="checkbox" role="switch" id="${encryptedID}" data-table="materials" data-status="0" data-key="id" data-id="${encryptedID}" checked>
                          <label class="form-check-label" for=""></label>
                        </div>`;
    } else {
      var status = `<div class="form-switch switch_cbox">
                          <input class="form-check-input change-status" type="checkbox" role="switch" id="${encryptedID}" data-table="materials" data-status="1" data-key="id" data-id="${encryptedID}" >
                          <label class="form-check-label" for=""></label>
                        </div>`;
    }

    var action = `<div class="action_icon">`;
    if (
      await menmuAccess(
        "material-management",
        req.session.profileId,
        req.session.userId,
        "edit"
      )
    ) {
      action += ` <a href="/material-edit/${encryptedID}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></a>`;
    }
    if (
      await menmuAccess(
        "material-management",
        req.session.profileId,
        req.session.userId,
        "delete"
      )
    ) {
      action += `<a href="javascript:void(0)" class="change-status" title="Delete" id="${encryptedID}" data-table="materials" data-status="3" data-key="id" data-id="${encryptedID}">
                          <i class="fa-solid fa-trash text-danger"></i></a>`;
    }
    action = `</div>`;

    tempArr.push({
      id: Number(key) + 1,
      name: val.name,
      code: val.code,
      unit: val.unit,
      rate: val.rate,
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
