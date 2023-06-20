const projectContructTable = require("../database/schemas").DB.projectContruct;
const createRecord = async (data) => {
  let newContruct = await projectContructTable.create(data);
  if (newContruct) {
    return newContruct;
  }
  return false;
};
const findById = async (id) => {
  let User = await projectContructTable.findByPk(id);
  if (User) {
    return User;
  }
  return false;
};
module.exports = {
  createRecord,
  findById,
};
