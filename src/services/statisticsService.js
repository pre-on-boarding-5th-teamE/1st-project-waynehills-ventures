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
  const menPercent = ((menUserCount / totalUserCount) * 100).toFixed(2);
  const womenPercent = ((womenUserCount / totalUserCount) * 100).toFixed(2);

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
  const underTeensPercent = (
    (underTeensUserCount / totalUserCount) *
    100
  ).toFixed(2);

  const twentiesPercent = ((twentiesUserCount / totalUserCount) * 100).toFixed(
    2
  );

  const thirtiesPercent = ((thirtiesUserCount / totalUserCount) * 100).toFixed(
    2
  );

  const fortiesPercent = ((fortiesUserCount / totalUserCount) * 100).toFixed(2);

  const fiftyPercent = ((fiftyUserCount / totalUserCount) * 100).toFixed(2);

  const overSixtiesPercent = (
    (overSixtiesUserCount / totalUserCount) *
    100
  ).toFixed(2);

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

const getTimeStatistics = async () => {
  const totalAccessUserCount = await UserAccess.count({});
  const today = new Date().getTime();
  const lastTimeList = await UserAccess.findAll({
    attributes: ["last_time"],
    raw: true,
  });
  let sumDay = 0;
  lastTimeList.forEach((element) => {
    sumDay += Math.ceil(
      (today - element.last_time.getTime()) / (1000 * 60 * 60 * 24)
    );
  });
  const avgLastAccessDay = (sumDay / lastTimeList.length).toFixed(2);
  const timeStatistics = {};
  timeStatistics["totalAccessUserCount"] = totalAccessUserCount;
  timeStatistics["avgLastAccessDay"] = avgLastAccessDay;
  return timeStatistics;
};

module.exports = {
  getGenderStatistics,
  getAgeStatistics,
  getTimeStatistics,
};
