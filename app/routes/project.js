const ProjectController = require("../controllers").Project;
const sessionMiddleware = require("../middlewares")._isLoggedIn;

module.exports = (app) => {
    app.get("/project-list", sessionMiddleware, ProjectController.index);
    app.get("/project-dashboard/:id", sessionMiddleware, ProjectController.dashboard);
    app.get("/project-next/:contructId", sessionMiddleware, ProjectController.add);
    app.get("/project-add", sessionMiddleware, ProjectController.createContruct);
    app.get("/project-edit/:id/:contructId", sessionMiddleware, ProjectController.add);
    app.get("/project-details/:id", sessionMiddleware, ProjectController.projectDetails);
    app.post("/project-create", sessionMiddleware, ProjectController.createAndUpdate);
    app.post("/project-contruct-create", sessionMiddleware, ProjectController.contructCreate);
    app.post("/project-ajax-datatable", sessionMiddleware, ProjectController.ajaxDataTable);
    app.post("/project-file-delete",sessionMiddleware, ProjectController.projectFileDelete);
    app.get("/project-time-table-and-schedule/:id",sessionMiddleware, ProjectController.timeTableAndSchedule);
    app.get("/project-resources/:id",sessionMiddleware,ProjectController.manageResources);
    app.post("/project-resource-save",sessionMiddleware,ProjectController.resourceSave);
    app.post("/project-resource-update",sessionMiddleware,ProjectController.resourceUpdate);
    app.post("/project-get-teams", sessionMiddleware, ProjectController.getTeams);
    app.post("/project-team-delete", sessionMiddleware, ProjectController.deleteTeam);
    app.get("/project-gnatt", sessionMiddleware, ProjectController.fetchTask);
    app.post("/project-gnatt/task", sessionMiddleware, ProjectController.saveNewTask);
    app.delete("/project-gnatt/task/:id", sessionMiddleware, ProjectController.deleteTask);
    app.put("/project-gnatt/task/:id", sessionMiddleware, ProjectController.updateTask);
    app.post("/project-gnatt/link", sessionMiddleware, ProjectController.addTaskLink);
    app.put("/project-gnatt/link/:id", sessionMiddleware, ProjectController.updateTaskLink);
    app.delete("/project-gnatt/link/:id", sessionMiddleware, ProjectController.deleteTaskLink);
    app.get("/project-safety-and-security/:id", sessionMiddleware, ProjectController.safetyAndSecurity);
    app.post("/upload-project-safety-and-security-document/:id", sessionMiddleware, ProjectController.uploadSafetyAndSecurityDocument);
    app.get("/project-boq/:id", sessionMiddleware, ProjectController.boq);
    app.post("/project-boq-create/:id", sessionMiddleware, ProjectController.boqSave);
    app.get("/project-cost/:id", sessionMiddleware, ProjectController.cost);
    app.post("/project-cost-create/:id", sessionMiddleware, ProjectController.costSave);
    app.get("/project-stakeholder-and-risk/:id", sessionMiddleware, ProjectController.stakeHolderAndRisk);
    app.post("/project-stakeholder-and-risk-create/:id", sessionMiddleware, ProjectController.stakeHolderAndRiskSave);
    app.get("/project-financial-management/:id", sessionMiddleware, ProjectController.financialManagement);
    app.post("/project-invoice-save/:id", sessionMiddleware, ProjectController.projectInvoiceSave);
    app.get("/project-communication/:id", sessionMiddleware, ProjectController.communication);
    app.post("/project-sub-type", sessionMiddleware, ProjectController.projectSubType);

    app.get("/project-type-list", sessionMiddleware, ProjectController.projectTypeList);
    app.get("/project-type-add", sessionMiddleware, ProjectController.projectTypeAdd);
    // app.get("/project-type-add/:id", sessionMiddleware, ProjectController.projectTypeAdd);
    app.post("/project-type-create", sessionMiddleware, ProjectController.projectTypecreateAndUpdate);

    
};