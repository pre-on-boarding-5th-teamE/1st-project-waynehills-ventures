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
  const value = await Data.getPageNumAndType();
  const keyWord = await Data.getKeyWord();
  const userInfo = await Data.getUserInfo();

  extendError.findKeyError(keyWord);
  extendError.findKeyError(userInfo.grade);
  extendError.findKeyError(value.pageNum);

  const config = {
    include: {
      model: Type,
      required: true,
      attributes: ["name"],
    },
    attributes: ["name", "id"],
    offset: 4 * (value.pageNum - 1),
    limit: 4,
    where: {
      [Op.or]: [
        {
          name: {
            [Op.substring]: keyWord,
          },
        },
        {
          text: {
            [Op.substring]: keyWord,
          },
        },
      ],
    },
  };
  if (userInfo.grade !== 3) {
    return await Board.findAll({
      ...config,
    });
  } else {
    config.where = {
      [Op.or]: [
        {
          name: {
            [Op.substring]: keyWord,
          },
        },
        {
          text: {
            [Op.substring]: keyWord,
          },
        },
      ],
      board_type_id: 1,
      board_type_id: 3,
    };
    return await Board.findAll({
      ...config,
    });
  }
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

  extendError.findKeyError(boardId);
  extendError.findKeyError(userInfo.userId);

  return await Board.update(content, {
    where: {
      id: boardId,
      writer_id: userInfo.userId,
    },
  });
};

//delete 는 예외 처리를 어떻게 해야 할까? return 값이 없어서 곤란.
const deleteBoard = async (Data) => {
  const boardId = await Data.getBoardId();
  const userInfo = await Data.getUserInfo();

  if (userInfo.grade === 1) {
    return await Board.destroy({
      where: {
        id: boardId,
      },
    });
  } else if (userInfo.grade === 2) {
    return await Board.destroy({
      where: {
        id: boardId,
        [Op.or]: [
          { board_type_id: 2, writer_id: userInfo.id },
          { board_type_id: 3 },
        ],
      },
    });
  } else if (userInfo.grade === 3) {
    return await Board.destroy({
      where: {
        id: boardId,
        writer_id: userInfo.id,
        board_type_id: 3,
      },
    });
  } else {
    throw new error("invalid_grade", 400);
  }
};

module.exports = {
  writingBoard,
  getList,
  getSearch,
  getDetailPage,
  updateBoard,
  deleteBoard,
};
