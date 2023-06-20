const profileTable = require("../database/schemas").DB.Profiles;
const fetchAllWithCondition = async (condition) => {
  let data = await profileTable.findAll({ where: condition });
  if (data) {
    return data;
  }
  return false;
}

const createRecord = async (data) => {
  let newProfile = await profileTable.create(data);
  if (newProfile) {
    return newProfile;
  }
  return false;
};
const updateRecord = async (data, condition) => {
  let updateProfile = await profileTable.update(data, { where: condition });
  if (updateProfile) {
    return updateProfile;
  }
  return false;
};

const countDataAndFetch = async (condition)=>{
  let record = await profileTable.findAndCountAll({
    where: condition,
  });
  if (record) {
    return record;
  }
  return false;
}

const dataFetch = async (condition, limit = false, offset = false, orderBy=false, mode=false) => {
  let query = {
    where: condition,
    order: [ ["id", "DESC"] ],
  };
  if (limit && offset) {
    query.limit = Number(limit);
    query.offset = Number(offset);
  }
  if (orderBy && mode) {
     query.order = [[orderBy, mode]];
  }
  let record = await profileTable.findAll(query);
  if (record) {
    return record;
  }
  return false;
};
const findById = async (id) => {
  let User = await profileTable.findByPk(id);
  if (User) {
    return User;
  }
  return false;
};
const checkExists = async (condition) => {
  let record = await profileTable.findOne({
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