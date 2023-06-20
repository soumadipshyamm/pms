const sequelize = require("../database").sequelize;
const { encryptText } = require("../helpers").utilities;
const Sequelize = require("sequelize");
module.exports = async (req, res, next) => {
  if (req.session.userId) {
    req.session.menuAccess = [];
    req.session.projectAccess = [];
    if(req.session.profileId !=1){
      let permissionDetails = await sequelize.query(
        `SELECT group_concat(permission_menu_id) as menuId FROM user_permissions WHERE user_id ='${req.session.userId}'  AND action='view'`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      if (permissionDetails[0]?.menuId) {
          let menuNames = await sequelize.query(
            `SELECT group_concat(slug) as menuSlugs FROM admin_menus WHERE id IN(${permissionDetails[0]?.menuId})`,
            { type: Sequelize.QueryTypes.SELECT }
          );
          if(menuNames[0]?.menuSlugs){
            req.session.menuAccess = menuNames[0]?.menuSlugs?.split(",");
          }
      }
      let projectResourceCheck = await sequelize.query(
        `SELECT group_concat(project_id) as projectIds FROM project_resources WHERE FIND_IN_SET('${req.session.userId}',resource_ids)`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      if(projectResourceCheck[0]?.projectIds){
          let projects = await sequelize.query(
            `SELECT id,project_alt_id,name FROM projects WHERE id IN(${projectResourceCheck[0]?.projectIds}) AND status = '1'`,
            { type: Sequelize.QueryTypes.SELECT }
          );
          if(projects.length){
            for (const [key,val] of Object.entries(projects)) {
              var id = encryptText(String(val.id));
              var encryptedID = id.encryptedData + "-" + id.iv;
              req.session.projectAccess.push({
                id: encryptedID,
                project_alt_id: `${val.project_alt_id} ${val?.name?.split(" ")[0]}`,
              });
            }
          }
      }
    }
    if (req.session.profileId===1) {
      let menuNames = await sequelize.query(
        `SELECT group_concat(slug) as menuSlugs FROM admin_menus`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      if (menuNames[0]?.menuSlugs) {
        req.session.menuAccess = menuNames[0]?.menuSlugs?.split(",");
      }
      let projects = await sequelize.query(
        `SELECT id,project_alt_id,name FROM projects WHERE status = '1'`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      if (projects.length) {
        for (const [key, val] of Object.entries(projects)) {
          var id = encryptText(String(val.id));
          var encryptedID = id.encryptedData + "-" + id.iv;
          req.session.projectAccess.push({
            id: encryptedID,
            project_alt_id: `${val.project_alt_id} ${val?.name?.split(" ")[0]}`,
          });
        }
      }

    }
    next();
  } else {
    console.log(`No User Session Found`);
    return res.redirect("/");
  }
};
