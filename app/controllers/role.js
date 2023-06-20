const roleModel = require("../models").Role;
const validator = require("../helpers").validator;
const { Op } = require("sequelize");
const {
    dateFormatDDMMYYYY,
    fullDatetimeFormat,
    fullDatetimeFormatDDMMYYYYHHIIAA,
    encryptText,
    decryptText
} = require("../helpers").utilities;
const index = async (req, res) => {
 /* Calling the `getRoleTree` method from the `roleModel` module and passing an object with a `status`
 property set to an object with a `not` property set to the value `"3"`. This is used as a filter to
 retrieve all roles that have a status other than `"3"`. The result is stored in the `roleList`
 variable. */
  let roleList = await roleModel.getRoleTree({
    status: { [Op.not]: "3" },
  });
  // console.log(roleList.output);
  // return res.send({ data: roleList.html });
  return res.render("pages/role/list", {
    title: "Profile Management",
    roleList: roleList,
  });
};
const createAndUpdate = async (req, res) => {
  const validationRule = {
    name: "required|string",
    hierarchy_id: "required|string",
  };
  let encryptedHierarchyId = {
      encryptedData: req.body.hierarchy_id.split("-")[0],
      iv: req.body.hierarchy_id.split("-")[1],
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
      let roleExists = await roleModel.checkExists({
        name: { [Op.like]: "%" + req.body.name + "%" },
        status: { [Op.not]: "3" },
      });
      if (roleExists) {
        return res.send({
          status: false,
          message: "Role Already exists!",
          data: [],
          redirect: "",
        });
      }
      let profileSave = await roleModel.createRecord({
        name: req.body.name,
        hierarchy_id:decryptText(encryptedHierarchyId),
        created_at: fullDatetimeFormat(new Date()),
        created_by: req.session.userId,
      });
      if (profileSave) {
        return res.send({
          status: true,
          message: "Role Created successfully!",
          data: [],
          redirect: "role-list",
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
      let encryptedUpdateId = {
        encryptedData: req.body.updateId.split("-")[0],
        iv: req.body.updateId.split("-")[1],
      };
      let roleExists = await roleModel.checkExists({
        name: { [Op.like]: "%" + req.body.name + "%" },
        id: { [Op.not]: decryptText(encryptedUpdateId) },
        status: { [Op.not]: "3" },
      });
      if (roleExists) {
        return res.send({
          status: false,
          message: "Role Already exists!",
          data: [],
          redirect: "",
        });
      }
      let userSave = await roleModel.updateRecord(
        {
          name: req.body.name,
          hierarchy_id: decryptText(encryptedHierarchyId),
          updated_at: fullDatetimeFormat(new Date()),
          updated_by: req.session.userId,
        },
        { id: decryptText(encryptedUpdateId) }
      );
      if (userSave) {
        return res.send({
          status: true,
          message: "Role Updated successfully!",
          data: [],
          redirect: "role-list",
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
module.exports = {
  index,
  createAndUpdate,
};
