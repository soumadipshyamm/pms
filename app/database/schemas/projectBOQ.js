module.exports = (sequelize, Sequelize) => {
  const projectBOQ = sequelize.define("project_boq", {
    project_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    material_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    unit: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    rate: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    qty: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    tax: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    total: {
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
