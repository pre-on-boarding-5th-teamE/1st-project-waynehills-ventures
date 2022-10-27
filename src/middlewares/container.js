class Request {
  constructor(req) {
    this.data = req;
  }

  getReqBodyForWritingBoard = () => {
    const { writer_id, writed_id, name, text, board_type_id } = this.data.body;
    const result = { writer_id, writed_id, name, text, board_type_id };
    return result;
  };

  getPageNum = () => {
    const { pageNum } = this.data.params;
    return pageNum;
  };

  //로그인 과정에서 사용자의 정보가 토큰에 저장 =>
  //토큰 검증 후 해당 정보를 req.body.userInfo 에 넣는다고 가정함.
  //작업이 진행되면서 수정해야 할 수 있다.
  getUserInfo = () => {
    const { userInfo } = this.data.body;
    return userInfo;
  };
}
module.exports = Request;
