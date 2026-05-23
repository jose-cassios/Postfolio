### ============================================================
### POSTFOLIO API - PAYLOADS DE TESTE
### Base URL: http://localhost:8080
### Formato: REST Client (VS Code extension "REST Client")
### ============================================================

@baseUrl = http://localhost:8080

### VARIÁVEIS - preencha após login
@token = SEU_JWT_AQUI
@userId = SEU_USER_ID_AQUI
@portfolioId = SEU_PORTFOLIO_ID_AQUI
@projectId = SEU_PROJECT_ID_AQUI
@competitionId = SEU_COMPETITION_ID_AQUI
@commentId = SEU_COMMENT_ID_AQUI


### ==============================================================
### 🌐 HEALTH CHECK
### ==============================================================

### GET / - Verificar se o servidor está online
GET {{baseUrl}}/
Accept: application/json


### ==============================================================
### 👤 USUÁRIO  (prefix: /api/user)
### ==============================================================

### GET /api/user - Hello (sem autenticação)
GET {{baseUrl}}/api/user
Accept: application/json

---

### POST /api/user - Criar usuário (Cadastro)
POST {{baseUrl}}/api/user
Content-Type: application/json

{
  "username": "João Silva",
  "email": "joao.silva@email.com",
  "password": "Senha@1234",
  "bio": "Dev fullstack apaixonado por tecnologia.",
  "linkedin": "https://linkedin.com/in/joaosilva",
  "github": "https://github.com/joaosilva",
  "website": "https://joaosilva.dev",
  "usertype": "DEVELOPER"
}

---

### POST /api/user - Criar usuário tipo EMPLOYER (Cadastro)
POST {{baseUrl}}/api/user
Content-Type: application/json

{
  "username": "Empresa Tech",
  "email": "contato@empresatech.com",
  "password": "Empresa@5678",
  "bio": "Empresa de tecnologia em busca de talentos.",
  "linkedin": "https://linkedin.com/company/empresatech",
  "usertype": "EMPLOYER"
}

---

### POST /api/user/login - Login
POST {{baseUrl}}/api/user/login
Content-Type: application/json

{
  "email": "joao.silva@email.com",
  "password": "Senha@1234"
}

---

### POST /api/user/all - Listar todos os usuários
POST {{baseUrl}}/api/user/all
Content-Type: application/json

---

### POST /api/user/profile - Buscar perfil do usuário autenticado
POST {{baseUrl}}/api/user/profile
Content-Type: application/json
Authorization: Bearer {{token}}

---

### PUT /api/user/:id - Atualizar usuário (requer auth)
PUT {{baseUrl}}/api/user/{{userId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "username": "João Silva Atualizado",
  "bio": "Dev fullstack com foco em arquitetura de software.",
  "linkedin": "https://linkedin.com/in/joaosilva-updated",
  "github": "https://github.com/joaosilva",
  "website": "https://joaosilva.dev"
}

---

### DELETE /api/user - Deletar usuário autenticado
DELETE {{baseUrl}}/api/user
Content-Type: application/json
Authorization: Bearer {{token}}

---

### GET /api/user/auth/google - Login com Google (abre no browser)
GET {{baseUrl}}/api/user/auth/google


### ==============================================================
### 🗂️ PORTFOLIO  (prefix: /api/portfolio)
### ==============================================================

### POST /api/portfolio/all - Listar todos os portfólios
POST {{baseUrl}}/api/portfolio/all
Content-Type: application/json

---

### POST /api/portfolio/user/me - Buscar portfólio do usuário autenticado
POST {{baseUrl}}/api/portfolio/user/me
Content-Type: application/json
Authorization: Bearer {{token}}

---

### POST /api/portfolio/:id/projects - Listar projetos de um portfólio
POST {{baseUrl}}/api/portfolio/{{portfolioId}}/projects
Content-Type: application/json
Authorization: Bearer {{token}}

---

### PUT /api/portfolio/:id - Atualizar portfólio (requer auth)
PUT {{baseUrl}}/api/portfolio/{{portfolioId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Portfólio do João - 2025",
  "description": "Meus melhores projetos de desenvolvimento fullstack e design.",
  "pagelink": "https://joaosilva.dev/portfolio"
}

---

### DELETE /api/portfolio - Deletar portfólio autenticado
DELETE {{baseUrl}}/api/portfolio
Content-Type: application/json
Authorization: Bearer {{token}}


### ==============================================================
### 🚀 PROJETO  (prefix: /api/project)
### ==============================================================

### POST /api/project - Criar projeto (requer auth)
POST {{baseUrl}}/api/project
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Postfolio Platform",
  "description": "Plataforma colaborativa para desenvolvedores apresentarem seus portfólios de forma competitiva.",
  "category": "FULLSTACK",
  "githublink": "https://github.com/jose-cassios/Postfolio",
  "portfolio": "{{portfolioId}}"
}

---

### POST /api/project - Criar projeto Frontend (requer auth)
POST {{baseUrl}}/api/project
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Dashboard Analytics",
  "description": "Dashboard de analytics em tempo real com Angular e Chart.js.",
  "category": "FRONTEND",
  "githublink": "https://github.com/joaosilva/dashboard-analytics",
  "portfolio": "{{portfolioId}}"
}

