const clientInfoTable = require("../database/schemas").DB.ClientInfo;
const createRecord = async (data) => {
  let newUser = await clientInfoTable.create(data);
  if (newUser) {
    return newUser;
  }
  return false;
};
const updateRecord = async (data, condition) => {
  let updateUser = await clientInfoTable.update(data, { where: condition });
  if (updateUser) {
    return updateUser;
  }
  return false;
};
const checkExists = async (condition) => {
  let record = await clientInfoTable.findOne({
    where: condition,
  });
  if (record) {
    return true;
  }
  return false;
};
module.exports = {
  createRecord,
  updateRecord,
  checkExists,
};
