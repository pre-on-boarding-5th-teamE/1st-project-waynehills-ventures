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
  const value = await Data.getPageNumAndType();
  const userInfo = await Data.getUserInfo();
  extendError.findKeyError(value.pageNum);
  extendError.findKeyError(userInfo.grade);
  const config = {
    include: {
      model: Type,
      required: true,
      attributes: ["name"],
    },
    attributes: ["id", "name"],
    offset: 4 * (value.pageNum - 1),
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

const getSearch = async (Data) => {
  const keyWord = await Data.getKeyWord();
  const userInfo = await Data.getUserInfo();
  extendError.findKeyError(keyWord);
  extendError.findKeyError(userInfo.grade);
  return await Board.findAll({
    include: {
      model: Type,
      required: true,
      attributes: ["name"],
    },
    attributes: ["name", "id"],
    where: {
      name: {
        [Op.substring]: keyWord,
      },
      text: {
        [Op.substring]: keyWord,
      },
    },
  });
};

const getDetailPage = async (Data) => {
  const boardId = await Data.getBoardId();
  extendError.findKeyError(boardId);
  return await Board.findAll({
    attributes: ["id", "name", "text", "created_at", "updated_at"],
    include: [
      {
        model: Type,
        required: true,
        attributes: ["name"],
      },
      {
        model: User,
        required: true,
        attributes: ["email"],
      },
    ],
    where: {
      id: boardId,
    },
  });
};

const updateBoard = async (Data) => {
  const boardId = await Data.getBoardId();
  const userInfo = await Data.getUserInfo();
  const content = await Data.getUpdateContent();
  console.log(boardId, userInfo, content);
  extendError.findKeyError(boardId);
  extendError.findKeyError(userInfo.userId);
  if (userInfo.userGrade !== 3) {
    return await Board.update(content, {
      where: {
        id: boardId,
      },
    });
  } else {
    return await Board.update(content, {
      where: {
        id: boardId,
        writer_id: userInfo.userId,
      },
    });
  }
};

module.exports = {
  writingBoard,
  getList,
  getSearch,
  getDetailPage,
  updateBoard,
};
