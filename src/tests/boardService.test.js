const { Board, sequelize } = require("../models");
const { createApp } = require("../../app");
const request = require("supertest");

describe("board service test: ", () => {
  let app;
  beforeAll(async () => {
    app = createApp();
    await sequelize.sync({});
    await sequelize.query(
      "INSERT INTO grade(name) VALUES('관리자'),('매니저'),('일반회원')"
    );
    await sequelize.query("INSERT INTO gender(name) VALUES('남'),('여')");
    await sequelize.query(
      "INSERT INTO type(name) VALUES('공지사항'),('운영게시판'),('자유게시판')"
    );
    await sequelize.query(
      "INSERT INTO user(name, email, password, phone, age, kakao_id, grade_id, gender_id, platform_type_id) VALUES('a','a@gmail.com', 'password', '111',1,'kakao1',1,1,1),('b','b@gmail.com', 'password', '222',2,'kakao2',2,2,2),('c','c@gmail.com', 'password', '333',3,'kakao3',3,2,1)"
    );
  });
  afterAll(async () => {
    await sequelize.query(`SET foreign_key_checks = 0`);
    await sequelize.query(`TRUNCATE grade`);
    await sequelize.query(`TRUNCATE gender`);
    await sequelize.query(`TRUNCATE type`);
    await sequelize.query(`TRUNCATE user`);
    await sequelize.query(`SET foreign_key_checks = 1`);
    await sequelize.close();
  });

  describe("boardWriting test: ", () => {
    test("success:", async () => {
      await request(app)
        .post("/board/3")
        .send({
          writer_id: "1",
          writed_id: "1",
          name: "유우머1",
          board_type_id: 3,
          text: "유머 시리즈1",
        })
        .expect(201)
        .expect({ message: "success" });
    });
  });
});
