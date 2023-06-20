const projectCostInfoTable = require("../database/schemas").DB.projectCostInfo;
const batchCreate = async (dataToStore, updateOnDuplicate) => {
  const data = await projectCostInfoTable.bulkCreate(dataToStore);
  if (data) {
    return true;
  }
  return false;
};
const batchDelete = async (condition) => {
  const data = await projectCostInfoTable.destroy({
    where: condition,
    truncate: false,
  });
  if (data) {
    return true;
  }
  return false;
};
const fetchAllWithCondition = async (condition) => {
  const data = await projectCostInfoTable.findAll({ raw: true, where: condition });
  if (data) {
    return data;
  }
  return false;
};
module.exports = {
  batchCreate,
  batchDelete,
  fetchAllWithCondition,
};
