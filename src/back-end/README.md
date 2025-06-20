# Documentação do Backend - Postfolio

## 📖 Visão Geral do Backend

Este documento detalha a arquitetura, funcionalidades e configuração do backend do projeto Postfolio. O backend é responsável por gerenciar a lógica de negócios, interações com o banco de dados, autenticação de usuários e fornecer a API para o frontend.

Principais tecnologias utilizadas:
- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Fastify**: Framework web de alta performance para Node.js, usado para construir a API.
- **Prisma**: ORM (Object-Relational Mapper) para interagir com o banco de dados MongoDB de forma type-safe.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática, melhorando a robustez e manutenibilidade do código.
- **MongoDB**: Banco de dados NoSQL orientado a documentos, utilizado para persistir os dados da aplicação.
- **JSON Web Tokens (JWT)**: Para autenticação e autorização baseada em tokens.
- **Bcrypt**: Para hashing seguro de senhas.

## 🏗️ Estrutura do Projeto Backend

O backend segue uma arquitetura em camadas, inspirada em princípios como a Arquitetura Hexagonal (Ports and Adapters), para promover desacoplamento e testabilidade. A estrutura principal do código dentro de `src/` é organizada da seguinte forma:

-   **`adapters/`**: Contém os adaptadores que fazem a ponte entre a lógica da aplicação e o mundo exterior.
    -   **`InBound/`**: Lida com as interações de entrada (ex: requisições HTTP).
        -   **`Controller/`**: Responsável por receber as requisições da API, validar dados de entrada (geralmente com a ajuda de DTOs ou validações de schema), e chamar os serviços da camada de aplicação.
        -   **`Middleware/`**: Funções que interceptam as requisições antes de chegarem aos controllers, usadas para tarefas como autenticação (`AuthMiddleware.ts`), logging, etc.
        -   **`Routes/`**: Define os endpoints da API, mapeando URLs e métodos HTTP para os respectivos métodos dos controllers.
    -   **`OutBound/`**: Lida com as interações de saída (ex: acesso ao banco de dados, comunicação com serviços externos).
        -   **`Repository/`**: Implementações concretas dos repositórios que interagem com o banco de dados (Prisma Client). Abstraem a lógica de acesso a dados.
        -   **`models/`**: Pode conter modelos específicos para a camada de persistência ou DTOs de saída, se diferentes das entidades de domínio.

-   **`application/`**: Contém a lógica de negócios central da aplicação.
    -   **`service/`**: Implementações dos casos de uso (use cases) ou serviços da aplicação. Orquestram as interações entre o domínio e os repositórios.
    -   **`usecases/`**: Interfaces ou classes abstratas que definem os contratos para os serviços/casos de uso, promovendo a inversão de dependência.

-   **`domain/`**: O coração da aplicação, contendo as entidades de negócio e regras de domínio.
    -   **`Entities/`**: Representações dos objetos de negócio principais (ex: User, Portfolio, Rating).
    -   **`ValueObject/`**: Objetos imutáveis que representam conceitos do domínio (ex: Email).

-   **`infrastructure/`**: Componentes de infraestrutura e configurações.
    -   **`@types/`**: Definições de tipos customizadas para TypeScript.
    -   **`config/`**: Configurações da aplicação, como a inicialização do Prisma (`prisma.ts`).
    -   **`error/`**: Classes de erro customizadas para tratamento de exceções (ex: `HttpError.ts`).

-   **`test/`**: Arquivos de teste (unitários, integração).

-   **`util/`**: Funções e classes utilitárias genéricas (ex: `Crypto.ts` para criptografia, `Token.ts` para JWT, `Uuid.ts`, `mapper.ts` para mapeamento de objetos).

-   **`app.ts`**: Ponto de entrada da aplicação backend. Configura e inicia o servidor Fastify, registra plugins (como CORS) e as rotas principais da API.

Esta estrutura visa separar as responsabilidades, facilitando a manutenção, evolução e teste do sistema.

## 📊 Modelo de Dados (Prisma Schema)

O modelo de dados da aplicação é definido no arquivo `prisma/schema.prisma` e utiliza o Prisma como ORM para interagir com um banco de dados MongoDB. Abaixo estão os principais modelos e seus relacionamentos:

### Banco de Dados
- **Provedor**: MongoDB

### Modelos Principais

#### 1. `User`
   - Mapeado para a coleção: `tb_user`
   - **Campos**:
     - `id`: `String` (Chave primária, ObjectId do MongoDB, auto-gerado) - Identificador único do usuário.
     - `name`: `String` - Nome do usuário.
     - `email`: `String` (Único) - Endereço de e-mail do usuário, usado para login.
     - `passWord`: `String` - Senha do usuário (armazenada como hash).
     - `status`: `String` - Status da conta do usuário (ex: "active", "pending", "inactive").
   - **Relacionamentos**:
     - `portfolios`: Lista de `Portfolio` (Um usuário pode ter múltiplos portfólios).
     - `ratings`: Lista de `Rating` (Um usuário pode fazer múltiplas avaliações).

