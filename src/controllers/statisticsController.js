const statisticsService = require("../services/statisticsService");

const getGenderStatistics = async (req, res) => {
  const genderStatistics = await statisticsService.getGenderStatistics();
  res.status(200).json({ genderStatistics });
};

module.exports = {
  getGenderStatistics,
};
