const projectTaskTable = require("../database/schemas").DB.projectTasks;
const sequelize = require("../database").sequelize;
const checkExists = async (condition) => {
  let record = await projectTaskTable.findOne({
    where: condition,
  });
  if (record) {
    return true;
  }
  return false;
};
const countDataAndFetch = async (condition) => {
  let record = await projectTaskTable.findAndCountAll({
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
  let record = await projectTaskTable.findAll(query);
  if (record) {
    return record;
  }
  return false;
};
const createRecord = async (data) => {
  let newUser = await projectTaskTable.create(data);
  if (newUser) {
    return newUser;
  }
  return false;
};
const updateRecord = async (data, condition) => {
  let updateUser = await projectTaskTable.update(data, { where: condition });
  if (updateUser) {
    return updateUser;
  }
  return false;
};
const findById = async (id) => {
  let User = await projectTaskTable.findByPk(id);
  if (User) {
    return User;
  }
  return false;
};
const executeRawQuery = async (query)=>{
    let data = await sequelize.query(query);
    if(data){
        return data;
    }
    return false;
};
const permaDelete = async (condition) => {
  const data = await projectTaskTable.destroy({
    where: condition,
    truncate: false,
  });
  if (data) {
    return true;
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
  executeRawQuery,
  permaDelete,
};
