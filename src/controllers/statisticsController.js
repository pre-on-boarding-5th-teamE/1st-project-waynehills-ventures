const statisticsService = require("../services/statisticsService");

const getGenderStatistics = async (req, res) => {
  const genderStatistics = await statisticsService.getGenderStatistics();
  res.status(200).json({ genderStatistics });
};

const getAgeStatistics = async (req, res) => {
  const ageStatistics = await statisticsService.getAgeStatistics();
  res.status(200).json({ ageStatistics });
};

module.exports = {
  getGenderStatistics,
  getAgeStatistics,
};
