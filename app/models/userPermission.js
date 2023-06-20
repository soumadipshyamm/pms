const userPermission = require("../database/schemas").DB.UserPermission;
const batchCreate = async (dataToStore, updateOnDuplicate) => {
    const data = await userPermission.bulkCreate(dataToStore);
    if (data) {
        return true;
    }
    return false;
}
const batchDelete = async (condition) => {
    const data = await userPermission.destroy({
        where: condition,
        truncate: false,
    });
    if (data) {
        return true;
    }
    return false;
}
const getUserPermissions = async (condition) => {
  const data = await userPermission.findAll({
    where: condition,
    raw: true,
  });
  if (data) {
    return data;
  }
  return false;
};
module.exports = {
  batchCreate,
  batchDelete,
  getUserPermissions,
};