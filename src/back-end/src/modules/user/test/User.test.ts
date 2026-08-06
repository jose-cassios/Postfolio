import request from "supertest";

// yarn jest UserCreate.test.ts -t "CREATE /api/user"
describe("User API Test", () => {
  const api = "http://localhost:8080";
  const password = "12345678";
  const email = "test@gmail.com";

  // Uso de regex para ser exato
  // yarn jest User.test.ts -t "POST /api/user create user"
  test("POST /api/user create user", async () => {
    // console.log("\nAQUI\n");
    const response = await request(api).post("/api/user").send({
      username: "Test User",
      email,
      password,
      usertype: "USER",
    });

    // console.log("Register Response:", JSON.stringify(response.body, null, 2));

    expect(response.status).toBe(201); // Espera sucesso na criação do usuário
  });

  // yarn jest UserCreate.test.ts -t "POST /api/user/login login"
  test("POST /api/user/login login", async () => {
    const response = await request(api).post("/api/user/login").send({
      email,
      password,
    });

    console.log("Login Response:", JSON.stringify(response.body, null, 2));

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token"); // Espera receber um token
    console.log("Erro: ", response.error);

    // userToken = response.body.token; // Armazena o token para requisições futuras
  });

  // yarn jest User.test.ts -t "POST /api/user/profile get profile"
  test("POST /api/user/profile get profile", async () => {
    const responseWithToken = await request(api).post("/api/user/login").send({
      email,
      password,
    });

    const token = responseWithToken.body.token;

    const response = await request(api)
      .post("/api/user/profile")
      .set("Authorization", `Bearer ${token}`);

    console.log(
      "Get Profile responde: ",
      JSON.stringify(response.body, null, 2)
    );

    expect(response.status).toBe(200);
  });

  // yarn jest User.test.ts -t "DELETE /api/user delete user"
  test("DELETE /api/user delete user", async () => {
    const responseWithToken = await request(api).post("/api/user/login").send({
      email,
      password,
    });

    const token = responseWithToken.body.token;

    const response = await request(api)
      .delete("/api/user")
      .set("Authorization", `Bearer ${token}`); // Passa o token no header

    console.log("Delete Response:", response.body);

    expect(response.status).toBe(200); // Espera sucesso na exclusão
  });
});
