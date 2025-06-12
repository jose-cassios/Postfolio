import request from "supertest";

// cd src/back-end
// yarn jest PortfolioCreate.test.ts
describe("Portfolio API Tests", () => {
  const api = "http://localhost:8080";
  const userPassWord = "123456789";
  let portfolioId: string;
  const email = "antonio@gmail.com";
  let userToken: string;

  // test("POST /api/")

  test("POST /api/user/login", async () => {
    const response = await request(api).post("/api/user/login").send({
      email: email,
      passWord: userPassWord,
    });

    console.log("Login Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token"); // Espera receber um token

    userToken = response.body.token; // Armazena o token para requisições futuras
  });

  test("POST api/portfolio", async () => {
    const response = await request(api)
      .post("/api/portfolio")
      .send({
        name: "test - post",
        description: "desc test",
        pageLink: "http://test",
      })
      .set("Authorization", `Bearer ${userToken}`);

    console.log("Responde body: ", response.body);
    portfolioId = response.body.id;

    expect(response.status).toBe(200);
  });

  test("DELETE api/portfolio", async () => {
    const response = await request(api)
      .delete(`/api/portfolio/${portfolioId}`)
      .set("Authorization", `Bearer ${userToken}`);

    console.log("Responde body: ", response.body);
    expect(response.status).toBe(200);
  });
});
