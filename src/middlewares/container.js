class Request {
  constructor(req) {
    this.data = req;
  }
  getReqBodyForWritingBoard = () => {
    const { writer_id, writed_id, name, text, board_type_id } = this.data.body;
    const result = { writer_id, writed_id, name, text, board_type_id };
    return result;
  };
}
module.exports = Request;
