const projectInvoiceTable = require("../database/schemas").DB.projectInvoice;
const createRecord = async (data) => {
  let invoice = await projectInvoiceTable.create(data);
  if (invoice) {
    return invoice;
  }
  return false;
};
module.exports = {
  createRecord,
};