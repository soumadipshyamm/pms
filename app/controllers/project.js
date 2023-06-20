const userModel = require("../models").User;
const projectModel = require("../models").Project;
const projectTypeModel = require("../models").ProjectTypes;
const profileModel = require("../models").Profile;
const tempFileModel = require("../models").tempFiles;
const projectDocumentModel = require("../models").projectDocuments;
const projectResourcesModel = require("../models").projectResources;
const projectTaskModel = require("../models").projectTasks;
const materialModel = require("../models").materials;
const projectBOQModel = require("../models").projectBOQs;
const projectCostInfo = require("../models").projectCostInfo;
const projectStakeholderAndRisksModel =
  require("../models").projectStakeholderAndRisks;
const projectInvoiceModel = require("../models").projectInvoice;
const clientTypeModel = require("../models").clientType;
const projectContructModel = require("../models").projectContruct;
const defaultFolderStructureModel = require("../models").defaultFolderStructure;
const projectFoldersModel = require("../models").projectFolders;
const validator = require("../helpers").validator;
const fs = require("fs");
const { Op, Sequelize } = require("sequelize");
const { sequelize } = require("../database");
const { timezone } = require("../config");
const fileUploaderSingle =
  require("../helpers").fileUploader.fileUploaderSingle;
const menmuAccess = require("../middlewares").menuAccess;
const {
  dateFormatDDMMYYYY,
  fullDatetimeFormat,
  fullDatetimeFormatDDMMYYYYHHIIAA,
  fullDatetimeFormatYYYYMMDDHHMMSS,
  encryptText,
  decryptText,
} = require("../helpers").utilities;
const index = async (req, res) => {
  if (
    !(await menmuAccess(
      "project-management",
      req.session.profileId,
      req.session.userId,
      "view"
    ))
  ) {
    return res.status(403).redirect("/access-forbidden");
  }
  let clientId = null;
  if (req?.query?.clientId) {
    let encryptedId = {
      encryptedData: req.query.clientId.split("-")[0],
      iv: req.query.clientId.split("-")[1],
    };
    clientId = decryptText(encryptedId);
  }
  const clientList = await userModel.dataFetch(
    { status: "1", profile_id: "6" },
    false,
    false,
    "first_name",
    "ASC"
  );
  const projectTypeList = await projectTypeModel.dataFetch(
    { status: "1" },
    false,
    false,
    "name",
    "ASC"
  );
  return res.render("pages/project/list", {
    title: req.i18n_texts.projectManagement.title.list,
    clientList,
    clientId,
    projectTypeList,
  });
};
const add = async (req, res) => {
  let title = req.i18n_texts.projectManagement.title.add;
  let oldData = null;
  let contructData = null;
  if (req.params.contructId) {
    let encryptedId = {
      encryptedData: req.params.contructId.split("-")[0],
      iv: req.params.contructId.split("-")[1],
    };
    if (req?.params?.id) {
      let encryptedProjectID = {
        encryptedData: req?.params?.id?.split("-")[0],
        iv: req?.params?.id?.split("-")[1],
      };
      oldData = await projectModel.findById(decryptText(encryptedProjectID));
      oldData.projectDocument = await oldData.getProject_documents({
        where: { type: "PD" },
      });
    }
    contructData = await projectContructModel.findById(
      decryptText(encryptedId)
    );
    contructData.clientInfo = await contructData.getUser();
    contructData.clientInfo.clientType =
      await contructData.clientInfo.getClient_type();
    contructData.projectType = await projectTypeModel.dataFetch(
      { parent: contructData.project_type_id },
      false,
      false,
      "name",
      "ASC"
    );
    let title = req.i18n_texts.projectManagement.title.edit;
    if (
      !(await menmuAccess(
        "project-management",
        req.session.profileId,
        req.session.userId,
        "edit"
      ))
    ) {
      return res.status(403).redirect("/access-forbidden");
    }
  } else {
    if (
      !(await menmuAccess(
        "project-management",
        req.session.profileId,
        req.session.userId,
        "add"
      ))
    ) {
      return res.status(403).redirect("/access-forbidden");
    }
  }

  const clientList = await userModel.dataFetch(
    { status: "1", profile_id: "6" },
    false,
    false,
    "first_name",
    "ASC"
  );
  const clientTypes = await clientTypeModel.dataFetch(
    { status: "1" },
    false,
    false,
    "name",
    "ASC"
  );
  const projectTypeList = await projectTypeModel.dataFetch(
    { status: "1", parent: "0" },
    false,
    false,
    "name",
    "ASC"
  );

  return res.render("pages/project/add", {
    title,
    oldData,
    clientList,
    projectTypeList,
    clientTypes,
    contructData,
    contructId: req.params.contructId,
  });
};
const createContruct = async (req, res) => {
  let title = req.i18n_texts.projectManagement.title.add;
  let oldData = null;
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    oldData = await projectModel.findById(decryptText(encryptedId));
    oldData.projectDocument = await oldData.getProject_documents({
      where: { type: "PD" },
    });
    title = req.i18n_texts.projectManagement.title.edit;
    if (
      !(await menmuAccess(
        "project-management",
        req.session.profileId,
        req.session.userId,
        "edit"
      ))
    ) {
      return res.status(403).redirect("/access-forbidden");
    }
  } else {
    if (
      !(await menmuAccess(
        "project-management",
        req.session.profileId,
        req.session.userId,
        "add"
      ))
    ) {
      return res.status(403).redirect("/access-forbidden");
    }
  }
  const clientList = await userModel.dataFetch(
    { status: "1", profile_id: "6" },
    false,
    false,
    "first_name",
    "ASC"
  );
  const clientTypes = await clientTypeModel.dataFetch(
    { status: "1" },
    false,
    false,
    "name",
    "ASC"
  );
  const projectTypeList = await projectTypeModel.dataFetch(
    { status: "1", parent: "0" },
    false,
    false,
    "name",
    "ASC"
  );
  return res.render("pages/project/contruct-create", {
    title,
    oldData,
    clientList,
    projectTypeList,
    clientTypes,
  });
};
const createAndUpdate = async (req, res) => {
  const validationRule = {
    name: "required|string",
    location: "required|string",
    start_date: "required",
    end_date: "required",
    project_sub_type_id: "required",
    entity_name: "required",
    npmo_no: "required",
    objectives: "required",
    potential_impact: "required",
    saveType: "required",
    countructId: "required",
    route_detail: "required",
    scope: "required",
    strategic_context: "required",
    studies: "required",
    project_alt_id: "required",
    project_status: "required",
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
    if (req.body.updateId == "") {
      let encryptedCountructId = {
        encryptedData: req.body.countructId.split("-")[0],
        iv: req.body.countructId.split("-")[1],
      };
      let projectSave = await projectModel.createRecord({
        project_contruct_id: decryptText(encryptedCountructId),
        project_sub_type_id: req.body.project_sub_type_id,
        project_alt_id: req.body.project_alt_id,
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        project_status: req.body.project_status,
        entity_name: req.body.entity_name,
        npmo_no: req.body.npmo_no,
        objectives: req.body.objectives,
        potential_impact: req.body.potential_impact,
        route_detail: req.body.route_detail,
        scope: req.body.scope,
        strategic_context: req.body.strategic_context,
        studies: req.body.studies,
        created_at: fullDatetimeFormat(new Date()),
        created_by: req.session.userId,
      });
      if (projectSave) {
        let tempFiles = await tempFileModel.fetchAllWithCondition({
          cookie_id: req.cookies["connect.sid"].split("s:")[1],
        });
        let tempArr = [];
        if (tempFiles) {
          for (let [key, val] of Object.entries(tempFiles)) {
            tempArr.push({
              project_id: projectSave.id,
              document_name: val.document_name,
              filename: val.file,
              file_original_name: val.file_original_name,
              type: "PD",
              created_at: fullDatetimeFormat(new Date()),
            });
          }
          await projectDocumentModel.batchCreate(tempArr);
          await tempFileModel.permaDelete({
            cookie_id: req.cookies["connect.sid"].split("s:")[1],
          });
          let defaultFolders = await defaultFolderStructureModel.dataFetch({status:'1'});
          let folderArr = [];
          if (defaultFolders) {
              for (let [key, val] of Object.entries(defaultFolders)) {
                 folderArr.push({
                   project_id: projectSave.id,
                   folder_id:val.id,
                   name: val.name,
                   parent: val.parent,
                   slug: val.slug,
                   order: val.order,
                   created_by: req.session.userId,
                   created_at: fullDatetimeFormat(new Date()),
                 });
              }
          }
          await projectFoldersModel.batchCreate(folderArr);
        }
        return res.send({
          status: true,
          message: "Project Created successfully!",
          data: [],
          redirect:
            req.body.saveType === "save"
              ? `project-next/${req.body.countructId}`
              : `project-list`,
        });
      } else {
        return res.send({
          status: false,
          message: "Something went wrong!",
          data: [],
          redirect: "",
        });
      }
    } else {
      let projectSave = await projectModel.updateRecord(
        {
          project_sub_type_id: req.body.project_sub_type_id,
          name: req.body.name,
          project_alt_id: req.body.project_alt_id,
          description: req.body.description,
          location: req.body.location,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          project_status: req.body.project_status,
          entity_name: req.body.entity_name,
          npmo_no: req.body.npmo_no,
          objectives: req.body.objectives,
          potential_impact: req.body.potential_impact,
          route_detail: req.body.route_detail,
          scope: req.body.scope,
          strategic_context: req.body.strategic_context,
          studies: req.body.studies,
          updated_at: fullDatetimeFormat(new Date()),
          updated_by: req.session.userId,
        },
        { id: req.body.updateId }
      );
      if (projectSave) {
        let tempFiles = await tempFileModel.fetchAllWithCondition({
          cookie_id: req.cookies["connect.sid"].split("s:")[1],
        });
        let tempArr = [];
        if (tempFiles) {
          for (let [key, val] of Object.entries(tempFiles)) {
            tempArr.push({
              project_id: req.body.updateId,
              document_name: val.document_name,
              filename: val.file,
              type: "PD",
              file_original_name: val.file_original_name,
              created_at: fullDatetimeFormat(new Date()),
            });
          }
          await projectDocumentModel.batchCreate(tempArr);
          await tempFileModel.permaDelete({
            cookie_id: req.cookies["connect.sid"].split("s:")[1],
          });
        }
        return res.send({
          status: true,
          message: "Project Updated successfully!",
          data: [],
          redirect:
            req.body.saveType === "save"
              ? `project-next/${req.body.countructId}`
              : `project-list`,
        });
      } else {
        return res.send({
          status: false,
          message: "Something went wrong!",
          data: [],
          redirect: "",
        });
      }
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
const contructCreate = async (req, res) => {
  const validationRule = {
    client_type_id: "required",
    client_id: "required|string",
    project_type_id: "required|string",
    contract_name: "required",
    contruct_no: "required",
    preparer_name: "required",
    preparer_email: "required",
    registration_date: "required",
    budget: "required",
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
    let projectContructSave = await projectContructModel.createRecord({
      client_type_id: req.body.client_type_id,
      client_id: req.body.client_id,
      project_type_id: req.body.project_type_id,
      contract_name: req.body.contract_name,
      contruct_no: req.body.contruct_no,
      preparer_name: req.body.preparer_name,
      preparer_email: req.body.preparer_email,
      registration_date: req.body.registration_date,
      budget: req.body.budget,
      created_at: fullDatetimeFormat(new Date()),
      created_by: req.session.userId,
    });
    if (projectContructSave) {
      let id = encryptText(String(projectContructSave.id));
      let encryptedID = id.encryptedData + "-" + id.iv;
      return res.send({
        status: true,
        message: "Information saved!",
        data: err,
        redirect: "project-next/" + encryptedID,
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
const ajaxDataTable = async (req, res) => {
  let draw = req.body.draw;
  let start = req.body.start;
  let rowperpage = req.body.length;
  let columnNameArr = req.body.columns;
  let orderArr = req.body.order;
  let searchArr = req.body.search;
  let columnIndex = orderArr[0]["column"];
  let columnName = columnNameArr[columnIndex]["data"];
  let coloumnSortOrder = orderArr[0]["dir"];
  let searchValue = searchArr["value"];
  let condition = {
    status: { [Op.not]: "3" },
    project_status:req?.body?.currentStatus
  };
  if (req?.body?.projectName) {
    condition.name = { [Op.like]: "%" + req.body.projectName + "%" };
  }
  if (req?.body?.projectCode) {
    condition.project_alt_id = { [Op.like]: "%" + req.body.projectCode + "%" };
  }
  if (req?.body?.projectType) {
    condition.project_sub_type_id = req.body.projectType;
  }

  let totalRecords = await projectModel.countDataAndFetch(condition);

  let totalRecorsWithFilter = await projectModel.countDataAndFetch(condition);
  let records = await projectModel.dataFetch(
    condition,
    rowperpage,
    start,
    columnName,
    coloumnSortOrder
  );
  let tempArr = [];
  for (let [key, val] of Object.entries(records)) {
    var id = encryptText(String(val.id));
    var encryptedID = id.encryptedData + "-" + id.iv;
    var contruct = await val?.getProject_contruct();
    var contructId = encryptText(String(contruct.id));
    var encryptedcontructID = contructId.encryptedData + "-" + contructId.iv;
    if (val.status === "1") {
      var status = `<div class="form-switch switch_cbox">
                          <input class="form-check-input change-status" type="checkbox" role="switch" id="${encryptedID}" data-table="projects" data-status="0" data-key="id" data-id="${encryptedID}" checked>
                          <label class="form-check-label" for=""></label>
                        </div>`;
    } else {
      var status = `<div class="form-switch switch_cbox">
                          <input class="form-check-input change-status" type="checkbox" role="switch" id="${encryptedID}" data-table="projects" data-status="1" data-key="id" data-id="${encryptedID}" >
                          <label class="form-check-label" for=""></label>
                        </div>`;
    }
    var action = `<a class="customPopup" href="javascript:void(0)" data-id="${encryptedID}" data-contruct-id="${encryptedcontructID}">
                      <i class="fa-solid fa-ellipsis-vertical"></i>
                  </a>`;
    contruct.client = await contruct?.getUser();
    contruct.clientType = await contruct?.client?.getClient_type();
    contruct.projectType = await contruct?.getProject_type();
    var subtype = await projectTypeModel.findById(val?.project_sub_type_id);

    tempArr.push({
      id: Number(key) + 1,
      name: val?.name?`<a href="/project-folders/${encryptedID}">${val.name}</a>`: "N/A",
      project_alt_id: val?.project_alt_id ?? "N/A",
      project_contruct_id: contruct?.contract_name ?? "N/A",
      contruct_no: contruct?.contruct_no ?? "N/A",
      project_type: contruct?.projectType?.name ?? "N/A",
      project_sub_type: subtype?.name ?? "N/A",
      client_type: contruct?.clientType?.name ?? "N/A",
      client_name:
        contruct?.client?.first_name && contruct?.client?.last_name
          ? contruct?.client?.first_name + " " + contruct?.client?.last_name
          : "N/A",
      location: val.location,
      budget: contruct?.budget ?? "N/A",
      start_date: dateFormatDDMMYYYY(val.start_date),
      end_date: dateFormatDDMMYYYY(val.end_date),
      status: status,
      created_at: fullDatetimeFormatDDMMYYYYHHIIAA(val.createdAt),
      action: action,
    });
  }
  return res.json({
    draw: draw,
    recordsTotal: totalRecords.count,
    recordsFiltered: totalRecorsWithFilter.count,
    data: tempArr,
  });
};
const projectDetails = async (req, res) => {
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    const oldData = await projectModel.findById(decryptText(encryptedId));
    oldData.projectDocument = await oldData.getProject_documents({
      where: { type: "PD" },
    });
    // oldData.clientInfo = await oldData.getUser();
    return res.render("pages/project/details", {
      title: "Project Details",
      oldData,
      projectId: req.params.id,
    });
  }
  return res.status(403).send("Access forbidden ");
};
const projectFileDelete = async (req, res) => {
  const existingData = await projectDocumentModel.findById(req.body.id);
  if (existingData) {
    fs.unlink(
      `./public/uploads/project_documents/${existingData.filename}`,
      function (err) {
        if (err) return console.log(err);
        console.log("file deleted successfully");
      }
    );
  }
  const deleted = await projectDocumentModel.permaDelete({
    id: req.body.id,
  });
  if (deleted) {
    return res.json({
      status: true,
      message: "Deleted Successfully!",
      redirect: "",
      data: [],
    });
  }
  return res.json({
    status: false,
    message: "Oops somthing went wrong!",
    redirect: "",
    data: [],
  });
};
const timeTableAndSchedule = async (req, res) => {
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    let oldData = await projectModel.findById(decryptText(encryptedId));
    return res.render("pages/project/time-table-and-schedule", {
      title: "Project Time Table & Schedule",
      oldData,
      projectId: req.params.id,
    });
  }
};
const manageResources = async (req, res) => {
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    let oldData = await projectModel.findById(decryptText(encryptedId));
    let resources = await oldData.getProject_resources();
    let tempArr = [];
    for (let [key, val] of Object.entries(resources)) {
      tempArr.push({
        id: val.id,
        designation_name: val.designation_name,
        resources: val.resource_ids
          ? await userModel.dataFetch({
              id: { [Op.in]: val.resource_ids.split(",") },
            })
          : [],
      });
    }
    if (req?.query?.response === "json") {
      return res.send({
        status: true,
        message: "Data Available",
        data: tempArr,
        redirect: "",
      });
    }
    return res.render("pages/project/resources", {
      title: "Project Resources",
      oldData,
      existingResources: tempArr,
    });
  }
};
const resourceSave = async (req, res) => {
  const validationRule = {
    project_id: "required",
    designation_name: "required|string",
    parent: "required",
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
    var id = encryptText(String(req.body.project_id));
    var encryptedID = id.encryptedData + "-" + id.iv;
    let projectResourceSave = await projectResourcesModel.createRecord({
      project_id: req.body.project_id,
      designation_name: req.body.designation_name,
      parent: req.body.parent,
      created_at: fullDatetimeFormat(new Date()),
      created_by: req.session.userId,
    });
    if (projectResourceSave) {
      return res.send({
        status: true,
        message: "Project designation created successfully!",
        data: [],
        redirect: "project-resources/" + encryptedID,
      });
    } else {
      return res.send({
        status: false,
        message: "Something went wrong!",
        data: [],
        redirect: "",
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
const resourceUpdate = async (req, res) => {
  const validationRule = {
    designationId: "required",
    resource_ids: "required",
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

    let projectResourceUpdate = await projectResourcesModel.updateRecord(
      {
        resource_ids:
          typeof req.body.resource_ids === "string"
            ? req.body.resource_ids
            : req.body.resource_ids.join(","),
        updated_at: fullDatetimeFormat(new Date()),
        updated_by: req.session.userId,
      },
      { id: req.body.designationId }
    );
    if (projectResourceUpdate) {
      var id = encryptText(String(req.body.project_id));
      var encryptedID = id.encryptedData + "-" + id.iv;
      return res.send({
        status: true,
        message: "Resource updated successfully!",
        data: [],
        redirect: "project-resources/" + encryptedID,
      });
    } else {
      return res.send({
        status: false,
        message: "Something went wrong!",
        data: [],
        redirect: "",
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
const getTeams = async (req, res) => {
  const selectedTeamIds = await projectResourcesModel.findById(
    req?.body?.designationId
  );
  let profileList = await profileModel.fetchAllWithCondition({
    status: "1",
    type: "1",
  });
  let profileIdArr = [];
  for (let [key, val] of Object.entries(profileList)) {
    if (val.id == "1") {
      continue;
    }
    profileIdArr.push(val.id);
  }
  let condition = {
    status: { [Op.not]: "3" },
    profile_id: { [Op.in]: profileIdArr },
  };
  if (req?.body?.searchName != "") {
    condition.where = Sequelize.where(
      Sequelize.fn(
        "concat",
        Sequelize.col("first_name"),
        " ",
        Sequelize.col("last_name")
      ),
      {
        [Op.like]: "%" + req.body.searchName + "%",
      }
    );
  }
  let records = await userModel.dataFetch(condition);
  if (records.length) {
    return res.send({
      status: true,
      message: "Data Found!",
      data: { selectedItems: selectedTeamIds, records: records },
      redirect: "",
    });
  }
  return res.send({
    status: false,
    message: "Something went wrong!",
    data: [],
    redirect: "",
  });
};
const deleteTeam = async (req, res) => {
  const validationRule = {
    resourceId: "required",
    designationId: "required",
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
    const selectedTeamIds = await projectResourcesModel.findById(
      req?.body?.designationId
    );
    let resourceIds = selectedTeamIds
      ? selectedTeamIds.resource_ids.split(",")
      : [];
    let removeElementIndex = resourceIds.indexOf(req?.body?.resourceId);
    if (removeElementIndex > -1) {
      resourceIds.splice(index, 1);
    }
    let projectResourceUpdate = await projectResourcesModel.updateRecord(
      {
        resource_ids: resourceIds.length ? resourceIds.join(",") : null,
        updated_at: fullDatetimeFormat(new Date()),
        updated_by: req.session.userId,
      },
      { id: req.body.designationId }
    );
    if (projectResourceUpdate) {
      return res.send({
        status: true,
        message: "Resource updated successfully!",
        data: [],
        redirect: "",
      });
    } else {
      return res.send({
        status: false,
        message: "Something went wrong!",
        data: [],
        redirect: "",
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
const fetchTask = async (req, res) => {
  let encryptedId = {
    encryptedData: req.query.projectId.split("-")[0],
    iv: req.query.projectId.split("-")[1],
  };
  const tasks = await projectTaskModel.dataFetch(
    { status: "1", project_id: decryptText(encryptedId) },
    false,
    false,
    "sortorder",
    "ASC"
  );
  const links = await projectTaskModel.executeRawQuery(
    "SELECT * FROM `gantt_links`"
  );
  let tempArr = [];
  for (let [key, val] of Object.entries(tasks)) {
    tempArr.push({
      id: val.id,
      text: val.task_name,
      start_date: val.start_date,
      parent: val.parent,
      duration: val.duration,
      progress: val.progress,
      open: true,
    });
  }
  let tempArr2 = [];
  for (let [key, val] of Object.entries(links[0])) {
    tempArr2.push({
      id: val.id,
      source: val.source,
      target: val.target,
      type: val.type,
    });
  }
  return res.send({
    data: tempArr,
    links: tempArr2,
  });
};
const saveNewTask = async (req, res) => {
  const validationRule = {
    text: "required",
    start_date: "required",
    duration: "required",
    progress: "required",
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
    let maxOrder = await projectTaskModel.executeRawQuery(
      "SELECT MAX(`sortorder`) AS `maxOrder` FROM `project_tasks`"
    );
    let orderIndex = (maxOrder[0].maxOrder || 0) + 1;
    let encryptedId = {
      encryptedData: req.query.projectId.split("-")[0],
      iv: req.query.projectId.split("-")[1],
    };
    let taskSave = await projectTaskModel.createRecord({
      project_id: decryptText(encryptedId),
      task_name: req.body.text,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      duration: req.body.duration,
      progress: req.body.progress || 0,
      parent: req.body.parent,
      sortorder: orderIndex,
      created_at: fullDatetimeFormat(new Date()),
      created_by: req.session.userId,
    });
    if (taskSave) {
      return res.send({
        status: true,
        action: "inserted",
        message: "Task Added Successfully!",
        data: err,
        redirect: "",
        tid: taskSave.id,
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
const deleteTask = async (req, res) => {
  const taskDeleted = await projectTaskModel.permaDelete({ id: req.params.id });
  if (taskDeleted) {
    return res.send({
      status: true,
      action: "deleted",
      message: "Task Deleted Successfully!",
      redirect: "",
    });
  }
};
const updateTask = async (req, res) => {
  const validationRule = {
    text: "required",
    start_date: "required",
    duration: "required",
    progress: "required",
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
    let updateId = req.params.id;
    let taskSave = await projectTaskModel.updateRecord(
      {
        task_name: req.body.text,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        duration: req.body.duration,
        progress: req.body.progress || 0,
        parent: req.body.parent,
        updated_at: fullDatetimeFormat(new Date()),
        updated_by: req.session.userId,
      },
      { id: updateId }
    );
    if (taskSave) {
      await updateOrder(updateId, req?.body?.target);
      return res.send({
        status: true,
        action: "updated",
        message: "Task Updated Successfully!",
        data: err,
        redirect: "",
        tid: taskSave.id,
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
const updateOrder = async (taskId, target) => {
  let nextTask = false;
  let targetOrder;
  target = target || "";
  if (target.startsWith("next:")) {
    target = target.substr("next:".length);
    nextTask = true;
  }
  const existingTaskId = await projectTaskModel.findById(target);
  if (existingTaskId) {
    targetOrder = existingTaskId.sortorder;
    if (nextTask) {
      targetOrder++;
    }
    const firstUpdated = await projectTaskModel.executeRawQuery(
      "UPDATE `project_tasks` SET `sortorder` = `sortorder` + 1 WHERE `sortorder` >= " +
        targetOrder
    );
    if (firstUpdated) {
      return await projectTaskModel.updateRecord(
        {
          sortorder: targetOrder,
        },
        { id: taskId }
      );
    }
  }
};
const addTaskLink = async (req, res) => {
  const validationRule = {
    source: "required",
    target: "required",
    type: "required",
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
    const linkSave = await projectTaskModel.executeRawQuery(
      `INSERT INTO gantt_links (source, target, type,created_at,created_by) VALUES ('${
        req.body.source
      }','${req.body.target}','${req.body.type}','${fullDatetimeFormat(
        new Date()
      )}','${req.session.userId}')`
    );
    if (linkSave) {
      return res.send({
        status: true,
        action: "updated",
        message: "Link Created Successfully!",
        data: err,
        redirect: "",
        tid: linkSave.id,
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
const updateTaskLink = async (req, res) => {
  const validationRule = {
    source: "required",
    target: "required",
    type: "required",
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
    let updateId = req.params.id;
    const linkUpdate = await projectTaskModel.executeRawQuery(
      `UPDATE gantt_links SET source = '${req.body.source}', target = '${
        req.body.target
      }', type = '${req.body.type}',updated_at='${fullDatetimeFormat(
        new Date()
      )}, updated_by = '${req.session.userId}' WHERE id = ${req.params.id} `
    );
    if (linkUpdate) {
      return res.send({
        status: true,
        action: "updated",
        message: "Link Updated Successfully!",
        data: err,
        redirect: "",
        tid: taskSave.id,
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
const deleteTaskLink = async (req, res) => {
  const linkDeleted = await projectTaskModel.executeRawQuery(
    `DELETE FROM gantt_links WHERE id = '${req.params.id}'`
  );
  if (linkDeleted) {
    return res.send({
      status: true,
      action: "deleted",
      message: "Link Deleted Successfully!",
      redirect: "",
    });
  }
};
const safetyAndSecurity = async (req, res) => {
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    const oldData = await projectModel.findById(decryptText(encryptedId));
    oldData.projectDocument = await oldData.getProject_documents({
      where: { type: "SSD" },
    });
    return res.render("pages/project/safety-and-security", {
      title: "Project Details",
      oldData,
      projectId: req.params.id,
    });
  }
  return res.status(403).send("Access forbidden ");
};
const uploadSafetyAndSecurityDocument = async (req, res) => {
  const validationRule = {
    document_name: "required|string",
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
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    if (req.files.document) {
      let image = await fileUploaderSingle(
        "./public/uploads/project_documents/",
        req.files.document
      );
      let recordCreated = await projectDocumentModel.createRecord({
        project_id: decryptText(encryptedId),
        document_name: req.body.document_name,
        filename: image.newfileName,
        file_original_name: image.originalFileName,
        type: "SSD",
        created_by: req.session.userId,
        created_at: fullDatetimeFormat(new Date()),
      });
      if (recordCreated) {
        return res.json({
          status: true,
          message: "File Uploaded successfully!",
          redirect: "project-safety-and-security/" + req.params.id,
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
    return res.json({
      status: false,
      message: "No file is present in the request",
      redirect: "",
      data: [],
    });
  }).catch((err) => {
    return res.send({
      status: false,
      message: "Something Went wrong!",
      data: err,
      redirect: "",
    });
  });
};
const boq = async (req, res) => {
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    let oldData = await projectModel.findById(decryptText(encryptedId));
    oldData.boqs = await oldData.getProject_boqs();
    const materialList = await materialModel.dataFetch(
      {
        status: { [Op.not]: "3" },
      },
      false,
      false,
      "name",
      "ASC"
    );

    return res.render("pages/project/boq", {
      title: "Project Details",
      oldData,
      materialList,
      projectId: req.params.id,
    });
  }
  return res.status(403).send("Access forbidden ");
};
const boqSave = async (req, res) => {
  const validationRule = {
    name: "required|string",
    material_id: "required|string",
    code: "required|string",
    unit: "required|string",
    rate: "required|string",
    qty: "required|string",
    tax: "required|string",
    total: "required|string",
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
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    if (
      await projectBOQModel.checkExists({
        material_id: req.body.material_id,
        project_id: decryptText(encryptedId),
      })
    ) {
      return res.json({
        status: false,
        message: "Material aleary exists in BOQ!",
        redirect: "",
        data: [],
      });
    }
    let recordCreated = await projectBOQModel.createRecord({
      project_id: decryptText(encryptedId),
      material_id: req.body.material_id,
      name: req.body.name,
      code: req.body.code,
      unit: req.body.unit,
      rate: req.body.rate,
      qty: req.body.qty,
      tax: req.body.tax,
      total: req.body.total,
      created_by: req.session.userId,
      created_at: fullDatetimeFormat(new Date()),
    });
    if (recordCreated) {
      return res.json({
        status: true,
        message: "Record created successfully!",
        redirect: "project-boq/" + req.params.id,
        data: [],
      });
    }
    return res.json({
      status: false,
      message: "Oops somthing went wrong!",
      redirect: "",
      data: [],
    });
  }).catch((err) => {
    return res.send({
      status: false,
      message: "Something Went wrong!",
      data: err,
      redirect: "",
    });
  });
};
const cost = async (req, res) => {
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    let oldData = await projectModel.findById(decryptText(encryptedId));
    oldData.costInfo = await oldData.getProject_cost_infos();
    return res.render("pages/project/cost", {
      title: "Project Cost",
      oldData,
      projectId: req.params.id,
    });
  }
  return res.status(403).send("Access forbidden ");
};
const costSave = async (req, res) => {
  const validationRule = {
    capex: "required|array",
    contigency: "required|string",
    estimate_type_and_accuracy: "required|string",
    estimated_basis: "required|string",
    sub_total: "required|array",
    total_asset_opex: "required|string",
    total_project_capex: "required|string",
    year1: "required|array",
    year2: "required|array",
    year3: "required|array",
    year4: "required|array",
    year5: "required|array",
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
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    let tempArr = [];
    req.body.capex.forEach((val, key) => {
      tempArr.push({
        project_id: decryptText(encryptedId),
        capex: val,
        year1: req.body.year1[key],
        year2: req.body.year2[key],
        year3: req.body.year3[key],
        year4: req.body.year4[key],
        year5: req.body.year5[key],
        sub_total: req.body.sub_total[key],
        total_project_capex: req.body.total_project_capex,
        estimate_type_and_accuracy: req.body.estimate_type_and_accuracy,
        estimated_basis: req.body.estimated_basis,
        contigency: req.body.contigency,
        total_asset_opex: req.body.total_asset_opex,
      });
    });
    if (await projectCostInfo.batchCreate(tempArr)) {
      return res.json({
        status: true,
        message: "Record created successfully!",
        redirect: "project-cost/" + req.params.id,
        data: [],
      });
    }
    return res.json({
      status: false,
      message: "Oops somthing went wrong!",
      redirect: "",
      data: [],
    });
  }).catch((err) => {
    return res.send({
      status: false,
      message: "Something Went wrong!",
      data: err,
      redirect: "",
    });
  });
};
const stakeHolderAndRisk = async (req, res) => {
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    let oldData = await projectModel.findById(decryptText(encryptedId));
    oldData.stakeHolders = await oldData.getProject_stakeholders_and_risks({
      where: { status: "1", type: "S" },
    });
    oldData.risks = await oldData.getProject_stakeholders_and_risks({
      where: { status: "1", type: "R" },
    });
    return res.render("pages/project/stakeholder-and-risk", {
      title: "Project Stakeholders & Risk",
      oldData,
      projectId: req.params.id,
    });
  }
  return res.status(403).send("Access forbidden ");
};
const stakeHolderAndRiskSave = async (req, res) => {
  const validationRule = {
    name: "required|string",
    stake_holder_and_risk_type: "required|string",
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
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    let recordCreated = await projectStakeholderAndRisksModel.createRecord({
      project_id: decryptText(encryptedId),
      name: req.body.name,
      stake_holder_and_risk_type: req.body.stake_holder_and_risk_type,
      type: req.body.type,
      created_by: req.session.userId,
      created_at: fullDatetimeFormat(new Date()),
    });
    if (recordCreated) {
      return res.json({
        status: true,
        message: "Record created successfully!",
        redirect: "project-stakeholder-and-risk/" + req.params.id,
        data: [],
      });
    }
    return res.json({
      status: false,
      message: "Oops somthing went wrong!",
      redirect: "",
      data: [],
    });
  }).catch((err) => {
    return res.send({
      status: false,
      message: "Something Went wrong!",
      data: err,
      redirect: "",
    });
  });
};
const dashboard = async (req, res) => {
  let encryptedId = {
    encryptedData: req.params.id.split("-")[0],
    iv: req.params.id.split("-")[1],
  };
  var inIds = 0;
  const resourceid = await sequelize.query(
    `SELECT GROUP_CONCAT(resource_ids) as ids FROM project_resources WHERE status='1' AND project_id = '${decryptText(
      encryptedId
    )}'`,
    { type: Sequelize.QueryTypes.SELECT }
  );
  if (resourceid[0]?.ids) {
    let newArr = resourceid[0]?.ids?.split(",");
    inIds = newArr?.filter((item, pos) => {
      return newArr?.indexOf(item) == pos;
    });
    inIds = inIds.join(",");
  }
  const allActiveCount = await sequelize.query(
    `SELECT (SELECT COUNT(id) FROM users WHERE id IN(${inIds})) as totalResource, 
      (SELECT ROUND((AVG(progress)*100),2) FROM project_tasks WHERE project_id='${decryptText(
        encryptedId
      )}') as totalProgress `,
    { type: Sequelize.QueryTypes.SELECT }
  );
  let projectDetails = await projectModel.findById(decryptText(encryptedId));
  return res.render("pages/project/dashoard", {
    title: "Project Dashboard",
    allActiveCount: allActiveCount[0],
    projectDetails,
  });
};
const financialManagement = async (req, res) => {
  if (req.params.id) {
    let encryptedId = {
      encryptedData: req.params.id.split("-")[0],
      iv: req.params.id.split("-")[1],
    };
    let oldData = await projectModel.findById(decryptText(encryptedId));
    let invoices = await oldData.getProject_invoices({ status: "1" });
    return res.render("pages/project/financial-management", {
      title: "Invoices",
      oldData,
      invoices,
      projectId: req.params.id,
    });
  }
};
const projectInvoiceSave = async (req, res) => {
  const validationRule = {
    invoice_name: "required|string",
    invoice_amount: "required|numeric",
    invoice_date: "required",
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
        "./public/uploads/project_invoices/",
        req.files.document
      );
      let encryptedId = {
        encryptedData: req.params.id.split("-")[0],
        iv: req.params.id.split("-")[1],
      };
      let recordCreated = await projectInvoiceModel.createRecord({
        project_id: decryptText(encryptedId),
        invoice_name: req.body.invoice_name,
        invoice_amount: req.body.invoice_amount,
        file_name: image.newfileName,
        file_original_name: image.originalFileName,
        invoice_date: req.body.invoice_date,
        created_by: req.session.userId,
        created_at: fullDatetimeFormat(new Date()),
      });
      if (recordCreated) {
        return res.json({
          status: true,
          message: "Invoice Uploaded successfully!",
          redirect: "project-financial-management/" + req.params.id,
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
const communication = async (req, res) => {
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

// *************************PROJECT SEARCHING***************************************
const projectSubType = async (req, res) => {
  try {
    let data = await projectTypeModel.dataFetch(
      { parent: req.body.id??'' },
      false,
      false,
      "name",
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
};

// *************************PROJECT TYPE********************************************

const projectTypeList = async (req, res) => {
  if (!(await menmuAccess("project-management", req.session.userId, "view"))) {
    return res.status(403).redirect("/access-forbidden");
  }

  if (req?.query?.projectTypeId) {
    let encryptedId = {
      encryptedData: req.query.projectTypeId.split("-")[0],
      iv: req.query.projectTypeId.split("-")[1],
    };
    projectTypeId = decryptText(encryptedId);
  }
  const projectTypeList = await projectTypeModel.getProjectTypeTree({
    status: { [Op.not]: "3" },
  });
  return res.render("pages/project/type/list", {
    title: req.i18n_texts.projectManagement.title.list,
    projectTypeList,
    // projectTypeId,
  });
};

const projectTypeAdd = async (req, res) => {
  if (
    !(await menmuAccess(
      "project-management",
      req.session.profileId,
      req.session.userId,
      "view"
    ))
  ) {
    return res.status(403).redirect("/access-forbidden");
  }
  let oldData = null;
  if (req?.query?.projectTypeId) {
    let encryptedId = {
      encryptedData: req.query.clientId.split("-")[0],
      iv: req.query.clientId.split("-")[1],
    };
    clientId = decryptText(encryptedId);
  }
  const projectTypeList = await projectTypeModel.dataFetch(
    { status: "1" },
    false,
    false,
    "name",
    "ASC"
  );
  return res.render("pages/project/type/add", {
    title: req.i18n_texts.projectManagement.title.list,
    projectTypeList,
    oldData,
  });
};

const projectTypecreateAndUpdate = async (req, res) => {
  const validationRule = {
    name: "required|string",
    parent: "required",
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
    var parent = "0";
    if (req.body.parent != "0") {
      let encryptedParentId = {
        encryptedData: req.body.parent.split("-")[0],
        iv: req.body.parent.split("-")[1],
      };
      parent = decryptText(encryptedParentId);
    }
    if (req.body.updateId == "") {
      let projectTypeExists = await projectTypeModel.checkExists({
        name: { [Op.like]: "%" + req.body.name + "%" },
        status: { [Op.not]: "3" },
        parent: parent,
      });
      if (projectTypeExists) {
        return res.send({
          status: false,
          message: "Project Type Already exists!",
          data: [],
          redirect: "",
        });
      }
      let projectTypeSave = await projectTypeModel.createRecord({
        name: req.body.name,
        parent: parent,
        created_at: fullDatetimeFormat(new Date()),
        created_by: req.session.userId,
      });
      if (projectTypeSave) {
        return res.send({
          status: true,
          message: "Project Type Created successfully!",
          data: [],
          redirect: "project-type-list",
        });
      } else {
        return res.send({
          status: false,
          message: "Something went wrong!",
          data: [],
          redirect: "",
        });
      }
    } else {
      let projectTypeExists = await projectTypeModel.checkExists({
        name: { [Op.like]: "%" + req.body.name + "%" },
        id: { [Op.not]: req.body.updateId },
        status: { [Op.not]: "3" },
        parent,
      });
      if (projectTypeExists) {
        return res.send({
          status: false,
          message: "Project Type Already exists!",
          data: [],
          redirect: "",
        });
      }
      let encryPtedUpdateId = {
        encryptedData: req.body.updateId.split("-")[0],
        iv: req.body.updateId.split("-")[1],
      };
      let projectTypeSave = await projectTypeModel.updateRecord(
        {
          name: req.body.name,
          updated_at: fullDatetimeFormat(new Date()),
          updated_by: req.session.userId,
        },
        { id: decryptText(encryPtedUpdateId) }
      );
      if (projectTypeSave) {
        return res.send({
          status: true,
          message: "Project Type Updated successfully!",
          data: [],
          redirect: "project-type-list",
        });
      } else {
        return res.send({
          status: false,
          message: "Something went wrong!",
          data: [],
          redirect: "",
        });
      }
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
  add,
  createAndUpdate,
  ajaxDataTable,
  projectFileDelete,
  timeTableAndSchedule,
  manageResources,
  resourceSave,
  getTeams,
  resourceUpdate,
  deleteTeam,
  fetchTask,
  saveNewTask,
  deleteTask,
  updateTask,
  addTaskLink,
  updateTaskLink,
  deleteTaskLink,
  projectDetails,
  safetyAndSecurity,
  uploadSafetyAndSecurityDocument,
  boq,
  boqSave,
  cost,
  costSave,
  stakeHolderAndRisk,
  stakeHolderAndRiskSave,
  dashboard,
  financialManagement,
  projectInvoiceSave,
  communication,
  projectTypeList,
  projectTypeAdd,
  projectTypecreateAndUpdate,
  contructCreate,
  createContruct,
  projectSubType,
};
