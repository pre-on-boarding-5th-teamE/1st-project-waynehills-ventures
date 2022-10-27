const statisticsService = require("../services/statisticsService");

const getGenderStatistics = async (req, res) => {
  const genderStatistics = await statisticsService.getGenderStatistics();
  res.status(200).json({ genderStatistics });
};

const getAgeStatistics = async (req, res) => {
  const ageStatistics = await statisticsService.getAgeStatistics();
  res.status(200).json({ ageStatistics });
};

const getTimeStatistics = async (req, res) => {
  const timeStatistics = await statisticsService.getTimeStatistics();
  res.status(200).json({ timeStatistics });
};

module.exports = {
  getGenderStatistics,
  getAgeStatistics,
  getTimeStatistics,
};
