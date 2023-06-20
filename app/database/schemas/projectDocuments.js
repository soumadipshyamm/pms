module.exports = (sequelize, Sequelize) => {
  const projectDocument = sequelize.define("project_document", {
    project_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue:null,
    },
    document_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    file_original_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    type: {
      type: Sequelize.ENUM("PD", "SSD"),
      allowNull: false,
      defaultValue: "PD",
      comment: "PD-Project Document,SSD-Safty & Security Document",
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
  return projectDocument;
};
