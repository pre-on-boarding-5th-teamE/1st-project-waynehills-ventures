const User = require("../models/user");
const Board = require("../models/board");

const getboardById = async (boardId) => {
  const board = await Board.findOne({
    where: {
      id: boardId,
    },
    include: {
      model: User,
      required: true,
    },
  });

  if (!board) {
    const error = new Error("NOT_FOUND");
    error.statusCode = 404;
    throw error;
  }
};

const getBoardType = (boardTypeId) => {
  if (boardTypeId === 1) return "NOTICE";
  if (boardTypeId === 2) return "OPERATION";
  if (boardTypeId === 3) return "GENERAL";
  else return undefined;
};

const getUserTypes = (user, board) => {
  let status = [];

  if (!user) status.push("NOTLOGINED");

  const userGradeId = user.grade_id;

  if (userGradeId === 1) status.push("ADMIN");
  if (userGradeId === 2) status.push("MANAGER");
  if (userGradeId === 3) status.push("GENERAL");

  if (board) {
    if (board.writer_id === null || board.writer_id === undefined) {
      status.push("DELETEUSER");
    }
    if (user.id === board.writer_id) status.push("WRITER");
  }
  return status;
};

const createAvailable = async (req, res, next) => {
  const userGradeId = req.user.grade_id;
  const boardType = getBoardType(+req.params.typeId);

  if (userGradeId === 1 && boardType === "NOTICE") return next();
  if (userGradeId <= 2 && boardType === "OPERATION") return next();
  if (userGradeId <= 3 && boardType === "GENERAL") return next();

  const error = new Error("INVALID_USER");
  error.statusCode = 403;
  throw error;
};

const readAvailable = async (req, res, next) => {
  const userType = getUserTypes(req.user, undefined);
  const boardType = getBoardType(req.params.typeId);

  if (boardType === "NOTICE" || boardType === "GENERAL") {
    next();
  }

  if (
    boardType === "OPERATION" &&
    (userType.includes("ADMIN") || userType.includes("MANAGER"))
  ) {
    next();
  }

  const error = new Error("INVALID_USER");
  error.statusCode = 403;
  throw error;
};

const updateAvailable = async (req, res, next) => {
  const boardType = getBoardType(req.params.typeId);
  const board = await getboardById(req.params.boardId);
  const userTypes = getUserTypes(req.user, board);

  if (userTypes.includes("WRITER")) next();

  if (
    boardType === "NOTICE" &&
    userTypes.includes("DELETEUSER") &&
    userTypes.includes("ADMIN")
  ) {
    next();
  }

  if (
    boardType === "OPERATION" &&
    userTypes.includes("DELETEUSER") &&
    (userTypes.includes("ADMIN") || userTypes.includes("MANAGER"))
  ) {
    next();
  }

  if (
    boardType === "GENERAL" &&
    userTypes.includes("DELETEUSER") &&
    userTypes.includes("ADMIN")
  ) {
    next();
  }

  const error = new Error("INVALID_USER");
  error.statusCode = 403;
  throw error;
};

const deleteAvailable = async (req, res, next) => {
  const board = await getboardById(req.params.boadId);
  const boardType = getBoardType(req.params.typeIs);
  const userTypes = getUserTypes(req.user, board);

  if (userTypes.includes("WRITER")) {
    next();
  }

  if (
    boardType === "NOTICE" &&
    userTypes.includes("DELETEUSER") &&
    userTypes.includes("ADMIN")
  ) {
    next();
  }

  if (
    boardType === "OPERATION" &&
    userTypes.includes("DELETEUSER") &&
    (userTypes.includes("ADMIN") || userTypes.includes("MANAGER"))
  ) {
    next();
  }

  if (
    boardType === "GENERAL" &&
    userTypes.includes("DELETEUSER") &&
    userTypes.includes("ADMIN")
  ) {
    next();
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
