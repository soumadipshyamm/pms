const userTable = require('../database/schemas').DB.Users
const { Op } = require("sequelize");
const findByEmail = async (email) => {
  let User = await userTable.findOne({
    where: { email: email, status: { [Op.not]: "3", } },
  });
  if (User) {
    return User;
  }
  return false;
}
const findByPhone = async (phone) => {
  let User = await userTable.findOne({
    where: { phone: phone, status: { [Op.not]: "3" } },
  });
  if (User) {
    return User;
  }
  return false;
};
const findById = async (id) => {
  let User = await userTable.findByPk(id);
  if (User) {
    return User;
  }
  return false;
};
const createRecord = async (data) => {
  let newUser = await userTable.create(data);
  if (newUser) {
    return newUser;
  }
  return false;
}
const updateRecord = async (data, condition) => {
  let updateUser = await userTable.update(data, { where: condition });
  if (updateUser) {
    return updateUser;
  }
  return false;
};
const countDataAndFetch = async (condition) => {
  let record = await userTable.findAndCountAll({
    where: condition,
  });
  if (record) {
    return record;
  }
  return false;
}
const dataFetch = async (condition, limit = false, offset = false, orderBy = false, mode = false) => {
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
  let record = await userTable.findAll(query);
  if (record) {
    return record;
  }
  return false;
};
const checkExists = async (condition) => {
  let record = await userTable.findOne({
    where: condition,
  });
  if (record) {
    return true;
  }
  return false;
};
module.exports = {
  findByEmail,
  createRecord,
  updateRecord,
  findByPhone,
  countDataAndFetch,
  dataFetch,
  findById,
  checkExists,
};