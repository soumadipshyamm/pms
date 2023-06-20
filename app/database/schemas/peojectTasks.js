module.exports = (sequelize, Sequelize) => {
  const projectTasks = sequelize.define("project_tasks", {
    project_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    task_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    start_date: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    end_date: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    duration: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    progress: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    parent: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    sortorder: {
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
  return projectTasks;
};
