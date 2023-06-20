const projectStakeHolderAndRiskTable = require("../database/schemas").DB.projectStakeHolderAndRisk;
const createRecord = async (data) => {
  let newData = await projectStakeHolderAndRiskTable.create(data);
  if (newData) {
    return newData;
  }
  return false;
};
module.exports = {
  createRecord,
};