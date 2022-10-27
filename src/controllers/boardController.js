const {
  writingBoard,
  getList,
  getSearch,
  getDetailPage,
  updateBoard,
} = require("../services/boardService");
const Request = require("../middlewares/container");

//req.body 에 필요한 데이터가 있다고 가정함. 토큰이 완성되면 수정할 예정
const writing = async (req, res) => {
  await writingBoard(new Request(req));
  res.status(201).json({ message: "success" });
};

const list = async (req, res) => {
  const result = await getList(new Request(req));
  res.status(200).json(result);
};

const search = async (req, res) => {
  const result = await getSearch(new Request(req));
  res.status(200).json(result);
};

const detail = async (req, res) => {
  const result = await getDetailPage(new Request(req));
  res.status(200).json(result);
};

const rewrite = async (req, res) => {
  const result = await updateBoard(new Request(req));
  res.status(201).json(result);
};

module.exports = {
  writing,
  list,
  search,
  detail,
  rewrite,
};
