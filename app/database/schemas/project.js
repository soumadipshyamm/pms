module.exports = (sequelize, Sequelize) => {
  const Projects = sequelize.define("projects", {
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    project_contruct_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    project_alt_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: `AAW-${Date.now().toString()}`,
    },
    project_sub_type_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    npmo_no: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    entity_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    objectives: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    },
    scope: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    },
    strategic_context: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    },
    studies: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    },
    route_detail: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    },
    potential_impact: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    },
    location: {
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
    project_status: {
      type: Sequelize.ENUM("1","2","3","4"),
      allowNull: false,
      defaultValue: "1",
      comment: "1-Running Projects,2-Preliminary handed over projects,3-finally handed over projects,4-withdrawn projects",
    },
    contractors: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    consultants: {
      type: Sequelize.STRING,
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
  return Projects;
};
