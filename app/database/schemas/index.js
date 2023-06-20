const { Sequelize,sequelize} = require('../index');
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const DB = {};
DB.sequelize = sequelize;
DB.Sequelize = Sequelize;
const sequelizeSessionStore = new SequelizeStore({
  db: sequelize,
});
DB.sequelizeSessionStore = sequelizeSessionStore;
DB.Users = require("./user")(sequelize, Sequelize);
DB.Profiles = require("./profile")(sequelize, Sequelize);
DB.Profiles.hasMany(DB.Users, { foreignKey: "profile_id" });
DB.Users.belongsTo(DB.Profiles, { foreignKey: "profile_id" });
DB.Roles = require("./role")(sequelize, Sequelize);
DB.Roles.hasMany(DB.Users, { foreignKey: "role_id" });
DB.Users.belongsTo(DB.Roles, { foreignKey: "role_id" });
DB.AdminMenus = require("./adminMenus")(sequelize, Sequelize);
DB.ProfilePermission = require("./profilePermission")(sequelize, Sequelize);
DB.UserPermission = require("./userPermission")(sequelize, Sequelize);
DB.Profiles.hasMany(DB.ProfilePermission, { foreignKey: "profile_id" });
DB.ProfilePermission.belongsTo(DB.Profiles, { foreignKey: "profile_id" });
DB.Users.hasMany(DB.UserPermission, { foreignKey: "user_id" });
DB.UserPermission.belongsTo(DB.Users, { foreignKey: "user_id" });
DB.AdminMenus.hasMany(DB.UserPermission, { foreignKey: "permission_menu_id" });
DB.UserPermission.belongsTo(DB.AdminMenus, { foreignKey: "permission_menu_id" });
DB.AdminMenus.hasMany(DB.ProfilePermission, { foreignKey: "permission_menu_id" });
DB.ProfilePermission.belongsTo(DB.AdminMenus, { foreignKey: "permission_menu_id" });
DB.Country = require("./country")(sequelize, Sequelize);
DB.State = require("./state")(sequelize, Sequelize);
DB.City = require("./city")(sequelize, Sequelize);
// DB.Country.hasMany(DB.State, { foreignKey: "country_id" });
// DB.State.belongsTo(DB.Country, { foreignKey: "country_id" });
// DB.State.hasMany(DB.City, { foreignKey: "state_id" });
// DB.City.belongsTo(DB.State, { foreignKey: "state_id" });
DB.ClientInfo = require("./clientInfo")(sequelize, Sequelize);
DB.Users.hasOne(DB.ClientInfo, { foreignKey: "user_id" });
DB.ClientInfo.belongsTo(DB.Users, { foreignKey: "user_id" });
DB.Country.hasMany(DB.Users, { foreignKey: "country_id" });
DB.Users.belongsTo(DB.Country, { foreignKey: "country_id" });
DB.State.hasMany(DB.Users, { foreignKey: "state_id" });
DB.Users.belongsTo(DB.State, { foreignKey: "state_id" });
DB.City.hasMany(DB.Users, { foreignKey: "city_id" });
DB.Users.belongsTo(DB.City, { foreignKey: "city_id" });

DB.Vendor = require("./vendor")(sequelize, Sequelize);
DB.Users.hasOne(DB.Vendor, { foreignKey: "user_id" });
DB.Vendor.belongsTo(DB.Users, { foreignKey: "user_id" });

DB.Project = require("./project")(sequelize, Sequelize);
DB.ProjectType = require('./projectType')(sequelize, Sequelize);


DB.projectDocument = require("./projectDocuments")(sequelize, Sequelize);
DB.Project.hasMany(DB.projectDocument, { foreignKey: "project_id" });
DB.projectDocument.belongsTo(DB.Project, { foreignKey: "project_id" });

DB.tempFiles = require("./tempFiles")(sequelize, Sequelize);

DB.projectResources = require("./projectResources")(sequelize, Sequelize);
DB.Project.hasMany(DB.projectResources, { foreignKey: "project_id" });
DB.projectResources.belongsTo(DB.Project, { foreignKey: "project_id" });

DB.projectTasks = require("./peojectTasks")(sequelize, Sequelize);
DB.Project.hasMany(DB.projectTasks, { foreignKey: "project_id" });
DB.projectTasks.belongsTo(DB.Project, { foreignKey: "project_id" });

DB.gnattLinks = require("./gnattLinks")(sequelize, Sequelize);

DB.materials = require("./material")(sequelize, Sequelize);

DB.projectBOQs = require("./projectBOQ")(sequelize, Sequelize);
DB.Project.hasMany(DB.projectBOQs, { foreignKey: "project_id" });
DB.projectBOQs.belongsTo(DB.Project, { foreignKey: "project_id" });
DB.materials.hasMany(DB.projectBOQs, { foreignKey: "material_id" });
DB.projectBOQs.belongsTo(DB.materials, { foreignKey: "material_id" });

DB.projectCostInfo = require("./projectCostInfo")(sequelize, Sequelize);
DB.Project.hasMany(DB.projectCostInfo, { foreignKey: "project_id" });
DB.projectCostInfo.belongsTo(DB.Project, { foreignKey: "project_id" });

DB.projectStakeHolderAndRisk = require("./projectStakeholderAndRisks")(sequelize, Sequelize);
DB.Project.hasMany(DB.projectStakeHolderAndRisk, { foreignKey: "project_id" });
DB.projectStakeHolderAndRisk.belongsTo(DB.Project, { foreignKey: "project_id" });

DB.projectInvoice = require("./projectInvoice")(sequelize, Sequelize);
DB.Project.hasMany(DB.projectInvoice, { foreignKey: "project_id" });
DB.projectInvoice.belongsTo(DB.Project, { foreignKey: "project_id" });

// DB.projectMOM = require("./projectMOM")(sequelize, Sequelize);
// DB.Project.hasMany(DB.projectMOM, { foreignKey: "project_id" });
// DB.projectMOM.belongsTo(DB.Project, { foreignKey: "project_id" });
DB.projectFolders = require("./projectFolders")(sequelize, Sequelize);
DB.Project.hasMany(DB.projectFolders, { foreignKey: "project_id" });
DB.projectFolders.belongsTo(DB.Project, { foreignKey: "project_id" });

DB.clientType = require("./clientType")(sequelize, Sequelize);
DB.defaultFolderSture = require("./defaultFolderSture")(sequelize, Sequelize);
DB.clientType.hasMany(DB.Users, { foreignKey: "client_type_id" });
DB.Users.belongsTo(DB.clientType, { foreignKey: "client_type_id" });
DB.projectContruct = require("./projectContruct")(sequelize, Sequelize);
DB.projectContruct.hasMany(DB.Project, { foreignKey: "project_contruct_id" });
DB.Project.belongsTo(DB.projectContruct, { foreignKey: "project_contruct_id" });
DB.Users.hasMany(DB.projectContruct, { foreignKey: "client_id" });
DB.projectContruct.belongsTo(DB.Users, { foreignKey: "client_id" });
DB.ProjectType.hasMany(DB.projectContruct, { foreignKey: "project_type_id" });
DB.projectContruct.belongsTo(DB.ProjectType, { foreignKey: "project_type_id" });
// DB.ProjectType.hasOne(DB.Project, { foreignKey: "project_sub_type_id" });
// DB.Project.belongsTo(DB.ProjectType, { foreignKey: "project_sub_type_id" });
module.exports = {
  DB
};