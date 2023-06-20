const roleTable = require("../database/schemas").DB.Roles;
const {
  encryptText,
  decryptText,
} = require("../helpers").utilities;
const fetchAllWithCondition = async (condition) => {
  let data = await roleTable.findAll({ where: condition });
  if (data) {
    return data;
  }
  return false;
};
const createRecord = async (data) => {
  let newProfile = await roleTable.create(data);
  if (newProfile) {
    return newProfile;
  }
  return false;
};
const updateRecord = async (data, condition) => {
  let updateProfile = await roleTable.update(data, { where: condition });
  if (updateProfile) {
    return updateProfile;
  }
  return false;
};
const findById = async (id) => {
  let User = await roleTable.findByPk(id);
  if (User) {
    return User;
  }
  return false;
};
const checkExists = async (condition) => {
  let record = await roleTable.findOne({
    where: condition,
  });
  if (record) {
    return true;
  }
  return false;
};
const prepareRecursiveRoleList =  (items = [], hierarchyId = 0) => {
  let html = ``;
  // let output = [];
  for (let [key, item] of Object.entries(items)) {
    var id = encryptText(String(item.id));
    var encryptedID = id.encryptedData + "-" + id.iv;
    var parentId = encryptText(String(item.hierarchy_id));
    var encryptedHierarchyId = parentId.encryptedData + "-" + parentId.iv;
    if (hierarchyId == item.hierarchy_id) {
      html += `<li class="branch"> <p class="hierarchy_con">
                    ${item.name}
                     ${
                       item.id > 1
                         ? `
                    <span class="form-switch">
                        <input class="form-check-input change-status"
                            type="checkbox" role="switch"
                            ${
                              item.status === "1" ? "checked" : ""
                            } id="${encryptedID}" data-table="roles" data-status="${
                             item.status === "1" ? "0" : "1"
                           }" data-key="id" data-id="${encryptedID}">
                        <label class="form-check-label"
                            for=""></label>
                    </span>`
                         : ``
                     }
                    <span class="hierar_action">
                        <a  class="text-success addModal" data-hierarchy-id="${encryptedHierarchyId}" data-id="${encryptedID}"> <i
                                class="fa-solid fa-plus"></i></a>
                         ${
                           item.id > 1
                             ? `
                        <a  class="text-primary editModal" data-name="${item.name}" data-hierarchy-id="${encryptedHierarchyId}" data-id="${encryptedID}"><i
                                class="fa-solid fa-pen"></i></a>
                        <a href="" class="text-danger change-status" id="${encryptedID}" data-table="roles" data-status="3" data-key="id" data-id="${encryptedID}"><i
                                class="fa-solid fa-trash-can"></i></a>`
                             : ``
                         }
                    </span>
                </p>`;
      let  children =  prepareRecursiveRoleList(items, item.id);
      
      if (typeof children != undefined) {
         html += `<ul>`;
          html += children;
         html += `</ul>`;
      }
       html += `</li>`;
     
    }
  }
  return html;
};
const getRoleTree = async (condition) => {
  let data = await roleTable.findAll({ where: condition, raw:true });
  return  prepareRecursiveRoleList(data);
};
module.exports = {
  fetchAllWithCondition,
  createRecord,
  updateRecord,
  findById,
  checkExists,
  getRoleTree,
};