#### 2. `Portfolio`
   - Mapeado para a coleção: `tb_portfolio`
   - **Campos**:
     - `id`: `String` (Chave primária, ObjectId do MongoDB, auto-gerado) - Identificador único do portfólio.
     - `name`: `String` - Nome ou título do portfólio/projeto.
     - `description`: `String` - Descrição detalhada do portfólio.
     - `pageLink`: `String` - Link para a página do projeto ou portfólio online.
     - `authorId`: `String` (Chave estrangeira para `User.id`) - ID do usuário autor do portfólio.
   - **Relacionamentos**:
     - `author`: `User` (Um portfólio pertence a um único usuário).
       - `onDelete: Cascade`: Se um `User` for deletado, seus `Portfolio` associados também serão deletados.
     - `ratings`: Lista de `Rating` (Um portfólio pode ter múltiplas avaliações).

#### 3. `Rating`
   - Mapeado para a coleção: `tb_rating`
   - **Campos**:
     - `id`: `String` (Chave primária, ObjectId do MongoDB, auto-gerado) - Identificador único da avaliação.
     - `userId`: `String` (Chave estrangeira para `User.id`) - ID do usuário que fez a avaliação.
     - `portfolioId`: `String` (Chave estrangeira para `Portfolio.id`) - ID do portfólio que foi avaliado.
     - `score`: `Float` - A pontuação numérica da avaliação (ex: de 1.0 a 5.0).
   - **Relacionamentos**:
     - `user`: `User` (Uma avaliação é feita por um único usuário).
       - `onDelete: Cascade`: Se um `User` for deletado, suas `Rating` associadas também serão deletadas.
     - `portfolio`: `Portfolio` (Uma avaliação pertence a um único portfólio).
       - `onDelete: Cascade`: Se um `Portfolio` for deletado, suas `Rating` associadas também serão deletadas.

### Observações sobre o Schema:
- **Chaves Primárias**: Todas as chaves primárias (`id`) são do tipo `String` e mapeadas para o `_id` do MongoDB, utilizando `@db.ObjectId`.
- **Exclusão em Cascata**: As relações foram configuradas com `onDelete: Cascade`, o que significa que a exclusão de um registro pai (ex: um `User`) resultará na exclusão automática dos registros filhos relacionados (ex: `Portfolio` e `Rating` desse usuário).
- A definição de um ID composto `@@id([userId, portfolioId])` para o modelo `Rating` está comentada no schema original, o que significa que, pela estrutura atual do banco, um usuário poderia, teoricamente, avaliar o mesmo portfólio múltiplas vezes. A lógica de negócios na aplicação pode impor restrições adicionais.

## Endpoints da API

A API do backend é construída com Fastify e organiza os endpoints por recurso. Todos os endpoints são prefixados com `/api`.

### Autenticação
A maioria dos endpoints que envolvem dados do usuário ou criação/modificação de recursos são protegidos e requerem um token JWT Bearer no header `Authorization`. O middleware `UserMiddle.authenticate` é responsável por essa verificação.

---

### UserController (`/api/user`)

| Método | Rota          | Descrição                                       | Autenticação |
|--------|---------------|-------------------------------------------------|----------------|
| `POST` | `/`           | Registra um novo usuário.                       | Não            |
| `POST` | `/all`        | Busca todos os usuários.                        | Não            |
| `POST` | `/login`      | Autentica um usuário e retorna um token JWT.    | Não            |
| `POST` | `/profile`    | Busca o perfil do usuário autenticado.          | Sim            |
| `POST` | `/portfolios` | Busca os portfólios do usuário autenticado.     | Sim            |
| `POST` | `/ratings`    | Busca as avaliações feitas pelo usuário autenticado. | Sim            |
| `DELETE`| `/`           | Deleta a conta do usuário autenticado.          | Sim            |

**Observação sobre `/all`**: Embora use `POST`, esta rota é para buscar dados. Em APIs RESTful, `GET` é mais convencional para listagens.

---

### PortfolioController (`/api/portfolio`)

| Método | Rota      | Descrição                                          | Autenticação |
|--------|-----------|----------------------------------------------------|----------------|
| `POST` | `/all`    | Busca todos os portfólios.                         | Não            |
| `POST` | `/`       | Registra um novo portfólio para o usuário autenticado. | Sim            |
| `PUT`  | `/`       | Atualiza um portfólio existente do usuário autenticado. | Sim            |
| `DELETE`| `/:id`    | Deleta um portfólio específico pelo ID.            | Sim            |

**Observação sobre `/all`**: Similar ao user, `POST` é usado para buscar dados.

---

### RatingController (`/api/rating`)

| Método | Rota             | Descrição                                       | Autenticação          |
|--------|------------------|-------------------------------------------------|-----------------------|
| `POST` | `/`              | Registra uma nova avaliação para um portfólio.  | Não (ver nota abaixo) |
| `POST` | `/all`           | Busca todas as avaliações.                      | Não                   |
| `PUT`  | `/`              | Atualiza uma avaliação existente.               | Sim                   |
| `DELETE`| `/:portfolioId`  | Deleta avaliações (provavelmente do usuário autenticado para um portfólio específico). | Sim                   |

