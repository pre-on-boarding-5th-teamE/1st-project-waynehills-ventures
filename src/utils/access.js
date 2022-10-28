const Board = require("../models/board");

const createAvailable = async (req, boardType) => {
  const userGradeId = req.user.grade_id;

  if (userGradeId === 1 && boardType === "NOTICE") return;
  if (userGradeId <= 2 && boardType === "OPERATION") return;
  if (userGradeId <= 3 && boardType === "GENERAL") return;

  const error = new Error("INVALID_USER");
  error.statusCode = 403;
  throw error;
};

const readAvailable = async (req, boardType) => {
  const user = req.user || undefined;

  if (!user && (boardType === "NOTICE" || boardType === "GENERAL")) {
    return;
  }

  const userGradeId = toString(user.grade_id);
  const availableGroup = process.env[boardType].split(",");
  const isMatch = availableGroup.find((gradeId) => gradeId === userGradeId);

  if (!isMatch) {
    const error = new Error("INVALID_USER");
    error.statusCode = 403;
    throw error;
  }
};

const updateAvailable = async (req, boardType) => {
  const userId = req.user.id;
  const userGradeId = req.user.grade_id;
  const boardId = req.params.boardId;
  const board = await Board.findOne({ where: { id: boardId } });

  if (userId === board.writer_id) return;

  if (boardType === "NOTICE" && userGradeId === 1) return;

  if (boardType === "OPERATION" && (userGradeId === 1 || userGradeId === 2)) {
    return;
  }

  const error = new Error("INVALID_USER");
  error.statusCode = 403;
  throw error;
};

const deleteAvailable = async (req, boardType) => {
  const userId = req.user.id;
  const boardId = req.params.boardId;
  const board = await Board.findOne({ where: { id: boardId } });

  if (!board) {
    const error = new Error("NOT_FOUND");
    error.statusCode = 404;
    throw error;
  }

  if (userId === board.writer_id) return;

  if (
    (boardType === "NOTICE" || boardType === "OPERATOR") &&
    userGradeId === 1
  ) {
    return;
  }

  const error = new Error("INVALID_USER");
  error.statusCode = 403;
  throw error;
};

module.exports = {
  createAvailable,
  readAvailable,
  updateAvailable,
  deleteAvailable,
};
