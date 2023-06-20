const materialTable = require("../database/schemas").DB.defaultFolderSture;

const dataFetch = async (
  condition,
  limit = false,
  offset = false,
  orderBy = false,
  mode = false
) => {
  let query = {
    where: condition,
    order: [["id", "ASC"]],
  };
  if (limit && offset) {
    query.limit = Number(limit);
    query.offset = Number(offset);
  }
  if (orderBy && mode) {
    query.order = [[orderBy, mode]];
  }
  let record = await materialTable.findAll(query);
  if (record.length) {
    return record;
  }
  return false;
};
module.exports = {
  dataFetch,
};
