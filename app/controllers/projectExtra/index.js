const projectModel = require("../../models").Project;
const folderModel = require("../../models").projectFolders;
const projectTypeModel = require("../../models").ProjectTypes;
const validator = require("../../helpers").validator;
const fileUploaderSingle = require("../../helpers").fileUploader.fileUploaderSingle;
const { Op, Sequelize } = require("sequelize");
const { sequelize } = require("../../database");

const {
  dateFormatDDMMYYYY,
  fullDatetimeFormat,
  fullDatetimeFormatDDMMYYYYHHIIAA,
  fullDatetimeFormatYYYYMMDDHHMMSS,
  encryptText,
  decryptText,
  slugify,
} = require("../../helpers").utilities;
const index = async (req, res) => {
  let encryptedId = {
    encryptedData: req.params.id.split("-")[0],
    iv: req.params.id.split("-")[1],
  };
  let projectDetails = await projectModel.findById(decryptText(encryptedId));
  projectDetails.mainFolders = await projectDetails.getProject_folders({
    where: { parent: "0" },
    order: [["order", "ASC"]],
  });
  projectDetails.contructData = await projectDetails.getProject_contruct();
  projectDetails.contructData.clientInfo =
    await projectDetails.contructData.getUser();
  projectDetails.contructData.clientInfo.clientType =
    await projectDetails.contructData.clientInfo.getClient_type();
  projectDetails.contructData.projectType =
    await projectDetails.contructData.getProject_type();
  projectDetails.subType = await projectTypeModel.findById(
    projectDetails?.project_sub_type_id
  );

  return res.render("pages/projectExtra", {
    title: "Project Folders",
    projectDetails,
    projectId: req.params.id,
  });
};
const getSubFolderAndFiles = async (req, res) => {
  try {
    let data = await folderModel.dataFetch(
      { parent: req.body.id, project_id: req.body.projectId },
      false,
      false,
      "order",
      "ASC"
    );
    if (data) {
      return res.json({
        status: true,
        message: "Request processed Successfully!",
        redirect: "",
        data: data,
      });
    }
    return res.json({
      status: false,
      message: "No Data Found!",
      redirect: "",
      data: [],
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Oops somthing went wrong!",
      redirect: "",
      data: [],
    });
  }

}
const createSubFolderAndFiles = async (req,res)=>{
    const validationRule = {
      type: "required",
      projectId: "required",
      // name: "required",
      parent: "required",
    };
    await validator(req.body, validationRule, {}, async (err, status) => {
      if (!status) {
        return res.send({
          status: false,
          action: "error",
          message: "Invalid Data!",
          data: err,
          redirect: "",
          tid: null,
        });
      }
      const { type, name, projectId, parent, doument_name } = req.body;
      const lastOrder = await sequelize.query(
        `SELECT MAX(\`order\`) as lastOrder FROM project_folders WHERE parent = '${parent}' AND project_id = '${projectId}' AND status = '1'`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      let newOrder = lastOrder[0]?.lastOrder
        ? parseInt(lastOrder[0]?.lastOrder) + 1
        : 1;
      const lastFolderId = await sequelize.query(
        `SELECT MAX(\`folder_id\`) as lastId FROM project_folders WHERE project_id = '${projectId}' AND status = '1'`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      let newId = lastFolderId[0]?.lastId ? parseInt(lastFolderId[0]?.lastId) + 1 : 1;
      let insertData = {
        folder_id:newId,
        type,
        name,
        project_id: projectId,
        parent,
        slug: type === "folder" ? slugify(name) : null,
        order: newOrder
      };
      if(type==="file"){
        if(req.files.document){
            let image = await fileUploaderSingle("./public/uploads/project_folders/", req.files.document);
            insertData.name = image.newfileName;
            insertData.original_file_name = image.originalFileName;
            insertData.document_name = doument_name;
           
        }
      }
      const insert = await folderModel.createRecord(insertData);
      if (insert) {
        return res.send({
          status: true,
          action: "updated",
          data: {
            parent,
          },
          message:
            type === "folder"
              ? "Folder created Successfully!"
              : "File created Successfully!",
          redirect: parent === "0" ? "project-folders/" + req.params.id : "",
        });
      }
    }).catch((err) => {
      return res.send({
        status: false,
        message: "Something Went wrong!",
        data: err,
        redirect: "",
      });
    });
}
module.exports = {
  index,
  getSubFolderAndFiles,
  createSubFolderAndFiles,
};