---

### POST /api/project - Criar projeto Backend (requer auth)
POST {{baseUrl}}/api/project
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "API de Pagamentos",
  "description": "API REST para processamento de pagamentos com Node.js e Stripe.",
  "category": "BACKEND",
  "githublink": "https://github.com/joaosilva/payment-api",
  "portfolio": "{{portfolioId}}"
}

---

### POST /api/project/all - Listar todos os projetos (requer auth)
POST {{baseUrl}}/api/project/all
Content-Type: application/json
Authorization: Bearer {{token}}

---

### POST /api/project/:projectId - Buscar projeto por ID (requer auth)
POST {{baseUrl}}/api/project/{{projectId}}
Content-Type: application/json
Authorization: Bearer {{token}}

---

### PUT /api/project/:projectId - Atualizar projeto (requer auth)
PUT {{baseUrl}}/api/project/{{projectId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Postfolio Platform v2",
  "description": "Versão 2.0 da plataforma Postfolio com novas funcionalidades.",
  "category": "FULLSTACK",
  "githublink": "https://github.com/jose-cassios/Postfolio"
}

---

### DELETE /api/project/:projectId - Deletar projeto (requer auth)
DELETE {{baseUrl}}/api/project/{{projectId}}
Content-Type: application/json
Authorization: Bearer {{token}}


### ==============================================================
### 🏆 COMPETIÇÃO  (prefix: /api/competition)
### ==============================================================

### POST /api/competition - Criar competição (requer auth)
POST {{baseUrl}}/api/competition
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Hackathon Postfolio 2025",
  "description": "Competição de projetos fullstack com foco em inovação e design."
}

---

### POST /api/competition/all - Listar todas as competições (requer auth)
POST {{baseUrl}}/api/competition/all
Content-Type: application/json
Authorization: Bearer {{token}}

---

### POST /api/competition/:competitionId - Buscar competição por ID (requer auth)
POST {{baseUrl}}/api/competition/{{competitionId}}
Content-Type: application/json
Authorization: Bearer {{token}}

---

### POST /api/competition/:competitionId/project - Projetos da competição (requer auth)
POST {{baseUrl}}/api/competition/{{competitionId}}/project
Content-Type: application/json
Authorization: Bearer {{token}}

---

### POST /api/competition/:competitionId/work/:projectId/details - Detalhes de projeto em competição
POST {{baseUrl}}/api/competition/{{competitionId}}/work/{{projectId}}/details
Content-Type: application/json
Authorization: Bearer {{token}}

---

### PUT /api/competition/:competitionId - Atualizar competição (requer auth)
PUT {{baseUrl}}/api/competition/{{competitionId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Hackathon Postfolio 2025 - Edição Especial",
  "description": "Competição ampliada com novas categorias e prêmios."
}

---

### DELETE /api/competition/:competitionId - Deletar competição (requer auth)
DELETE {{baseUrl}}/api/competition/{{competitionId}}
Content-Type: application/json
Authorization: Bearer {{token}}


### ==============================================================
### 💬 COMENTÁRIOS  (prefix: /api/comments)
### ==============================================================

### POST /api/comments - Criar comentário (requer auth)
POST {{baseUrl}}/api/comments
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "content": "Projeto incrível! A arquitetura está muito bem pensada.",
  "project": "{{projectId}}"
}

---

### POST /api/comments/:postId - Listar comentários de um projeto
POST {{baseUrl}}/api/comments/{{projectId}}
Content-Type: application/json

---

### POST /api/comments/:postId - Listar comentários com cursor (paginação)
POST {{baseUrl}}/api/comments/{{projectId}}?cursor=null
Content-Type: application/json

---

### PUT /api/comments/:commentId - Atualizar comentário (requer auth)
PUT {{baseUrl}}/api/comments/{{commentId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "content": "Projeto incrível! Atualizei meu comentário com mais detalhes sobre a arquitetura utilizada."
}

---

### DELETE /api/comments/:commentId - Deletar comentário (requer auth)
DELETE {{baseUrl}}/api/comments/{{commentId}}
Content-Type: application/json
Authorization: Bearer {{token}}


### ==============================================================
### ⭐ AVALIAÇÃO / RATING  (prefix: /api/rating)
### ==============================================================

### POST /api/rating - Criar ou atualizar avaliação (requer auth)
POST {{baseUrl}}/api/rating
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "user": "{{userId}}",
  "competition": "{{competitionId}}",
  "project": "{{projectId}}",
  "score": 8.5
}

---

### POST /api/rating - Avaliação máxima
POST {{baseUrl}}/api/rating
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "user": "{{userId}}",
  "competition": "{{competitionId}}",
  "project": "{{projectId}}",
  "score": 10.0
}
