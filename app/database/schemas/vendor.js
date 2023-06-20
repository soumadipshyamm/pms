module.exports = (sequelize, Sequelize) => {
  const vendorInfo = sequelize.define("vendor_info", {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sub_type: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    organization: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    organization_email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    organization_phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    organization_address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    commercial_register_no: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    iban_no: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    gosi_certificate: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    vat_registration_certificate: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    saudization_certificate: {
      type: Sequelize.TEXT,
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
  return vendorInfo;
};
