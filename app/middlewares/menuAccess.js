const sequelize = require("../database").sequelize;
const Sequelize = require("sequelize");

module.exports = async (memuName,profileId, userId, action) => {
  console.log(profileId);
  if (profileId === 1) {
    return true;
  } else {
    let menuId = await sequelize.query(
      `SELECT id FROM admin_menus WHERE slug ='${memuName}'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if(menuId[0]?.id){
        let permissionDetails = await sequelize.query(
          `SELECT id FROM user_permissions WHERE user_id ='${userId}' AND permission_menu_id = '${menuId[0]?.id}' AND action='${action}'`,{ type: Sequelize.QueryTypes.SELECT }
        );
        if(permissionDetails[0]?.id){
            return true;
        }
        return false;
    }
    return false;
  }
};
