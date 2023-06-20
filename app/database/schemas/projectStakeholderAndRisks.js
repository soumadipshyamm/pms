module.exports = (sequelize, Sequelize) => {
  const projectStakeHolderAndRisk = sequelize.define(
    "project_stakeholders_and_risks",
    {
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stake_holder_and_risk_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("S", "R"),
        allowNull: false,
        defaultValue: "S",
        comment: "S-Stake Holder, R-Risk",
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
    }
  );
  return projectStakeHolderAndRisk;
};
