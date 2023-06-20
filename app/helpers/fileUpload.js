const fs = require("fs");
const fileUploaderSingle =  async (path, file) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  let newfileName =  Date.now().toString() + file.name;
  let uploadPath = path + newfileName;
  await file.mv(uploadPath);
  return {originalFileName: file.name, newfileName};
};
const fileUploaderMultiple = (path, fileName) => {
  //   const multerStorage = multer.diskStorage({
  //     destination: (req, file, cb) => {
  //       cb(null, path);
  //     },
  //     filename: (req, file, cb) => {
  //       cb(null, `${path}/${Date.now().toString()}-${file.originalname}`);
  //     },
  //   });
  //   let uploader = multer({
  //     storage: multerStorage
  //   });
  //   return uploader.array(fileName);
};
module.exports = {
  fileUploaderSingle,
  fileUploaderMultiple,
};
