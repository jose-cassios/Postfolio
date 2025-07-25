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
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Ou outro banco de sua prferencia, só alerar o arquivo schema.prisma
DATABASE_URL="mongodb://usuario:senha@localhost:27017/nome_do_banco?authSource=admin"
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

A api foi desenvolvida para ser usada como backend do projeto Postfolio. Sua estrutura geral foi pensada para ser um monólito modular. Cada module compõe uma pequena parte do dominio da aplicação, tendo cada um deles o máximo de independencia possivel.

## Índice
- [0. Sobre app.ts](#0-sobre-appts)
- [1. Modulos](#1-modulos)
  - [1.1 Sobre infrastructure](#11-sobre-infrastructure)
  - [1.2 Sobre Shared](#12-sobre-shared)
- [1. Endpoints](#1-endpoints)
- [2. Arquitetura](#2-arquitetura)
  - [2.1 Descrição da Arquitetura](#21-descrição-da-arquitetura)
  - [2.2 Estrutura de Pastas](#22-estrutura-de-pastas)
- [3. Código e Propósitos](#3-código-e-propósitos)
- [4. Conclusão](#4-conclusão)

---

## 0. Sobre app.ts

O arquivo app.ts é a porta de entrada para a execução da api. É onde as configurações são feitas e definidas.

Importação necessarias:
```ts
import Fastify from "fastify"; // Importação do fastify
import fastifyCors from "@fastify/cors"; // dos cors
import "@infrastructure/types/fastify"; // modulo de infra, será detalhado em outra seção.
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod"; // dados necessarios para o zod.
import { AppComposer } from "compositionRoot/appComposer"; // Será detalhado em outro modulo.

```

Inicialização do app:
```ts
// Configurações necessarias
const app = Fastify({
  // Os logs são apenas a nivel de erro.
  logger: {
    level: "error",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        ignore: "pid,hostname,reqId,req,res",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>(); // Adicionar zod como Um provider.
const PORT = 8080; // A porta da api

// Necessario para o bom funcionamento do zod.
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
```
Onde é CORS é configurado:
```ts
app.register(fastifyCors, {
  origin: true, // Permite todas as fontes
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
});
```
Registros e outras configurações:
```ts
const appCompose = new AppComposer();
appCompose.registerRoutes(app);
appCompose.configureFastify(app);
appCompose.registerHandlers();
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

## 1. Módulos

A API foi construída com base em uma arquitetura de monólito modular, onde cada módulo representa uma pequena porção isolada do domínio da aplicação. Cada módulo contém tudo o que é necessário para seu funcionamento, incluindo entidades, casos de uso, controladores, repositórios, validações e mapeamentos.

Essa abordagem permite que os módulos sejam o mais independentes possível uns dos outros, facilitando a manutenção, a escalabilidade e até mesmo uma futura migração para uma arquitetura de microsserviços, se necessário.

A seguir, os principais diretórios da estrutura de código:

```shell
📦 back-end/
├── 📁 src/
│   ├── 📁 compositionRoot/     # Composição de dependências e injeção
│   ├── 📁 infrastructure/      # Infraestrutura geral (ex: conexão com DB, middleware)
│   ├── 📁 modules/             # Módulos de domínio independentes (ex: user, work, competition)
│   ├── 📁 shared/              # Código e utilitários reutilizáveis entre módulos
│   └── 📁 test/                # Testes automatizados da aplicação

....
```
Cada pasta em modules/ representa um contexto isolado do domínio, como:

```shell
📦 modules/
├── 📁 competition/
├── 📁 portfolio/
├── 📁 user/
└── 📁 work/
```

Dentro de cada módulo, seguimos uma estrutura comum com pastas como controller, service, repository, dtos, domain, etc., mantendo o princípio de coesão alta e acoplamento baixo.

### 1.1 Modulos do dominio

A estruturação de cada modulo do dominio foi projetada para ser intuitiva e escalável. Todos foram seguiem a mesma estrutura de pastas e lógica. Abaixo, detalhamos o propósito de cada diretório e arquivo principal:

```shell
MODULES\USER
├───api
├───composition
├───domain
│   ├───entities
│   └───valueObject # (opcional) Vai depender da modelagem do domain
├───dtos
├───inBound
├───repository
├───service
└───util
```

---
`api`
Define as portas de saída (outbound ports) e seus adaptadores para interações com modulos externos ou sistemas de terceiros (e.g., modulo de work, portfolio, APIs externas).

---
`composition`
Orquestra a injeção de dependências e a montagem de todas as partes do módulo dentro do container. Para mais detalhes, leia o dentro da pasta `composition` de cada modulo.

---
`domain`
A camada mais central e agnóstica a tecnologias, contendo a lógica de negócio pura, as regras de domínio e as entidades.

- `entities`: Local onde fica a interface do repository e a entidade(s) principal(ais) do modulo.
- `valueObject`: Um objeto de valor que encapsula a lógica e validações relacionadas a uma coluna do banco.

---
`dtos`
Define os Data Transfer Objects (DTOs), que são modelos de dados usados para transferir informações entre as diferentes camadas e sistemas, sem expor a estrutura interna das entidades de domínio.

---
`inBound`
Define as portas de entrada para o módulo, relacionadas à API e à validação de requisições. Tem dentro dela três arquivos geralmente:

- `controller`: responsável por receber as requisições HTTP, delegar para a camada de serviço e retornar as respostas.
- `route`: Define as rotas da API para o módulo, mapeando os endpoints para os métodos do `controller`.
- `schema`: Esquemas de validação de dados com o zod para as requisições de entrada, garantindo que os dados recebidos estejam no formato esperado.

---
`repository`
Fornece a implementação concreta da interface repository definida na camada de domínio, lidando diretamente com a persistência de dados (banco de dados, cache, etc.).

---
`service`
Contém a lógica de aplicação, orquestrando as operações de negócio e atuando como um intermediário entre a camada de entrada (`inBound`) e o domínio (`domain`).

---
`util`
Abriga funções utilitárias ou auxiliares que não se encaixam diretamente nas outras camadas, mas são usadas em várias partes do módulo (ex: mappers).


### 1.2 Sobre infrastructure

### 1.3 Sobre Shared

### 

## 2. Guias de Contribuição

## 3. Tratamento de Erros e Logs

## 4. Segurança

## 4. Conclusão