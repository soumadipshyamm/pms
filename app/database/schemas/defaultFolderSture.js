module.exports = (sequelize, Sequelize) => {
  const defaultFolderSture = sequelize.define("default_folder_sture", {
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    parent:{
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: "0",
      comment: "0-Parent, hierarchy_id>0=Parent Id ",
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    order: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM("0", "1", "3"),
      allowNull: false,
      defaultValue: "1",
      comment: "0-Inactve, 1-Active,3=Deleted",
    },
    created_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    deleted_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    createdAt: {
      field: "created_at",
      type: Sequelize.DATE,
    },
    updatedAt: {
      field: "updated_at",
      type: Sequelize.DATE,
    },
    deletedAt: {
      field: "deleted_at",
      type: Sequelize.DATE,
    },
  });
  return defaultFolderSture;
};
