---
version: 1.0.0
---
# Tutorial
**Versão:** 1.0.0
Está seção trata do tutorial para fazer a api ser executada. De prefencia, tenho o gerenciador de pacotes **yarn** instalado em sua maquina, caso não tenha, pode prosseguir com **npm.** Os seguintes comandos serão feitos em **yarn.** 

1. Nague ou abra o terminal do diretorio back-end do projeto.
```bash
cd src/back-end
```

2. Execute a instalação das dependencias.
```bash
yarn add
```
3. O banco escolhido para o projeto foi o MongoDB, caso queria outro banco, basta fazer as alterações necessarias no arquivo schama.prisma dentro de da pasta prisma.
```bash
# MongoDB (Formato padrão)
DATABASE_URL="mongodb://usuario:senha@localhost:27017/nome_do_banco?authSource=admin"

# Ou (para clusters na nuvem, como MongoDB Atlas)
DATABASE_URL="mongodb+srv://usuario:senha@cluster0.exemplo.mongodb.net/nome_do_banco?retryWrites=true&w=majority"
```

4. Gere os modelos do banco de dados.
```bash
yarn prisma generate
yarn prisma db push 
```

5. Basta executar que já deve estar rodando.
```bash
yarn run dev
```
# Documentação da api

A api foi desenvolvida para ser usada como backend do projeto Postfolio.

## Índice
- [0. Sobre app.ts](#0-sobre-appts)
- [1. Endpoints](#1-endpoints)
- [2. Arquitetura](#2-arquitetura)
  - [2.1 Descrição da Arquitetura](#21-descrição-da-arquitetura)
  - [2.2 Estrutura de Pastas](#22-estrutura-de-pastas)
- [3. Código e Propósitos](#3-código-e-propósitos)
- [4. Conclusão](#4-conclusão)

---

## 0. Sobre app.ts

O arquivo app.ts é a porta de entrada para a execução da api.
É nele onde o servidor é inicializado:
```ts
import Fastify from "fastify";
const app = Fastify();
const PORT = 8080;
```
Onde é CORS é configurado:
```ts
app.register(fastifyCors, {
  origin: true, // Permite todas as fontes
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
});
```
Registro de rotas:
```ts
app.register(UserRoutes, { prefix: "api/user" }); // Gerenciamento de usuários
app.register(PortfolioRoute, { prefix: "api/portfolio" }); // Operações de portfólio
app.register(RatingRoute, { prefix: "api/rating" }); // Avaliações e feedback
```
E onde é vervidor é executado:
```ts
const start = async () => {
  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
```

## 1. Endpoints

A seguir, estudaremos cada end-point, seus cabeçalhos, corpos e respostas.
Segiu o local onde todos os end-poins estão sendo registrados pelo *app*

```shell
📦 back-end/
├── 📁 src/
│   └── 📁 adapters/
│       └── 📁 inBound/
│           ├── 📁 controllers/
|           ├── 📁 middleware/
|           └── 📁 routes/
|               ├── PortfolioRoute.ts
|               ├── RatingRoute.ts
|               └── UserRoute.ts
....
```
obs: Estudaremos mais sobre a arquitetura e estrutura de pastas do projeto no tópico [2. Arquitetura](#2-arquitetura)

### users

**- POST /api/user**

Descrição: Cria um novo usuário no sistema.
Autenticação: Não requerida.
Content-Type: application/json.

request:
```json
{
    "name": "test", // nome do user.
    "email": "test@gmail.com", // email valido e único.
    "password": "123456789", // senha de pelo menos 8 digitos
    "status": "None" // Ainda não disponivel na atual verção.
}
```
response (`201`):
```json
{
    "msg": "Usuario criado com sucesso!"
}
```
| Código HTTP | Resposta (JSON) | 
|:-------------:|:-----------------:|
| 400         | {"message": "Todos os campos são obrigatórios!"} | 
| 400         | {"message": "Senha muito fraca!"} |
| 400         | {"message": "Email inválido!"} |
| 400         | {"message": "Por favor, use outro email!"} |


**- POST /api/user/login**

Descrição: Faz o login de um usuario no sistema.
Autenticação: Não requerida.
Content-Type: application/json.

request:
```json
{
    "email": "test@gmail.com",
    "password": "123456789"
}
```
response:
```json
{ 
    "msg": "Login bem-sucedido!", 
    "token": "alsnfqoboiqroho8hf0h3ub1oius7dg9qeboh0HhOH0HH89H1R" // token_jwt
}
```
| Código HTTP | Resposta (JSON) | 
|:-------------:|:-----------------:|
| 400         | {"message": "O email é obrigatório!"} | 
| 400         | {"message": "A senha é obrigatória!"} |
| 400         | {"message": "Email inválido!"} |
| 404         | {"message": "Usuário não encontrado!"} |
| 401         | {"message": "Senha incorreta!"} |

## 2. Arquitetura

### 2.1 Descrição da Arquitetura

### 2.2 Estrutura de Pastas

## 3. Código e Propósitos

## 4. Conclusão