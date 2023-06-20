const projectTypeTable = require("../database/schemas").DB.ProjectType;
const { encryptText, decryptText } = require("../helpers").utilities;
const checkExists = async (condition) => {
  let record = await projectTypeTable.findOne({
    where: condition,
  });
  if (record) {
    return true;
  }
  return false;
};
const countDataAndFetch = async (condition) => {
  let record = await projectTypeTable.findAndCountAll({
    where: condition,
  });
  if (record) {
    return record;
  }
  return false;
};
const dataFetch = async (
  condition,
  limit = false,
  offset = false,
  orderBy = false,
  mode = false
) => {
  let query = {
    where: condition,
    order: [["id", "DESC"]],
  };
  if (limit && offset) {
    query.limit = Number(limit);
    query.offset = Number(offset);
  }
  if (orderBy && mode) {
    query.order = [[orderBy, mode]];
  }
  let record = await projectTypeTable.findAll(query);
  if (record.length) {
    return record;
  }
  return false;
};
const createRecord = async (data) => {
  let newUser = await projectTypeTable.create(data);
  if (newUser) {
    return newUser;
  }
  return false;
};
const updateRecord = async (data, condition) => {
  let updateUser = await projectTypeTable.update(data, {
    where: condition,
    logging: console.log,
  });
  if (updateUser) {
    return updateUser;
  }
  return false;
};
const findById = async (id) => {
  let User = await projectTypeTable.findByPk(id);
  if (User) {
    return User;
  }
  return false;
};

const prepareRecursiveProjectTypeList = (items = [], hierarchyId = 0) => {
  let html = ``;
  // let output = [];
  for (let [key, item] of Object.entries(items)) {
    var id = encryptText(String(item.id));
    var encryptedID = id.encryptedData + "-" + id.iv;
    var parentId = encryptText(String(item.parent));
    var encryptedHierarchyId = parentId.encryptedData + "-" + parentId.iv;
    console.log(item.parent);
    if (hierarchyId == item.parent) {
      html += `<li class="branch"> <p class="hierarchy_con">
                    ${item.name}
                     
                    <span class="form-switch">
                        <input class="form-check-input change-status"
                            type="checkbox" role="switch"
                            ${
                              item.status === "1" ? "checked" : ""
                            } id="${encryptedID}" data-table="project_types" data-status="${
        item.status === "1" ? "0" : "1"
      }" data-key="id" data-id="${encryptedID}">
                        <label class="form-check-label"z
                            for=""></label>
                    </span>
                    <span class="hierar_action">
                    ${
                      item.parent === 0
                        ? `<a  class="text-success addModal" data-hierarchy-id="${encryptedHierarchyId}" data-id="${encryptedID}"> <i
                    class="fa-solid fa-plus"></i></a>`
                        : ""
                    }                       
                                <a  class="text-primary editModal" data-name="${
                                  item.name
                                }" data-hierarchy-id="${encryptedHierarchyId}" data-id="${encryptedID}"><i
                                class="fa-solid fa-pen"></i></a>
                        <a href="" class="text-danger change-status" id="${encryptedID}" data-table="project_types" data-status="3" data-key="id" data-id="${encryptedID}"><i
                                class="fa-solid fa-trash-can"></i></a>
                    </span>
                </p>`;
      let children = prepareRecursiveProjectTypeList(items, item.id);

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
const getProjectTypeTree = async (condition) => {
  let data = await projectTypeTable.findAll({ where: condition, raw: true });

  return prepareRecursiveProjectTypeList(data);
};
module.exports = {
  checkExists,
  countDataAndFetch,
  dataFetch,
  createRecord,
  updateRecord,
  findById,
  getProjectTypeTree,
};
