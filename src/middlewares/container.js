const error = require("../middlewares/errorConstructor");

class Request {
  constructor(req) {
    this.data = req;
  }

  getReqBodyForWritingBoard = () => {
    const { name, text, board_type_id } = this.data.body;
    const temp = this.getUserInfo();
    const writer_id = temp.id;
    const writed_id = writer_id;
    const result = { name, text, board_type_id, writer_id, writed_id };
    console.log(result);
    return result;
  };

  getPageNumAndType = () => {
    const { pageNum, typeId } = this.data.params;
    const result = {
      pageNum,
      typeId,
    };
    if (this.isNumber(pageNum) || this.isNumber(typeId)) {
      throw new error("invalid_key", 400);
    }
    return result;
  };

  getKeyWord = () => {
    const { keyWord } = this.data.params;
    return keyWord;
  };

  getUserInfo = () => {
    const user = this.data.user.dataValues;
    console.log("user", user);
    return user;
  };

  getBoardId = () => {
    const { boardId } = this.data.params;
    if (this.isNumber(boardId)) {
      throw new error("invalid_key", 400);
    }
    return boardId;
  };

  getUpdateContent = () => {
    const { content } = this.data.body;
    return content;
  };

  isNumber = (value) => {
    return isNaN(+value);
  };
}
module.exports = Request;
