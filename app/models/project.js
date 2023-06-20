const projectTable = require("../database/schemas").DB.Project;

const checkExists = async (condition) => {
  let record = await projectTable.findOne({
    where: condition,
  });
  if (record) {
    return true;
  }
  return false;
};
const countDataAndFetch = async (condition) => {
  let record = await projectTable.findAndCountAll({
    where: condition,
  });
  if (record) {
    return record;
  }
  return false;
};
const dataFetch = async (condition, limit = false, offset = false, orderBy = false, mode = false) => {
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
  let record = await projectTable.findAll(query);
  if (record) {
    return record;
  }
  return false;
};
const createRecord = async (data) => {
  let newUser = await projectTable.create(data);
  if (newUser) {
    return newUser;
  }
  return false;
};
const updateRecord = async (data, condition) => {
  let updateUser = await projectTable.update(data, { where: condition });
  if (updateUser) {
    return updateUser;
  }
  return false;
};
const findById = async (id) => {
  let User = await projectTable.findByPk(id);
  if (User) {
    return User;
  }
  return false;
};
module.exports = {
  checkExists,
  countDataAndFetch,
  dataFetch,
  createRecord,
  updateRecord,
  findById,
};