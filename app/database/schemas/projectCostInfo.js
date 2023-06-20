module.exports = (sequelize, Sequelize) => {
  const projectBOQ = sequelize.define("project_cost_info", {
    project_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    capex: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    year1: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    year2: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    year3: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    year4: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    year5: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    sub_total: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    total_project_capex: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    estimate_type_and_accuracy: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    estimated_basis: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    contigency: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    total_asset_opex: {
      type: Sequelize.DECIMAL(12, 2),
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
  return projectBOQ;
};
