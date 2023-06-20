const cityTable = require("../database/schemas").DB.City;
const getCityByStateId = async (stateId) => {
  const data = await cityTable.findAll({
    where: { state_id: stateId ,status:'1'},
    raw:true
  });
  if(data){
    return data;
  }
  return false;
};
module.exports={
    getCityByStateId
}