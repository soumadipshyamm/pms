module.exports = (sequelize, Sequelize) => {
  const projectContruct = sequelize.define("project_contruct", {
    client_type_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    project_type_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    client_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    contract_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    contruct_no: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    preparer_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    preparer_email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    budget: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    registration_date: {
      type: Sequelize.DATEONLY,
      allowNull: true,
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
  return projectContruct;
};
