const { sequelize, Sequelize } = require("../database");

const index = async (req, res) => {
  if (req.session.profileId == 10) {
    return res.redirect("project-add");
  }
  const allActiveCount = await sequelize.query(
    "SELECT (SELECT COUNT(`id`) FROM `projects` WHERE `status` = '1') as totalProjectCount , (SELECT COUNT(`id`) FROM `users` WHERE `status` = '1' AND `profile_id` = '6' ) as totalClientCount ",
    { type: Sequelize.QueryTypes.SELECT }
  );
  return res.render("pages/dashboard", {
    title: req.i18n_texts.dashboard.title,
    allActiveCount: allActiveCount[0],
  });
};
module.exports = {
  index,
};
