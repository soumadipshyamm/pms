const materialTable = require("../database/schemas").DB.materials;
const fetchAllWithCondition = async (condition) => {
  let data = await materialTable.findAll({ where: condition });
  if (data) {
    return data;
  }
  return false;
};

const createRecord = async (data) => {
  let newMaterial = await materialTable.create(data);
  if (newMaterial) {
    return newMaterial;
  }
  return false;
};
const updateRecord = async (data, condition) => {
  let updateMaterial = await materialTable.update(data, { where: condition });
  if (updateMaterial) {
    return updateMaterial;
  }
  return false;
};

const countDataAndFetch = async (condition) => {
  let record = await materialTable.findAndCountAll({
    where: condition,
  });
  if (record) {
    return record;
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
  let record = await materialTable.findAll(query);
  if (record) {
    return record;
  }
  return false;
};
const findById = async (id) => {
  let User = await materialTable.findByPk(id);
  if (User) {
    return User;
  }
  return false;
};
const checkExists = async (condition) => {
  let record = await materialTable.findOne({
    where: condition,
  });
  if (record) {
    return true;
  }
  return false;
};

module.exports = {
  fetchAllWithCondition,
  createRecord,
  countDataAndFetch,
  dataFetch,
  updateRecord,
  findById,
  checkExists,
};
