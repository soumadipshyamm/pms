const countryTable = require("../database/schemas").DB.Country;
const fetchAll = async (countryId) => {
  const data = await countryTable.findAll({
    where: { status: "1" },
    raw: true,
  });
  if (data) {
    return data;
  }
  return false;
};
const findById = async (countryId) => {
  const data = await countryTable.findByPk(countryId);
  if (data) {
    return data;
  }
  return false;
};
module.exports = {
  fetchAll,
  findById,
};