**Observações**:
- A rota `POST /` para registrar uma avaliação não possui o middleware de autenticação explicitamente na definição da rota. A autenticação pode estar sendo tratada internamente no controller/serviço, ou pode ser um ponto a ser revisado para garantir que apenas usuários autenticados possam avaliar.
- A rota `DELETE /:portfolioId` sugere que pode deletar múltiplas avaliações de um portfólio, ou uma avaliação específica de um usuário para aquele portfólio. A lógica exata reside no controller.
- Rotas `/all` também utilizam `POST` para listagem.

---

**Corpo das Requisições e Respostas:**
Para detalhes sobre os corpos das requisições (payloads) esperados e os formatos das respostas para cada endpoint, será necessário consultar diretamente o código dos respectivos controllers (`src/adapters/InBound/Controller/`) e os DTOs ou tipos utilizados por eles. Esta documentação foca nos endpoints disponíveis e sua função geral.

## ⚙️ Configuração do Ambiente de Desenvolvimento

Para configurar e executar o backend localmente, siga os passos abaixo.

### Pré-requisitos

*   Node.js (versão LTS recomendada, ex: 18.x ou 20.x)
*   Yarn (gerenciador de pacotes)
    *   Se não tiver o Yarn, instale globalmente: `npm install -g yarn`
*   Uma instância do MongoDB em execução (localmente via Docker, MongoDB Community Server, ou um serviço de nuvem como MongoDB Atlas)

### Passos para Configuração

1.  **Navegue até o Diretório do Backend**:
    A partir da raiz do projeto:
    ```bash
    cd src/back-end
    ```

2.  **Instale as Dependências**:
    Este comando instalará todas as dependências listadas no `package.json` (Fastify, Prisma, Bcrypt, JWT, etc.).
    ```bash
    yarn install
    ```

3.  **Crie o Arquivo de Variáveis de Ambiente (`.env`)**:
    O backend utiliza um arquivo `.env` na raiz da pasta `src/back-end/` para carregar variáveis de ambiente. O script de desenvolvimento (`yarn run dev`) já está configurado para usar este arquivo (`--env-file .env`).

    Crie um arquivo chamado `.env` na pasta `src/back-end/` e adicione as seguintes variáveis:

    ```env
    # String de conexão com o MongoDB
    DATABASE_URL="mongodb://SEU_USUARIO_MONGO:SUA_SENHA_MONGO@localhost:27017/postfolio?authSource=admin"
    # Exemplo para conexão local sem autenticação (não recomendado para produção real):
    # DATABASE_URL="mongodb://localhost:27017/postfolio"

    # Chave secreta para JWT (JSON Web Tokens) - IMPORTANTE: Use um valor forte e aleatório
    JWT_SECRET="COLOQUE_AQUI_UMA_CHAVE_SECRETA_BEM_FORTE_E_ALEATORIA"
    TOKEN_EXPIRES_IN="1d" # Duração do token, ex: 1d (1 dia), 7d, 1h, 30m

    # Porta do servidor (opcional, o padrão no app.ts é 8080 se não definida aqui)
    # PORT=8080
    ```

    **Notas sobre `DATABASE_URL` para MongoDB**:
    *   Substitua `SEU_USUARIO_MONGO`, `SUA_SENHA_MONGO`, `localhost:27017` (host e porta do MongoDB) e `postfolio` (nome do banco de dados que será usado/criado) conforme necessário para o seu ambiente MongoDB.
    *   O parâmetro `authSource=admin` pode ser necessário dependendo da configuração de autenticação do seu MongoDB. Consulte a documentação do MongoDB para a string de conexão correta.

4.  **Gere o Prisma Client e Sincronize o Banco de Dados**:
    *   **Gerar o Prisma Client**: Este comando lê seu `prisma/schema.prisma` e gera o cliente Prisma type-safe. Execute-o sempre que houver alterações no schema.
        ```bash
        yarn prisma generate
        ```
    *   **Aplicar o Schema ao Banco de Dados (Desenvolvimento)**: O comando `db push` aplica o schema Prisma ao seu banco de dados MongoDB. Ele criará as coleções (equivalentes a tabelas) se não existirem. Este comando é mais adequado para desenvolvimento e prototipagem.
        ```bash
        yarn prisma db push
        ```
        Para ambientes de produção, `prisma migrate deploy` é a abordagem recomendada após criar e aplicar migrações em desenvolvimento com `prisma migrate dev`.

5.  **Inicie o Servidor de Desenvolvimento**:
    ```bash
    yarn run dev
    ```
    O servidor backend estará rodando (por padrão, conforme `app.ts`, na porta `8080`, a menos que sobrescrito pela variável `PORT` no `.env`). O script `dev` usa `ts-node-dev`, que reiniciará automaticamente o servidor quando alterações nos arquivos forem detectadas.
    Você deverá ver uma mensagem como: `Servidor rodando em http://localhost:8080`.

Agora você deve ter o ambiente de backend configurado e o servidor em execução, pronto para receber requisições da API.

## 🧪 Como Executar Testes
