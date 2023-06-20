const vendorInfoTable = require("../database/schemas").DB.Vendor;
const createRecord = async (data) => {
  let newUser = await vendorInfoTable.create(data);
  if (newUser) {
    return newUser;
  }
  return false;
};
const updateRecord = async (data, condition) => {
  let updateUser = await vendorInfoTable.update(data, { where: condition });
  if (updateUser) {
    return updateUser;
  }
  return false;
};
const checkExists = async (condition) => {
  let record = await vendorInfoTable.findOne({
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
