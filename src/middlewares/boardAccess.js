const User = require("../models/user");
const Board = require("../models/board");

const getboardById = async (boardId) => {
  try {
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
      error.statusCode(404);
      error.message("NOT_FOUND");
      throw error;
    }
  } catch (err) {
    res.status(err.status ? err.status : 500).json({ message: err.message });
  }
};

const getBoardType = (boardTypeId) => {
  if (boardTypeId === "1") return "NOTICE";
  if (boardTypeId === "2") return "OPERATION";
  if (boardTypeId === "3") return "GENERAL";
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
  try {
    const userGradeId = req.user.grade_id;
    const boardType = getBoardType(req.params.typeId);
    if (userGradeId === 1 && boardType === "NOTICE") return next();
    if (userGradeId <= 2 && boardType === "OPERATION") return next();
    if (userGradeId <= 3 && boardType === "GENERAL") return next();

    const error = new Error("INVALID_USER");
    error.statusCode = 403;
    error.massage = "INVALID_USER";
    throw error;
  } catch (err) {
    res.status(err.status ? err.status : 500).json({ message: err.message });
  }
};

const readAvailable = async (req, res, next) => {
  try {
    const user = req.user;
    const boardTypeId = req.params.typeId;
    const userType = getUserTypes(user, undefined);
    const boardType = getBoardType(boardTypeId);

    if (boardType === "NOTICE" || boardType === "GENERAL") {
      return next();
    }

    if (
      boardType === "OPERATION" &&
      (userType.includes("ADMIN") || userType.includes("MANAGER"))
    ) {
      return next();
    }

    const error = new Error("INVALID_USER");
    error.statusCode = 403;
    error.massage = "INVALID_USER";
    throw error;
  } catch (err) {
    res.status(err.status ? err.status : 500).json({ message: err.message });
  }
};

const updateAvailable = async (req, res, next) => {
  try {
    const boardType = getBoardType(req.params.typeId);
    const board = await getboardById(req.params.boardId);
    const userTypes = getUserTypes(req.user, board);

    if (userTypes.includes("WRITER")) return next();

    if (
      boardType === "NOTICE" &&
      userTypes.includes("DELETEUSER") &&
      userTypes.includes("ADMIN")
    ) {
      return next();
    }

    if (
      boardType === "OPERATION" &&
      userTypes.includes("DELETEUSER") &&
      (userTypes.includes("ADMIN") || userTypes.includes("MANAGER"))
    ) {
      return next();
    }

    if (
      boardType === "GENERAL" &&
      userTypes.includes("DELETEUSER") &&
      userTypes.includes("ADMIN")
    ) {
      return next();
    }
    const error = new Error("INVALID_USER");
    error.statusCode = 403;
    error.massage = "INVALID_USER";
    throw error;
  } catch (err) {
    res.status(err.status ? err.status : 500).json({ message: err.message });
  }
};

const deleteAvailable = async (req, res, next) => {
  try {
    const board = await getboardById(req.params.boadId);
    const boardType = getBoardType(req.params.typeIs);
    const userTypes = getUserTypes(req.user, board);

    if (userTypes.includes("WRITER")) {
      return next();
    }

    if (
      boardType === "NOTICE" &&
      userTypes.includes("DELETEUSER") &&
      userTypes.includes("ADMIN")
    ) {
      return next();
    }

    if (
      boardType === "OPERATION" &&
      userTypes.includes("DELETEUSER") &&
      (userTypes.includes("ADMIN") || userTypes.includes("MANAGER"))
    ) {
      return next();
    }

    if (
      boardType === "GENERAL" &&
      userTypes.includes("DELETEUSER") &&
      userTypes.includes("ADMIN")
    ) {
      return next();
    }

    const error = new Error("INVALID_USER");
    error.statusCode = 403;
    error.massage = "INVALID_USER";
    throw error;
  } catch (err) {
    res.status(err.status ? err.status : 500).json({ message: err.message });
  }
};

module.exports = {
  createAvailable,
  readAvailable,
  updateAvailable,
  deleteAvailable,
};
