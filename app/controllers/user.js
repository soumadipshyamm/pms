const roleModel = require("../models").Role;
const profileModel = require("../models").Profile;
const adminMenusModel = require("../models").AdminMenus;
const profilePermissionModel = require("../models").ProfilePermission;
const userPermissionModel = require("../models").UserPermission;
const validator = require("../helpers").validator;
const userModel = require("../models").User;
const bcrypt = require("bcryptjs");
const { Op, Sequelize } = require("sequelize");
const menmuAccess = require("../middlewares").menuAccess;

const {
  dateFormatDDMMYYYY,
  fullDatetimeFormat,
  fullDatetimeFormatDDMMYYYYHHIIAA,
  encryptText,
  decryptText,
} = require("../helpers").utilities;
const index = async (req, res) => {
  if (
    !(await menmuAccess(
      "user-management",
      req.session.profileId,
      req.session.userId,
      "view"
    ))
  ) {
    return res.status(403).redirect("/access-forbidden");
  }
  return res.render("pages/user/list", {
    title: "User List",
  });
};
const add = async (req, res) => {
  let title = "User Add";
  let oldData = null;
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    oldData = await userModel.findById(decryptText(encryptedId));
    title = "User Edit";
  }
  let roleList = await roleModel.fetchAllWithCondition({
    status: "1",
  });
  let profileList = await profileModel.fetchAllWithCondition({
    status: "1",
    type: "1",
  });
  const conditionForMenu = {
    status: {
      [Op.not]: "3",
    },
  };
  const menus = await adminMenusModel.fetchAllWithCondition(conditionForMenu);
  const conditionForPermission = {
    profile_id: 2,
  };
  const profilePermissionAllData =
    await profilePermissionModel.fetchAllWithCondition(conditionForPermission);
  let tempArr2 = [];
  for (let [permissionIndex, permission] of Object.entries(
    profilePermissionAllData
  )) {
    var permissArray = {};
    permissArray[permission.permission_menu_id] = permission.action;
    tempArr2.push(permissArray);
  }
  const ansObj = tempArr2.reduce((prv, cur) => {
    Object.entries(cur).forEach(([key, v]) =>
      key in prv ? prv[key].push(v) : (prv[key] = [v])
    );
    return prv;
  }, {});
  return res.render("pages/user/add", {
    title,
    roleList,
    profileList,
    oldData,
    menus,
    profilePermissionAllData,
    permissArray: ansObj,
  });
};
const createAndUpdate = async (req, res) => {
  const validationRule = {
    first_name: "required|string",
    last_name: "required|string",
    email: "required|string|email",
    phone: "required|string",
    department: "required",
    // dob: "required",
    // gender: "required",
    profile_id: "required",
    role_id: "required",
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
        status: {
          [Op.not]: "3",
        },
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
        status: {
          [Op.not]: "3",
        },
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
        department: req.body.department,
        // dob: req.body.dob,
        // gender: req.body.gender,
        profile_id: req.body.profile_id,
        role_id: req.body.role_id,
        password: bcrypt.hashSync("secret", 8),
        created_at: fullDatetimeFormat(new Date()),
        created_by: req.session.userId,
      });
      if (userSave) {
        const profilePermissionAllData =
          await profilePermissionModel.fetchAllWithCondition({
            profile_id: req.body.profile_id,
          });
        const dataToStore = [];
        if (profilePermissionAllData.length) {
          profilePermissionAllData.forEach((item, index) => {
            dataToStore.push({
              user_id: userSave.id,
              permission_menu_id: item.permission_menu_id,
              action: item.action,
              created_by: req.session.userId,
              created_at: fullDatetimeFormat(new Date()),
            });
          });
        }
        const batchCreate = await userPermissionModel.batchCreate(dataToStore);
        return res.send({
          status: true,
          message: "User Created successfully!",
          data: [],
          redirect: "user-list",
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
        id: {
          [Op.not]: req.body.updateId,
        },
        status: {
          [Op.not]: "3",
        },
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
        id: {
          [Op.not]: req.body.updateId,
        },
        status: {
          [Op.not]: "3",
        },
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
          department: req.body.department,
          // dob: req.body.dob,
          // gender: req.body.gender,
          profile_id: req.body.profile_id,
          role_id: req.body.role_id,
          updated_at: fullDatetimeFormat(new Date()),
          updated_by: req.session.userId,
        },
        {
          id: req.body.updateId,
        }
      );
      if (userSave) {
        let userPermissions = await userPermissionModel.getUserPermissions({
          user_id: req.body.updateId,
        });
        let dataToStore = [];
        const profilePermissionAllData =
          await profilePermissionModel.fetchAllWithCondition({
            profile_id: req.body.profile_id,
          });
        if (profilePermissionAllData.length) {
          profilePermissionAllData.forEach((item, index) => {
            dataToStore.push({
              user_id: req.body.updateId,
              permission_menu_id: item.permission_menu_id,
              action: item.action,
              created_by: req.session.userId,
              created_at: fullDatetimeFormat(new Date()),
            });
          });
        }
        if (!userPermissions) {
          await userPermissionModel.batchCreate(dataToStore);
        } else {
          await userPermissionModel.batchDelete({
            user_id: req.body.updateId,
          });
          await userPermissionModel.batchCreate(dataToStore);
        }
        return res.send({
          status: true,
          message: "User Updated successfully!",
          data: [],
          redirect: "user-list",
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
  let profileList = await profileModel.fetchAllWithCondition({
    status: "1",
    type: "1",
  });
  let profileIdArr = [];
  for (let [key, val] of Object.entries(profileList)) {
    profileIdArr.push(val.id);
  }
  let condition = {
    status: {
      [Op.not]: "3",
    },
    profile_id: {
      [Op.in]: profileIdArr,
    },
  };
  let totalRecords = await userModel.countDataAndFetch(condition);
  if (req?.body?.searchName != "") {
    condition.where = Sequelize.where(
      Sequelize.fn(
        "concat",
        Sequelize.col("first_name"),
        " ",
        Sequelize.col("last_name")
      ),
      {
        [Op.like]: "%" + req.body.searchName + "%",
      }
    );
  }
  if (req?.body?.searchEmail != "") {
    condition.email = {
      [Op.like]: "%" + req?.body?.searchEmail + "%",
    };
  }
  if (req?.body?.searchPhone != "") {
    condition.phone = {
      [Op.like]: "%" + req?.body?.searchPhone + "%",
    };
  }
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
        "user-management",
        req.session.profileId,
        req.session.userId,
        "edit"
      )
    ) {
      action += `<a href="/user-edit/${encryptedID}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></a>
      <a href="/user-permission/${encryptedID}" title="Edit"><i class="fa-solid fa-lock"></i></a>`;
    }
    if (
      await menmuAccess(
        "user-management",
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
      first_name: val.first_name + " " + val.last_name,
      email: val.email,
      phone: val.phone,
      profile: (await val.getProfile()).name,
      role: (await val.getRole()).name,
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
const permissions = async (req, res) => {
  let title = "User Permission";
  let encryptedId = {
    encryptedData: req.params.id.split("-")[0],
    iv: req.params.id.split("-")[1],
  };
  const records = await adminMenusModel.fetchAllWithCondition({
    status: {
      [Op.not]: "3",
    },
  });
  let userPermissions = await userPermissionModel.getUserPermissions({
    user_id: decryptText(encryptedId),
  });
  let tempArr2 = [];
  for (let [permissionIndex, permission] of Object.entries(userPermissions)) {
    var permissArray = {};
    permissArray[permission.permission_menu_id] = permission.action;
    tempArr2.push(permissArray);
  }
  const ansObj = tempArr2.reduce((prv, cur) => {
    Object.entries(cur).forEach(([key, v]) =>
      key in prv ? prv[key].push(v) : (prv[key] = [v])
    );
    return prv;
  }, {});
  let userData = await userModel.findById(decryptText(encryptedId));
  return res.render("pages/user/permissions", {
    title,
    userPermissions,
    menus: records,
    userId: req.params.id,
    permissArray: ansObj,
    userData,
  });
};
const permissionsSave = async (req, res) => {
  const permission = req?.body?.permission;
  let encryptedId = {
    encryptedData: req.body.user_id.split("-")[0],
    iv: req.body.user_id.split("-")[1],
  };
  let tempArr = [];
  const deleteCondition = {
    user_id: decryptText(encryptedId),
  };
  await userPermissionModel.batchDelete(deleteCondition);
  if (permission) {
    for (let [menu, actions] of Object.entries(permission)) {
      for (let [key, action] of Object.entries(actions)) {
        tempArr.push({
          user_id: decryptText(encryptedId),
          permission_menu_id: menu,
          action: action,
          created_by: req.session.userId,
          created_at: fullDatetimeFormat(new Date()),
        });
      }
    }
    await userPermissionModel.batchCreate(tempArr);
    return res.send({
      status: true,
      message: "User Permission Updated successfully!",
      data: [],
      redirect: `user-permission/${req.body.user_id}`,
    });
  } else {
    return res.send({
      status: false,
      message: "Something went wrong!",
      data: [],
      redirect: `user-permission/${req.body.user_id}`,
    });
  }
};
module.exports = {
  index,
  add,
  createAndUpdate,
  ajaxDataTable,
  permissions,
  permissionsSave,
};
