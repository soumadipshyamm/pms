module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    alt_Id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    client_type_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue:null
    },
    profile_image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    profile_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    dial_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    department: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    dob: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    reporting_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    gender: {
      type: Sequelize.ENUM("M", "F", "O"),
      allowNull: false,
      defaultValue: "O",
      comment: "M=Male, F-Female,O=Other",
    },
    address: {
      type: Sequelize.TEXT("medium"),
      allowNull: true,
    },
    country_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    state_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    city_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    OTP: {
      type: Sequelize.TINYINT,
      allowNull: true,
    },
    is_verified: {
      type: Sequelize.ENUM("0", "1"),
      allowNull: false,
      defaultValue: "0",
      comment: "0-No, 1-Yes",
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
  return Users;
};
