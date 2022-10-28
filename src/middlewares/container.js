const error = require("../middlewares/errorConstructor");

class Request {
  constructor(req) {
    this.data = req;
  }

  getReqBodyForWritingBoard = () => {
    const { writer_id, writed_id, name, text, board_type_id } = this.data.body;
    const result = { writer_id, writed_id, name, text, board_type_id };
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

  //로그인 과정에서 사용자의 정보가 토큰에 저장 =>
  //토큰 검증 후 해당 정보를 req.body.userInfo 에 넣는다고 가정함.
  //작업이 진행되면서 수정해야 할 수 있다.
  getUserInfo = () => {
    const { userInfo } = this.data.body;
    return userInfo;
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
