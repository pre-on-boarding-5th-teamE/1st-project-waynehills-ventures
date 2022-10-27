const Board = require("../services/boardService");
const app = require("../../app");
const request = require("supertest");

describe("board service test", () => {
  let app;
  beforeAll(async () => {
    app = createApp();
  });
  afterAll(async () => {});
});
