const error = require("../middlewares/errorConstructor");
const extendError = require("../middlewares/extendError");
const Board = require("../models/board");
const Type = require("../models/type");
const User = require("../models/user");
const { Op } = require("sequelize");

const writingBoard = async (Data) => {
  const result = await Data.getReqBodyForWritingBoard();
  extendError.findKeyError(result);
  return await Board.create(
    {
      name: result.name,
      text: result.text,
      writer_id: result.writer_id,
      writed_id: result.writed_id,
      board_type_id: result.board_type_id,
    },
    { fields: ["name", "text", "writer_id", "writed_id", "board_type_id"] }
  );
};

const getList = async (Data) => {
  const pageNum = await Data.getPageNum();
  const userInfo = await Data.getUserInfo();
  extendError.findKeyError(pageNum);
  extendError.findKeyError(userInfo.grade);
  const config = {
    include: {
      model: Type,
      required: true,
      attributes: ["name"],
    },
    attributes: ["id", "name"],
    offset: 4 * (pageNum - 1),
    limit: 4,
  };
  if (userInfo.grade !== 3) {
    return await Board.findAll({
      ...config,
    });
  } else {
    config.where = {
      [Op.or]: [{ board_type_id: 1 }, { board_type_id: 3 }],
    };
    return await Board.findAll({
      ...config,
    });
  }
};

module.exports = {
  writingBoard,
  getList,
};
