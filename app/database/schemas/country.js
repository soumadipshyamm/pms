module.exports = (sequelize, Sequelize)=>{
    const Role = sequelize.define("countries", {
      shortname: {
        type: Sequelize.STRING(3),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      phonecode: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("0", "1", "3"),
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
        type: Sequelize.DATE,
      },
    });
    return Role
  }