const adminMenuTable = require("../database/schemas").DB.AdminMenus;
const fetchAllWithCondition = async (condition) => {
  const data = await adminMenuTable.findAll({ where: condition });
  if (data) {
    return data;
  }
  return false;
}
module.exports = {
  fetchAllWithCondition,
};