const error = require("../middlewares/errorConstructor");
const extendError = require("../middlewares/extendError");
const Board = require("../models/board");

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

module.exports = {
  writingBoard,
};
