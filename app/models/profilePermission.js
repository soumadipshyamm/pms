const profilePermission = require("../database/schemas").DB.ProfilePermission;
const batchCreate = async (dataToStore, updateOnDuplicate) => {
    const data = await profilePermission.bulkCreate(dataToStore);
    if (data) {
        return true;
    }
    return false;
}
const batchDelete = async (condition) => {
    const data = await profilePermission.destroy({
        where: condition,
        truncate: false,
    });
    if (data) {
        return true;
    }
    return false;
}
const fetchAllWithCondition = async (condition) => {
    const data = await profilePermission.findAll({ raw:true, where: condition });
    if (data) {
      return data;
    }
    return false;
  }
module.exports = {
    batchCreate,
    batchDelete,
    fetchAllWithCondition,
};