const projectModel = require("../../../../models").Project;
const projectMOMModel = require("../../../../models").projectMOM;
const validator = require("../../../../helpers").validator;
const fileUploaderSingle = require("../../../../helpers").fileUploader
  .fileUploaderSingle;
const {
  dateFormatDDMMYYYY,
  fullDatetimeFormat,
  fullDatetimeFormatDDMMYYYYHHIIAA,
  fullDatetimeFormatYYYYMMDDHHMMSS,
  encryptText,
  decryptText,
} = require("../../../../helpers").utilities;
const index = async (req, res) => {
    let encryptedId = {
        encryptedData: req.params.id.split("-")[0],
        iv: req.params.id.split("-")[1],
    };
    let projectDetails = await projectModel.findById(decryptText(encryptedId));
    return res.render("pages/project/communication", {
        title: "Project Communication",
        projectDetails,
        projectId: req.params.id,
    });
};
const weekly = async (req, res) => {
  let encryptedId = {
    encryptedData: req.params.id.split("-")[0],
    iv: req.params.id.split("-")[1],
  };
  let projectDetails = await projectModel.findById(decryptText(encryptedId));
  let docs = await projectDetails.getProject_moms({
    where: { type: "weekly", status: "1" },
  });
  return res.render("pages/project/communication/mom/weekly", {
    title: "Weekly MOM",
    projectDetails,
    projectId: req.params.id,
    docs,
  });
};
const monthly = async (req, res) => {
  let encryptedId = {
    encryptedData: req.params.id.split("-")[0],
    iv: req.params.id.split("-")[1],
  };
  let projectDetails = await projectModel.findById(decryptText(encryptedId));
  let docs = await projectDetails.getProject_moms({
    where: { type: "monthly", status: "1" },
  });
  return res.render("pages/project/communication/mom/monthly", {
    title: "Monthly MOM",
    projectDetails,
    projectId: req.params.id,
    docs,
  });
};
const save = async (req, res) => {
  const validationRule = {
    document_name: "required|string",
    mom_date: "required",
    mom_time: "required",
    type: "required|string",
  };
  await validator(req.body, validationRule, {}, async (err, status) => {
    if (!status) {
      return res.send({
        status: false,
        message: "Invalid Data!",
        data: err,
        redirect: "",
      });
    }
    if (req.files.document) {
      let image = await fileUploaderSingle(
        `./public/uploads/project_mom_${req.body.type}/`,
        req.files.document
      );
      let encryptedId = {
        encryptedData: req.params.id.split("-")[0],
        iv: req.params.id.split("-")[1],
      };
      let recordCreated = await projectMOMModel.createRecord({
        project_id: decryptText(encryptedId),
        document_name: req.body.document_name,
        mom_date: req.body.mom_date,
        mom_time: req.body.mom_time,
        type: req.body.type,
        file_name: image.newfileName,
        file_original_name: image.originalFileName,
        created_by: req.session.userId,
        created_at: fullDatetimeFormat(new Date()),
      });
      if (recordCreated) {
        return res.json({
          status: true,
          message:
            (req.body.type === "weekly" ? "Weekly" : "Monthly") +
            " MOM Uploaded successfully!",
          redirect: `project-communication/mom/${req.body.type}/${req.params.id}`,
          data: [],
        });
      }
      return res.json({
        status: false,
        message: "Oops somthing went wrong!",
        redirect: "",
        data: [],
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
};
module.exports = {
  index,
  weekly,
  monthly,
  save,
};
