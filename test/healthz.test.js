const { app, server } = require("../index.js");
const supertest = require("supertest");
const request = supertest(app);

// add test cases
describe("/healthz", () => {
    let response;
    beforeEach(async () => {
    response = await request.get("/healthz");
  });

  it("should return a 200 status code", () => {
    expect(response.status).toBe(200);
  });

  afterEach(() => {
    server.close();
  });
});