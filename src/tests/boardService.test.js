const { Board, sequelize } = require("../models");
const { createApp } = require("../../app");
const request = require("supertest");

//테스트 코드에 사용중인 토큰은 (auth) 기한이 9일이다.

describe("board service test: ", () => {
  let app;
  const auth = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY2OTU2OTA5LCJleHAiOjE2Njc3MzQ1MDl9.bcQwXVQJwFVveH2a5A8T9VEtDK6qd7vssPfC-ra5Dgg`;
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
      `INSERT INTO 
      user(name, email, password, phone, age, grade_id, gender_id, platform_type_id) 
      VALUES('a','a@gmail.com', 'password', '111',1,1,1,1),
      ('b','b@gmail.com', 'password', '222',2,2,2,2),
      ('c','c@gmail.com', 'password', '333',3,3,2,1)`
    );
    await sequelize.query(
      `
        INSERT INTO board
        (name,text,board_type_id, writed_id, writer_id)
        VALUES("first", "arrrr...",1,1,1),
        ("second", "brrrr...", 2,2,2),
        ("third", "crrrr...", 3,3,3),
        ("fourth", "drrrr...", 1,1,1),
        ("fifth", "errrr...", 2,2,2)
        `
    );
  });
  afterAll(async () => {
    await sequelize.query(`SET foreign_key_checks = 0`);
    await sequelize.query(`TRUNCATE grade`);
    await sequelize.query(`TRUNCATE gender`);
    await sequelize.query(`TRUNCATE type`);
    await sequelize.query(`TRUNCATE user`);
    await sequelize.query(`TRUNCATE board`);
    await sequelize.query(`SET foreign_key_checks = 1`);
    await sequelize.close();
  });

  describe("boardWriting test: ", () => {
    test.only("success:", async () => {
      await request(app)
        .post("/board/3")
        .set({ Authorization: auth })
        .send({
          name: "유우머1",
          board_type_id: 3,
          text: "유머 시리즈1",
        })
        .expect(201)
        .expect({ message: "success" })
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
    });

    test("success:", async () => {
      await request(app)
        .post("/board/1")
        .set({ Authorization: auth })
        .send({
          name: "공지사항",
          board_type_id: 1,
          text: "공지...",
        })
        .expect(201)
        .expect({ message: "success" });
    });

    test("success:", async () => {
      await request(app)
        .post("/board/2")
        .set({ Authorization: auth })
        .send({
          name: "공지사항",
          board_type_id: 1,
          text: "공지...",
        })
        .expect(201)
        .expect({ message: "success" });
    });

    test("falied:", async () => {
      await request(app)
        .post("/board/3")
        .set({ Authorization: auth })
        .send({
          writer_id: "",
          writed_id: "1",
          name: "유우머1",
          board_type_id: 3,
          text: "유머 시리즈1",
        })
        .expect(400)
        .expect({ message: "key_error" });
    });

    test("falied:", async () => {
      await request(app)
        .post("/board/3")
        .set({ Authorization: auth })
        .send({
          name: "유우머1",
          board_type_id: 3,
          text: "",
        })
        .expect(400)
        .expect({ message: "key_error" });
    });
  });

  describe("getList test: ", () => {
    test("success: ", async () => {
      const response = await request(app)
        .get("/board/page/1/1")
        .set({ Authorization: auth })
        .send({
          user: {
            grade_id: 1,
          },
        });
      expect(response.status).toEqual(200);
      expect(response.body.length).toBe(4);
    });

    //선행 테스트인 boardWriting 에 의존하고 있다. POST 테스트 결과
    //board 테이블에 글이 생성되는데, 이 값에 따라 본 테스트의 결과값이 달라질 수 있다.
    test("success", async () => {
      const response = await request(app)
        .get("/board/page/1/2")
        .set({ Authorization: auth })
        .send({ user: { grade_id: 3 } });
      expect(response.body.length).toBe(2);
    });

    test("failed, 잘못된 url", async () => {
      await request(app)
        .get("/board/page/")
        .set({ authorization: auth })
        .send({ user: { grade_id: 3 } })
        .expect(404);
    });

    test("failed, pageNum 잘못된 값", async () => {
      await request(app)
        .get("/board/page/1/lll")
        .set({ Authorization: auth })
        .send({ user: { grade_id: 3 } })
        .expect(400)
        .expect({ message: "invalid_key" });
    });
  });

  describe("getSearch test: ", () => {
    test("success", async () => {
      const response = await request(app)
        .get("/board/search/1/first/1")
        .set({ Authorization: auth })
        .send({ user: { grade_id: 1 } });
      expect(response.status).toEqual(200);
      expect(response.body.length).toBe(1);
    });

    test("success: 일반회원은 운영게시글을 조회 못함", async () => {
      const response = await request(app)
        .get("/board/search/1/second/1")
        .set({ Authorization: auth })
        .send({ user: { grade_id: 3 } });
      expect(response.status).toEqual(200);
      expect(response.body.length).toBe(0);
    });

    test("success: 찾은 게시글이 작성된 게시글과 일치하는지 테스트", async () => {
      const response = await request(app)
        .get("/board/search/1/third/1")
        .set({ authorization: auth })
        .send({ user: { grade_id: 1 } });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        { name: "third", id: 3, Type: { name: "자유게시판" } },
      ]);
    });

    test("failed: 잘못된 url", async () => {
      await request(app)
        .get("/board/search/1/t")
        .set({ authorization: auth })
        .send({ user: { grade_id: 1 } })
        .expect(404);
    });

    test("failed: pageNum 가 숫자 아님", async () => {
      await request(app)
        .get("/board/search/1/third/what?")
        .set({ authorization: auth })
        .send({ user: { grade_id: 1 } })
        .expect(400)
        .expect({ message: "invalid_key" });
    });

    test("failed: typeId 가 숫자 아님", async () => {
      await request(app)
        .get("/board/search/wh/third/1")
        .set({ authorization: auth })
        .send({ user: { grade_id: 1 } })
        .expect(400)
        .expect({ message: "invalid_key" });
    });
  });

  describe("getDetailPage test:", () => {
    //boardService: getDetailPage 에서 findAll 에 paranoid:false 를 추가해줘야 오류가 나지 않는다.
    //오류가 나는 원인은 join 시 칼럼 deleted_at 을 불러올 수 없어서 그런듯 하다.
    //위의 설정을 하면 불러올 수 있다.
    //created_at 은 테스트 할때 주의 해야 한다. 테스트 마다 새로 만들기 때문에
    //시간이 계속 달라진다. 따라서 테스트 하려면 시간을 넓은 범위로 잡아야 한다.
    //예를 들어 분, 초 단위는 없애는게 좋다.
    test("success: 특정 게시물의 디테일이 같은지 테스트", async () => {
      const response = await request(app)
        .get("/board/detail/1/1")
        .set({ authorization: auth })
        .send({ user: { grade_id: 1 } });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        {
          id: 1,
          name: "first",
          text: "arrrr...",
          Type: { name: "공지사항" },
          User: { email: "a@gmail.com" },
        },
      ]);
    });

    test("failed: url 이 틀렸을때", async () => {
      const response = await request(app)
        .get("/board/detai")
        .set({ authorization: auth })
        .send({ user: { grade_id: 1 } });
      expect(response.status).toEqual(404);
    });

    test("failed: pageNum 숫자가 아닐때", async () => {
      await request(app)
        .get("/board/detail/1/hhh")
        .set({ Authorization: auth })
        .send({ user: { grade_id: 1 } })
        .expect(400)
        .expect({ message: "invalid_key" });
    });

    test("failed: 없는 게시물", async () => {
      await request(app)
        .get("/board/detail/1/1000")
        .set({ Authorization: auth })
        .send({ user: { grade_id: 1 } })
        .expect(400)
        .expect({ message: "key_error" });
    });
  });

  //   describe("updateBoard test: ", () => {
  //     test("success: 업데이트 성공", () => {});
  //   });
});
