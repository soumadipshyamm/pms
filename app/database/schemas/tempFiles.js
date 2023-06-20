module.exports = (sequelize, Sequelize) => {
  const TempFile = sequelize.define("temp_files", {
    cookie_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    document_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    file: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    file_original_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    event: {
      type: Sequelize.ENUM("add", "edit"),
      allowNull: false,
      defaultValue: "add",
    },
    reference: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    folder_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue:null,
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
  return TempFile;
};
