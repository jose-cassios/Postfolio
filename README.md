<p align="center">
  <img width="225px" src="assets/postfolio-logo.png" alt="Postfólio Logo">
</p>

<h1 align="center">Postfolio</h1>

Bem-vindo(a) ao Postfólio, nossa plataforma colaborativa para desenvolvedores, designers e profissionais de tecnologia apresentarem seus trabalhos de forma competitiva e interativa.

## 🔎 Visão Geral

O Postfólio é uma aplicação em desenvolvimento com o objetivo de conectar talentos da tecnologia. Aqui, os usuários poderão publicar seus portfólios, receber feedbacks da comunidade e promover seus projetos.

Este projeto surgiu como uma forma de aprendizado coletivo e prática colaborativa. A ideia é integrar backend, frontend, design e gestão em um só espaço, promovendo o crescimento pessoal e técnico de todos os envolvidos.

Se você quer evoluir enquanto trabalha em um projeto real, está no lugar certo.

## 🚧 Status do Projeto

O projeto ainda está em desenvolvimento e aberto para colaboração. Contribuições são bem-vindas em todas as áreas: código, design, documentação, testes e sugestões.

## 🧠 Tecnologias Usadas

- **Frontend:** Reestruturando...
- **Backend:** Node.js + Fastify + Prisma + PostgreSQL
- **ORM:** Prisma
- **Controle de Versão:** Git + GitHub
- **Gerenciador de pacotes:** Yarn

## 🚀 Como Executar o Projeto

**Requisito:** Yarn

Caso ainda não tenha o Yarn instalado, rode:
```bash
npm i -g yarn
```

---

### 🔧 Frontend

1.  **Acesse a pasta:**
    ```bash
    cd src/front-end
    ```

2.  **Instale as dependências:**
    ```bash
    yarn install
    ```

3.  **Rode o servidor de desenvolvimento:**
    ```bash
    yarn run dev
    ```

Acesse em: [http://localhost:5173/](http://localhost:5173/)

---

### 🔧 Backend

1.  **Acesse a pasta:**
    ```bash
    cd src/back-end
    ```

2.  **Instale as dependências e configure o Prisma:**
    ```bash
    yarn install
    yarn prisma init
    ```

3.  **Configure o banco no `.env`:**
    Crie um arquivo `.env` na raiz da pasta `src/back-end` e adicione a sua string de conexão com o banco de dados:
    ```env
    DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/postfolio"
    ```

4.  **Gere os modelos e aplique as migrações:**
    ```bash
    yarn prisma generate
    yarn prisma db push
    ```

5.  **Inicie o backend:**
    ```bash
    yarn run dev
    ```

Acesse em: [http://localhost:3333/](http://localhost:3333/)

---

## 🤝 Como Contribuir

Este projeto utiliza o **Gitflow** como fluxo de trabalho para gerenciar as contribuições. Isso nos ajuda a manter o projeto organizado e a ter um histórico de versões claro e limpo.

### Fluxo de Contribuição com Gitflow

1.  **Faça um Fork no GitHub:**
    Clique no botão "Fork" no canto superior direito do [repositório oficial](https://github.com/jose-cassios/Postfolio.git).

2.  **Clone o seu Fork:**
    ```bash
    git clone https://github.com/SEU_USUARIO/Postfolio.git
    cd Postfolio
    ```

3.  **Adicione o repositório original como remoto (`upstream`):**
    ```bash
    git remote add upstream https://github.com/jose-cassios/Postfolio.git
    ```

4.  **Crie sua branch a partir da `develop`:**
    O Gitflow utiliza a branch `develop` como base para novas funcionalidades. A branch `main` contém apenas as versões estáveis (releases).

    Primeiro, mantenha seu fork atualizado:
    ```bash
    git fetch upstream
    git checkout develop
    git merge upstream/develop
    ```

    Agora, crie sua branch de feature:
    ```bash
    git checkout -b feat/nome-da-sua-feature
    ```
    Use prefixos como `fix/`, `docs/`, `refactor/`, etc., dependendo do tipo de alteração.

5.  **Faça seus commits e envie para o seu fork:**
    Faça seus commits seguindo o padrão de [Conventional Commits](#-padrão-de-commits-conventional-commits).
    ```bash
    git push origin feat/nome-da-sua-feature
    ```

6.  **Crie um Pull Request:**
    Abra um Pull Request no GitHub do seu fork para a branch `develop` do repositório original. Descreva bem as suas alterações para que a equipe possa revisar.

### 📝 Padrão de Commits (Conventional Commits)

Utilizamos o padrão Conventional Commits para manter o histórico de commits legível e organizado.

**Formato:**
```
tipo(escopo)[subescopo]: descrição
```

**Exemplos:**
```
feat(backend)[auth]: implement user registration
fix(frontend)[ui]: fix layout bug on mobile
docs(readme): update contribution guide
```

**Tipos comuns:**
*   `feat`: nova funcionalidade
*   `fix`: correção de bug
*   `docs`: alterações na documentação
*   `style`: ajustes de formatação (espaços, ponto e vírgula, etc.)
*   `refactor`: melhoria no código sem alterar a funcionalidade
*   `test`: adição ou modificação de testes
*   `chore`: tarefas auxiliares (build, dependências, etc.)

## 🎨 Design (Figma)

Todo o design e prototipação do projeto estão disponíveis no Figma.
[Acesse o Figma do Postfólio aqui](https://www.figma.com/design/qIEnNTsDRQU1lTdv2SMfhA/PostifolioOficial?node-id=0-1&t=UmizEjYnuAsCcBA8-1)

---

Junte-se a nós e vamos construir algo incrível juntos!
