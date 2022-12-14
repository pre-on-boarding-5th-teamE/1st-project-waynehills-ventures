const express = require("express");
const statisticsController = require("../controllers/statisticsController");
const errorHandler = require("../middlewares/errorHandler");

const router = express.Router();

router.get("/gender", errorHandler(statisticsController.getGenderStatistics));

router.get("/age", errorHandler(statisticsController.getAgeStatistics));

router.get("/time", errorHandler(statisticsController.getTimeStatistics));

module.exports = {
  router,
};
