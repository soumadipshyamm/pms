const sequelize = require("../database").sequelize;
const { fullDatetimeFormat,decryptText} = require("../helpers").utilities;
const stateModel = require("../models").State;
const cityModel = require("../models").City;
const tempFileModel = require("../models").tempFiles
const fileUploaderSingle  = require("../helpers").fileUploader.fileUploaderSingle;
const fs = require('fs');
const statusChange = async (req, res) => {
  if (req.body.table === "project_boqs") {
      let sql = `DELETE FROM ${req.body.table} WHERE ${req.body.keyId} = '${req.body.id}'`;
      let queryExecution = await sequelize.query(sql);
      if (queryExecution) {
        return res.json({
          status: true,
          message: "Request processed Successfully!",
          redirect: "",
          postStatus: req.body.status,
        });
      }
      return res.json({
        status: false,
        message: "Oops somthing went wrong!",
        redirect: "",
        postStatus: req.body.status,
      });
  }
  if (req.body.table === "project_invoices") {
    let sql = `DELETE FROM ${req.body.table} WHERE ${req.body.keyId} = '${req.body.id}'`;
    let queryExecution = await sequelize.query(sql);
    if (queryExecution) {
      return res.json({
        status: true,
        message: "Request processed Successfully!",
        redirect: "",
        postStatus: req.body.status,
      });
    }
    return res.json({
      status: false,
      message: "Oops somthing went wrong!",
      redirect: "",
      postStatus: req.body.status,
    });
  }
  let encryptedId = {
    encryptedData: req.body.id.split("-")[0],
    iv: req.body.id.split("-")[1],
  };
  let sql = `UPDATE ${req.body.table} SET status = '${req.body.status}',`;
  if (req.body.status==='3'){
    sql += ` deleted_at='${fullDatetimeFormat(new Date())}', deleted_by = '${req.session.userId}'`;
  }else{
    sql += ` updated_at='${fullDatetimeFormat(new Date())}', updated_by = '${req.session.userId}'`;
  }
  sql += ` WHERE ${req.body.keyId} = '${decryptText(encryptedId)}'`;
  let queryExecution = await sequelize.query(sql);
  if(queryExecution){
    return res.json({
      status    : true,
      message   : 'Request processed Successfully!',
      redirect  : '',
      postStatus: req.body.status
    });
  }
  return res.json({
    status: false,
    message: "Oops somthing went wrong!",
    redirect: "",
    postStatus: req.body.status,
  });
};
const getStates = async (req,res)=>{
    try {
      let data = await stateModel.getStateByCountryId(req.body.countryId);
      if(data){
         return res.json({
          status    : true,
          message   : 'Request processed Successfully!',
          redirect  : '',
          data:data
        });
      }
      return res.json({
        status    : false,
        message   : 'No Data Found!',
        redirect  : '',
        data:[]
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Oops somthing went wrong!",
        redirect: "",
        data:[]
      });
    }
}
const getCites = async (req,res) => {
    try {
      let data = await cityModel.getCityByStateId(req.body.stateId);
      if(data){
         return res.json({
          status    : true,
          message   : 'Request processed Successfully!',
          redirect  : '',
          data:data
        });
      }
      return res.json({
        status    : false,
        message   : 'No Data Found!',
        redirect  : '',
        data:[]
      });
    } catch (error) {
      return res.json({
        status: false,
        message: "Oops somthing went wrong!",
        redirect: "",
        data:[]
      });
    }
};
const uploadTempFiles = async (req,res)=>{
    if(req.files.document){
      let image = await fileUploaderSingle("./public/uploads/project_documents/", req.files.document);
      const recordCreated = tempFileModel.createRecord({
        cookie_id: req.cookies["connect.sid"].split("s:")[1],
        document_name: req.body.document_name,
        file: image.newfileName,
        file_original_name: image.originalFileName,
        event: req.body.event,
        reference: req.body.reference,
      });
      if (recordCreated){
         return res.json({
           status: true,
           message: "File Uploaded successfully!",
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
    }
    return res.json({
      status: false,
      message: "No file is present in the request",
      redirect: "",
      data: [],
    });
};
const fetchTempFiles = async (req, res) => {
 
  const data = await tempFileModel.fetchAllWithCondition({
    cookie_id: req.cookies["connect.sid"].split("s:")[1],
    event: req.body.event,
    reference: req.body.reference,
  });
  if(data){
     return res.json({
       status: true,
       message: "Data available!",
       redirect: "",
       data: data,
     });
  }
   return res.json({
     status: false,
     message: "No Data available!",
     redirect: "",
     data: [],
   });
};
const deleteTempFiles = async (req, res) => {
  const existingData =  await tempFileModel.findById(req.body.id)
  if (existingData) {
      fs.unlink(`./public/uploads/project_documents/${existingData.file}`, function (err) {
        if (err) return console.log(err);
        console.log("file deleted successfully");
      });  
  }
  const deleted = await tempFileModel.permaDelete({
    id:req.body.id,
    cookie_id: req.cookies["connect.sid"].split("s:")[1]
  })
  if(deleted){
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
const clearTempFiles = async (req, res) => {
  try {
     const data = await tempFileModel.fetchAllWithCondition({
       cookie_id: req.cookies["connect.sid"].split("s:")[1],
       event: req.body.event,
       reference: req.body.reference,
     });

     if (data) {
       for (let [key, val] of Object.entries(data)) {
         fs.unlink(
           `./public/uploads/project_documents/${val.file}`,
           function (err) {
             if (err) return console.log(err);
             console.log("file deleted successfully");
           }
         );
         await tempFileModel.permaDelete({
           id: val.id,
         });
       }
        return res.json({
          status: true,
          message: "Deleted Successfully!",
          redirect: "",
          data: [],
        });
     }
    
  } catch (err) {
     return res.json({
       status: false,
       message: "Oops somthing went wrong!",
       redirect: "",
       data: [],
     });
  }
};
module.exports = {
  statusChange,
  getStates,
  getCites,
  uploadTempFiles,
  fetchTempFiles,
  deleteTempFiles,
  clearTempFiles,
};
