const stateTable = require("../database/schemas").DB.State;
const getStateByCountryId = async (countryId) => {
  const data = await stateTable.findAll({
    where: { country_id: countryId,status:'1' },
    raw: true,
  });
  if (data) {
    return data;
  }
  return false;
};
module.exports = {
  getStateByCountryId,
};