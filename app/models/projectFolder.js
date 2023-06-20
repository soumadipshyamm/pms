const projectFolders = require("../database/schemas").DB.projectFolders;
const batchCreate = async (dataToStore, updateOnDuplicate) => {
  const data = await projectFolders.bulkCreate(dataToStore);
  if (data) {
    return true;
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
  let record = await projectFolders.findAll(query);
  if (record.length) {
    return record;
  }
  return false;
};
const createRecord = async (data) => {
  let newItem = await projectFolders.create(data);
  if (newItem) {
    return newItem;
  }
  return false;
};
module.exports = {
  batchCreate,
  dataFetch,
  createRecord,
};
