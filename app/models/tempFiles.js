const tempFileTable = require("../database/schemas").DB.tempFiles;
const createRecord = async (data) => {
  let newProfile = await tempFileTable.create(data);
  if (newProfile) {
    return newProfile;
  }
  return false;
};
const permaDelete = async (condition) => {
  const data = await tempFileTable.destroy({
    where: condition,
    truncate: false,
  });
  if (data) {
    return true;
  }
  return false;
};
const fetchAllWithCondition = async (condition) => {
  const data = await tempFileTable.findAll({ raw: true, where: condition });
  if (data) {
    return data;
  }
  return false;
};
const findById = async (id) => {
  let User = await tempFileTable.findByPk(id);
  if (User) {
    return User;
  }
  return false;
};
module.exports = {
  permaDelete,
  fetchAllWithCondition,
  createRecord,
  findById,
};