# Improve, versões, reputação e avaliações

## Regras de domínio

- Like e Save são interações independentes e não geram reputação.
- Improve (o novo Appreciate) é um feedback estruturado com aspecto, ponto
  forte, sugestão e comentário complementar opcional.
- O autor não pode enviar Improve ao próprio projeto.
- Somente o autor do projeto altera o estado do feedback.
- Eventos de reputação possuem `idempotencyKey` única. Voltar e avançar um
  estado não duplica pontuação.
- Uma sugestão pode receber crédito em apenas uma versão.
- Uma versão nova exige mudança real no snapshot; alterar somente o changelog
  não cria uma versão nem reputação.
- Resultados de eventos não saem na API antes da fase `RESULTS`.

Os valores ficam centralizados em
`src/modules/project/application/ReputationPolicy.ts`:

| Evento | Eixo | Pontos |
| --- | --- | ---: |
| `APPRECIATION_USEFUL` | Contributor | 2 |
| `APPRECIATION_APPLIED` | Contributor | 5 |
| `PROJECT_IMPROVED` | Creator | 3 |
| `PROJECT_VERSION_WITH_COMMUNITY_CREDIT` | Creator | 2 |

## Rotas principais

- `POST /api/project/:projectId/appreciations`
- `GET /api/project/:projectId/appreciations`
- `PATCH /api/project/:projectId/appreciations/:appreciationId/status`
- `PUT /api/competition/:competitionId/evaluations/:projectId`
- `GET /api/competition/:competitionId/evaluation-progress`

A publicação de versão usa o `PUT /api/project/:projectId` existente com
`status: "PUBLISHED"`, `changelog` e `appreciationIds`.

As antigas rotas de super-like e voto unitário não são registradas.

## Migração e produção

A migração `20260831000000_appreciate_versions_reputation_events` é aditiva:

- acrescenta a configuração de feedback ao projeto;
- evolui os registros existentes de Appreciate com valores compatíveis;
- cria versões, créditos, eventos de reputação, critérios e avaliações;
- cria uma v1 para cada projeto já publicado;
- cria o critério neutro `Avaliação geral` para eventos antigos;
- remove o default de usuário anônimo da tabela legada de Rating e troca sua
  FK para remoção em cascata, sem apagar avaliações no momento da migração.

Sequência recomendada no ambiente publicado:

1. Faça backup do PostgreSQL do Render.
2. Execute `prisma migrate deploy` usando a mesma versão do backend que contém
   o novo Prisma Client.
3. Faça o deploy/restart do backend no Render.
4. Valide as rotas autenticadas e publique o frontend na Vercel logo depois.

Não é necessário alterar Redis ou MinIO para esta evolução.
