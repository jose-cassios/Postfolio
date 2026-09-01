# Postmarks, versões, reputação e avaliações

## Regras de domínio

- Like e Save são interações independentes e não geram reputação.
- Postmark é um feedback estruturado com aspecto, ponto forte, sugestão e
  comentário complementar opcional.
- Todo projeto publicado pode receber Postmarks e comentários.
- O autor não pode enviar Postmark ao próprio projeto.
- Somente o autor do projeto altera o estado do Postmark.
- Eventos de reputação possuem `idempotencyKey` única. Voltar e avançar um
  estado não duplica pontuação.
- Um Postmark pode receber crédito em apenas uma versão.
- Uma versão nova exige mudança real no snapshot; alterar somente o changelog
  não cria uma versão nem reputação.
- Resultados de eventos não saem na API antes da fase `RESULTS`.

Os valores ficam centralizados em
`src/modules/project/application/ReputationPolicy.ts`. Os identificadores dos
eventos de reputação e os nomes físicos do Prisma permanecem legados para não
exigir uma migração destrutiva no banco já publicado.

| Ação | Eixo | Pontos |
| --- | --- | ---: |
| Postmark marcado como útil | Contributor | 2 |
| Postmark aplicado | Contributor | 5 |
| Projeto evoluído | Creator | 3 |
| Versão com crédito da comunidade | Creator | 2 |

## Rotas principais

- `POST /api/project/:projectId/postmarks`
- `GET /api/project/:projectId/postmarks`
- `PATCH /api/project/:projectId/postmarks/:postmarkId/status`
- `PUT /api/competition/:competitionId/evaluations/:projectId`
- `GET /api/competition/:competitionId/evaluation-progress`

A publicação de versão usa o `PUT /api/project/:projectId` existente com
`status: "PUBLISHED"`, `changelog` e `postmarkIds`.

## Migração e produção

Esta mudança de nomenclatura não altera tabelas, colunas ou enums existentes.
Os modelos físicos legados continuam sendo usados internamente e a API expõe
somente a nomenclatura Postmark.

Sequência recomendada no ambiente publicado:

1. Faça o deploy/restart do backend no Render.
2. Valide as rotas autenticadas de Postmark.
3. Publique o frontend na Vercel logo depois.

Não é necessário alterar PostgreSQL, Redis ou MinIO para esta evolução.
