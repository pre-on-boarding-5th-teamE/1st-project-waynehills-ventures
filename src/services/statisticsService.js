const { User } = require("../models");

const getGenderStatistics = async () => {
  const totalUserCount = await User.count({});
  const menUserCount = await User.count({
    where: { gender_id: 1 },
  });
  const womenUserCount = await User.count({
    where: { gender_id: 2 },
  });
  const menPercent = Number(((menUserCount / totalUserCount) * 100).toFixed(2));
  const womenPercent = Number(
    ((womenUserCount / totalUserCount) * 100).toFixed(2)
  );
  const genderStatistics = {};
  genderStatistics["totalUserCount"] = totalUserCount;
  genderStatistics["menUserCount"] = menUserCount;
  genderStatistics["womenUserCount"] = womenUserCount;
  genderStatistics["menPercent"] = menPercent;
  genderStatistics["womenPercent"] = womenPercent;
  return genderStatistics;
};

module.exports = {
  getGenderStatistics,
};
