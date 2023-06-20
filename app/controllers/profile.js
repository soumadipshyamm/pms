const profileModel = require("../models").Profile;
const adminMenusModel = require("../models").AdminMenus;
const profilePermissionModel = require("../models").ProfilePermission;
const validator = require("../helpers").validator;
const { Op } = require("sequelize");

const {
    dateFormatDDMMYYYY,
    fullDatetimeFormat,
    fullDatetimeFormatDDMMYYYYHHIIAA,
    encryptText,
    decryptText
} = require("../helpers").utilities;
const index = (req, res) => {
    return res.render("pages/profile/list", {
        title: "Profile Management",
    });
};
const add = async (req, res) => {
    let title = "Profile Add";
    let oldData = null;
    if (req.params.id) {
        let encryptedId = {
            encryptedData: req.params.id.split("-")[0],
            iv: req.params.id.split("-")[1],
        };
        oldData = await profileModel.findById(decryptText(encryptedId));
        title = "Profile Edit";
    }
    return res.render("pages/profile/add", {
        title,
        oldData,
    });
};
const createAndUpdate = async (req, res) => {
    const validationRule = {
        name: "required|string"
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
            let profileExists = await profileModel.checkExists({
                name: { [Op.like]: "%" + req.body.name + "%" },
                status: { [Op.not]: "3" },
            });
            if (profileExists) {
                return res.send({
                    status: false,
                    message: "Profile Already exists!",
                    data: [],
                    redirect: "",
                });
            }
            let profileSave = await profileModel.createRecord({
                name: req.body.name,
                type: '1',
                accessability: '1',
                created_at: fullDatetimeFormat(new Date()),
                created_by: req.session.userId,
            });
            if (profileSave) {
                return res.send({
                    status: true,
                    message: "Profile Created successfully!",
                    data: [],
                    redirect: "profile-list",
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
            let profileExists = await profileModel.checkExists({
                name: { [Op.like]: "%" + req.body.name + "%" },
                id: { [Op.not]: req.body.updateId },
                status: { [Op.not]: "3" },
            });
            if (profileExists) {
                return res.send({
                    status: false,
                    message: "Profile Already exists!",
                    data: [],
                    redirect: "",
                });
            }
            let userSave = await profileModel.updateRecord(
                {
                    name: req.body.name,
                    updated_at: fullDatetimeFormat(new Date()),
                    updated_by: req.session.userId,
                },
                { id: req.body.updateId }
            );
            if (userSave) {
                return res.send({
                    status: true,
                    message: "Profile Updated successfully!",
                    data: [],
                    redirect: "profile-list",
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
        type: '1'
    };
    let totalRecords = await profileModel.countDataAndFetch(condition);
    let totalRecorsWithFilter = await profileModel.countDataAndFetch(condition);
    let records = await profileModel.dataFetch(condition, rowperpage, start, columnName, coloumnSortOrder);
    let tempArr = [];
    for (let [key, val] of Object.entries(records)) {
        var id = encryptText(String(val.id));
        var encryptedID = id.encryptedData + "-" + id.iv;
        if (val.status === "1") {
            var status = `<div class="form-switch switch_cbox">
                          <input class="form-check-input change-status" type="checkbox" role="switch" id="${encryptedID}" data-table="profiles" data-status="0" data-key="id" data-id="${encryptedID}" checked>
                          <label class="form-check-label" for=""></label>
                        </div>`;
        } else {
            var status = `<div class="form-switch switch_cbox">
                          <input class="form-check-input change-status" type="checkbox" role="switch" id="${encryptedID}" data-table="profiles" data-status="1" data-key="id" data-id="${encryptedID}" >
                          <label class="form-check-label" for=""></label>
                        </div>`;
        }
        if (val.accessability === '1') {
            var action = `<div class="action_icon">
                          <a href="/profile-edit/${encryptedID}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></a>
                          <a href="javascript:void(0)" class="change-status" title="Delete" id="${encryptedID}" data-table="profiles" data-status="3" data-key="id" data-id="${encryptedID}">
                          <i class="fa-solid fa-trash text-danger"></i></a>
                          <a href="/profile-permission/${encryptedID}" title="Edit"><i class="fa-solid fa-lock"></i></a>
                      </div>`;
        } else {
            if (val.id == '1') {
                var action = ``;
            } else {
                var action = `<div class="action_icon">
                                <a href="/profile-permission/${encryptedID}" title="Edit"><i class="fa-solid fa-lock"></i></a>
                            </div>`;
            }
        }
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
        data: tempArr
    });
}

const profilePermission = async (req, res) => {
    const conditionForMenu = {
        status: { [Op.not]: "3" }
    };
    let encryptedId = {
        encryptedData: req.params.id.split("-")[0],
        iv: req.params.id.split("-")[1],
    };
    const conditionForPermission = {
        profile_id: decryptText(encryptedId)
    };
    const records = await adminMenusModel.fetchAllWithCondition(conditionForMenu);
    const profilePermissionAllData = await profilePermissionModel.fetchAllWithCondition(conditionForPermission);
    let tempArr2=[];
    for (let [permissionIndex, permission] of Object.entries(profilePermissionAllData)) {
        var permissArray ={}
        permissArray[permission.permission_menu_id]=permission.action;
        tempArr2.push(permissArray);
    }
    const ansObj = tempArr2.reduce((prv, cur) => {
      Object.entries(cur).forEach(([key, v]) =>
        key in prv ? prv[key].push(v) : (prv[key] = [v])
      );
      return prv;
    }, {});
    return res.render("pages/profile/permission", {
      title: "Permission For "+(await profileModel.findById(decryptText(encryptedId))).name ,
      menus: records,
      profileId: req.params.id,
      profilePermissionAllData: profilePermissionAllData,
      permissArray: ansObj,
    });
};

const profilePermissionSave = async (req, res) => {
  const permission = req?.body?.permission;
  let encryptedId = {
    encryptedData: req.body.profile_id.split("-")[0],
    iv: req.body.profile_id.split("-")[1],
  };
  let tempArr = [];
  const deleteCondition = {
    profile_id: decryptText(encryptedId),
  };
  await profilePermissionModel.batchDelete(deleteCondition);
  if (permission) {
    for (let [menu, actions] of Object.entries(permission)) {
      for (let [key, action] of Object.entries(actions)) {
        tempArr.push({
          profile_id: decryptText(encryptedId),
          permission_menu_id: menu,
          action: action,
          created_by: req.session.userId,
          created_at: fullDatetimeFormat(new Date()),
        });
      }
    }
    await profilePermissionModel.batchCreate(tempArr);
    return res.send({
      status: true,
      message: "Profile Permission Updated successfully!",
      data: [],
      redirect: `profile-permission/${req.body.profile_id}`,
    });
  } else {
    return res.send({
      status: true,
      message: "Profile Permission Updated successfully!",
      data: [],
      redirect: `profile-permission/${req.body.profile_id}`,
    });
  }
};

module.exports = {
    index,
    add,
    createAndUpdate,
    ajaxDataTable,
    profilePermission,
    profilePermissionSave,
};
