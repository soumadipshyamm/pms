const projectDocumentTable = require("../database/schemas").DB.projectDocument;
const batchCreate = async (dataToStore) => {
  const data = await projectDocumentTable.bulkCreate(dataToStore);
  if (data) {
    return true;
  }
  return false;
};
const createRecord = async (data) => {
  let newUser = await projectDocumentTable.create(data);
  if (newUser) {
    return newUser;
  }
  return false;
};
const permaDelete = async (condition) => {
  const data = await projectDocumentTable.destroy({
    where: condition,
    truncate: false,
  });
  if (data) {
    return true;
  }
  return false;
};
const findById = async (id) => {
  let User = await projectDocumentTable.findByPk(id);
  if (User) {
    return User;
  }
  return false;
};
module.exports = {
  batchCreate,
  permaDelete,
  findById,
  createRecord,
};