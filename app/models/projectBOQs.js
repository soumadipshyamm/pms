const projectBOQTable = require("../database/schemas").DB.projectBOQs;
const createRecord = async (data) => {
  let newUser = await projectBOQTable.create(data);
  if (newUser) {
    return newUser;
  }
  return false;
};
const permaDelete = async (condition) => {
  const data = await projectBOQTable.destroy({
    where: condition,
    truncate: false,
  });
  if (data) {
    return true;
  }
  return false;
};
const findById = async (id) => {
  let User = await projectBOQTable.findByPk(id);
  if (User) {
    return User;
  }
  return false;
};
const checkExists = async (condition) => {
  let record = await projectBOQTable.findOne({
    where: condition,
  });
  if (record) {
    return true;
  }
  return false;
};
module.exports = {
  createRecord,
  permaDelete,
  findById,
  checkExists,
};
