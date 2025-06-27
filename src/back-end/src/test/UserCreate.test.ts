import request from "supertest";

// cd src/back-end
// yarn jest UserCreate.test.ts
describe("User API Tests", () => {
  const api = "http://localhost:8080";
  const userPassWord = "123456789";
  let userToken: string; // Para armazenar o token de autenticação

  test("POST /api/user", async () => {
    const response = await request(api).post("/api/user").send({
      name: "Test User",
      email: "test@example.com",
      passWord: userPassWord,
      status: "None",
    });

    console.log("Register Response:", response.body);

    expect(response.status).toBe(200); // Espera sucesso na criação do usuário
  });

  test("POST /api/user/login", async () => {
    const response = await request(api).post("/api/user/login").send({
      email: "test@example.com",
      password: userPassWord,
    });

    console.log("Login Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token"); // Espera receber um token

    userToken = response.body.token; // Armazena o token para requisições futuras
  });

  test("GET /api/user/profile", async () => {
    const response = await request(api)
      .post("/api/user/profile")
      .set("Authorization", `Bearer ${userToken}`);

    console.log("Get Profile responde: ", response.body);

    expect(response.status).toBe(200);
  });

  test("DELETE /api/user", async () => {
    const response = await request(api)
      .delete("/api/user")
      .set("Authorization", `Bearer ${userToken}`); // Passa o token no header

    console.log("Delete Response:", response.body);

    expect(response.status).toBe(200); // Espera sucesso na exclusão
  });
});
