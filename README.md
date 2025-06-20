<p align="center">
  <img width="225px" src="assets/postfolio-logo.png" alt="ArenaPortfolio">
</p>

## 📌 Visão Geral

🖥️ O Postfolio é uma plataforma colaborativa para desenvolvedores, designers e profissionais de tecnologia apresentarem seus portfólios. O objetivo é oferecer um espaço onde os usuários possam compartilhar seus trabalhos de forma competitiva e receberem avaliações. O projeto foi criado para estimular o aprendizado dos alunos e promover o compartilhamento de experiências no desenvolvimento de software e design.

## 🚀 Como Executar o Projeto

Caso não tenha o yarn, instale globalmente:
```bash
npm i -g yarn
```

### 🔥 Configurando o Frontend

1. Navegue até a pasta frontend:

```bash
cd src/frontend
```
2. Instale as dependências:

```bash
yarn install
```

3️. Inicie o servidor de desenvolvimento:

```bash 
yarn run dev
```

**O frontend estará rodando em: http://localhost:5173 (ou a porta definida).**


### 🔥 Configurando o Backend

1. Navegue até a pasta backend:

```bash
cd src/backend
```

2. Inicialize o Prisma:

```bash
yarn install
yarn prisma init
```

3. Configure o banco de dados no arquivo .env:

```bash
DATABASE_URL="postgresql://usuario:senha@localhost:5432/postfolio"
```

4. Gere os modelos do banco de dados:

```bash
yarn prisma generate
yarn prisma db push
```

5. Inicie o servidor backend:

```bash
yarn run dev
```

**📍 O backend estará rodando em: http://localhost:3333 (ou a porta definida).**

---

## 🤝 Como Contribuir

Ficamos felizes com o seu interesse em contribuir com o Postfolio! Para garantir que o processo seja o mais tranquilo possível para todos, siga estas diretrizes:

### Configuração do Ambiente

Antes de começar, certifique-se de que você consegue configurar e executar o projeto localmente. As instruções detalhadas para o frontend e o backend estão na seção [🚀 Como Executar o Projeto](#-como-executar-o-projeto) acima.

### Fluxo de Contribuição no GitHub

1.  **Faça um Fork do Repositório**:
    *   Clique no botão "Fork" no canto superior direito da página do repositório no GitHub. Isso criará uma cópia do repositório na sua conta do GitHub.

2.  **Clone o seu Fork**:
    *   Clone o repositório que você acabou de "forkar" para a sua máquina local:
        ```bash
        git clone https://github.com/SEU_USUARIO/Postfolio.git
        cd Postfolio
        ```

3.  **Adicione o Repositório Original como "Upstream"**:
    *   Isso permite que você mantenha seu fork atualizado com as últimas alterações do repositório principal.
        ```bash
        git remote add upstream https://github.com/ArenaDevNet/Postfolio.git
        ```
        (Substitua `ArenaDevNet/Postfolio` pelo caminho correto do repositório original, se diferente).

4.  **Crie uma Nova Branch**:
    *   Antes de fazer qualquer alteração, crie uma nova branch para o seu trabalho. Use um nome descritivo para a branch (em inglês), por exemplo:
        ```bash
        git checkout -b feat/add-user-authentication
        # ou para um bug fix:
        git checkout -b fix/login-button-misaligned
        ```

5.  **Mantenha sua Branch Atualizada**:
    *   Periodicamente, e especialmente antes de enviar um Pull Request, atualize sua branch principal (`main` ou `develop`) do seu fork com as alterações do repositório `upstream` e depois mescle essas atualizações na sua branch de feature:
        ```bash
        git fetch upstream
        git checkout main # ou a branch principal do projeto
        git merge upstream/main
        git checkout NOME_DA_SUA_BRANCH_DE_FEATURE
        git merge main
        ```

6.  **Faça suas Alterações e Commits**:
    *   Trabalhe nas suas alterações na sua branch.
    *   Faça commits das suas alterações usando o padrão de Conventional Commits (veja abaixo).

7.  **Envie suas Alterações para o seu Fork**:
    *   Faça o push da sua branch para o seu repositório forkado no GitHub:
        ```bash
        git push origin NOME_DA_SUA_BRANCH_DE_FEATURE
        ```

8.  **Abra um Pull Request (PR)**:
    *   Vá para o repositório original no GitHub.
    *   Você verá uma notificação para criar um Pull Request a partir da sua branch recém-enviada. Siga as instruções.
    *   No PR, descreva claramente as alterações que você fez e por quê. Se o PR resolver uma issue existente, mencione o número da issue (ex: "Closes #123").
    *   Certifique-se de que seu PR seja direcionado para a branch principal de desenvolvimento do repositório original (geralmente `main`, `master` ou `develop`).

### Padrões de Commits Convencionais (Conventional Commits)

Para manter um histórico de commits claro e organizado, utilizamos o padrão de Conventional Commits. A estrutura básica é:

```
tipo(escopo)[opcional sub-escopo]: descrição curta em inglês no imperativo
```

-   **`tipo`**: Define a natureza do commit. Os mais comuns são:
    *   `feat`: Uma nova funcionalidade (feature).
    *   `fix`: Uma correção de bug.
    *   `docs`: Alterações apenas na documentação.
    *   `style`: Alterações que não afetam o significado do código (espaços em branco, formatação, ponto e vírgula ausente, etc).
    *   `refactor`: Uma alteração de código que não corrige um bug nem adiciona uma feature.
    *   `test`: Adicionando testes ausentes ou corrigindo testes existentes.
    *   `chore`: Alterações no processo de build ou ferramentas auxiliares e bibliotecas como geração de documentação. Não altera código de produção.
    *   `perf`: Uma alteração de código que melhora o desempenho.

-   **`escopo` (opcional)**: Especifica o local do commit (ex: `backend`, `frontend`, `auth`, `ui`, `database`).
-   **`sub-escopo` (opcional, entre colchetes `[]`)**: Especifica um módulo ou parte mais específica dentro do escopo (ex: `models`, `controllers`, `components`).
-   **`descrição`**: Um resumo conciso das alterações feitas, escrito em inglês e no modo imperativo (ex: "Implement user login" em vez de "Implemented user login" ou "Implements user login").

**Exemplos**:

*   `feat(backend)[auth]: Implement user registration endpoint`
*   `fix(frontend)[ui]: Correct alignment of header logo on mobile`
*   `docs(readme): Add contribution guidelines`
*   `refactor(backend)[services]: Simplify email sending logic`
*   `test(frontend)[components]: Add unit tests for Button component`
*   `chore: Update ESLint configuration`

**Importante**: Conforme solicitado, nomes de componentes de UI (Footer, Header), arquivos, funções, variáveis, etc., no código devem permanecer em inglês. A tradução se aplica apenas à documentação (como este README) e comentários no código, se necessário.


## 📝 Considerações Finais
🔧 O projeto Postfolio está em fase inicial e em constante desenvolvimento. Todas as decisões serão discutidas pela equipe e sugestões são sempre bem-vindas!

🚀 Se quiser contribuir, entre em contato ou abra uma issue no repositório!
