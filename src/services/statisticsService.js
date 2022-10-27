const { User, UserAccess } = require("../models");
const { Op } = require("sequelize");

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

const getAgeStatistics = async () => {
  const totalUserCount = await User.count({});
  const underTeensUserCount = await User.count({
    where: {
      age: {
        [Op.lt]: 20,
      },
    },
  });
  const twentiesUserCount = await User.count({
    where: {
      age: {
        [Op.between]: [20, 29],
      },
    },
  });
  const thirtiesUserCount = await User.count({
    where: {
      age: {
        [Op.between]: [30, 39],
      },
    },
  });
  const fortiesUserCount = await User.count({
    where: {
      age: {
        [Op.between]: [40, 49],
      },
    },
  });
  const fiftyUserCount = await User.count({
    where: {
      age: {
        [Op.between]: [50, 59],
      },
    },
  });
  const overSixtiesUserCount = await User.count({
    where: {
      age: {
        [Op.gte]: 60,
      },
    },
  });
  const underTeensPercent = Number(
    ((underTeensUserCount / totalUserCount) * 100).toFixed(2)
  );
  const twentiesPercent = Number(
    ((twentiesUserCount / totalUserCount) * 100).toFixed(2)
  );
  const thirtiesPercent = Number(
    ((thirtiesUserCount / totalUserCount) * 100).toFixed(2)
  );
  const fortiesPercent = Number(
    ((fortiesUserCount / totalUserCount) * 100).toFixed(2)
  );
  const fiftyPercent = Number(
    ((fiftyUserCount / totalUserCount) * 100).toFixed(2)
  );
  const overSixtiesPercent = Number(
    ((overSixtiesUserCount / totalUserCount) * 100).toFixed(2)
  );
  const ageStatistics = {};
  ageStatistics["totalUserCount"] = totalUserCount;
  ageStatistics["underTeensUserCount"] = underTeensUserCount;
  ageStatistics["twentiesUserCount"] = twentiesUserCount;
  ageStatistics["thirtiesUserCount"] = thirtiesUserCount;
  ageStatistics["fortiesUserCount"] = fortiesUserCount;
  ageStatistics["fiftyUserCount"] = fiftyUserCount;
  ageStatistics["overSixtiesUserCount"] = overSixtiesUserCount;
  ageStatistics["underTeensPercent"] = underTeensPercent;
  ageStatistics["twentiesPercent"] = twentiesPercent;
  ageStatistics["thirtiesPercent"] = thirtiesPercent;
  ageStatistics["fortiesPercent"] = fortiesPercent;
  ageStatistics["fiftyPercent"] = fiftyPercent;
  ageStatistics["overSixtiesPercent"] = overSixtiesPercent;
  return ageStatistics;
};

const getTimeStatistics = async () => {};

module.exports = {
  getGenderStatistics,
  getAgeStatistics,
  getTimeStatistics,
};
