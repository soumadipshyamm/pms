const projectResorcesTable = require("../database/schemas").DB.projectResources;

const createRecord = async (data) => {
  let newRecord = await projectResorcesTable.create(data);
  if (newRecord) {
    return newRecord;
  }
  return false;
};
const updateRecord = async (data, condition) => {
  let updatedRecord = await projectResorcesTable.update(data, {
    where: condition,
  });
  if (updatedRecord) {
    return updatedRecord;
  }
  return false;
};
const findById = async (id) => {
  let data = await projectResorcesTable.findByPk(id);
  if (data) {
    return data;
  }
  return false;
};
module.exports = {
  createRecord,
  updateRecord,
  findById,
};