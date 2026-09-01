# Storage de imagens com MinIO

O frontend envia a imagem local para `POST /api/storage/images` como
`multipart/form-data`, no campo `image`. A rota exige autenticação. O backend
valida o conteúdo do arquivo, limita o tamanho a 8 MB, grava o objeto no MinIO e
retorna a URL pública. O PostgreSQL recebe somente essa URL nos dados do usuário
ou do projeto.

Formatos aceitos: JPG, PNG, WebP e GIF.

## Ambiente local

Copie as variáveis de `.env.example` para o `.env` e use:

```sh
docker compose up --build
```

O endpoint S3 fica em `http://localhost:9000` e o console do MinIO em
`http://localhost:9001`. O volume `minio_data` preserva os arquivos entre
reinicializações dos contêineres.

## Produção

Configure somente no backend:

```text
MINIO_ENDPOINT=https://storage.exemplo.com
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
MINIO_BUCKET=postfolio-images
MINIO_REGION=us-east-1
MINIO_PUBLIC_URL=https://storage.exemplo.com
MINIO_USE_SSL=true
```

`MINIO_PORT` é opcional quando a porta já está presente em
`MINIO_ENDPOINT` ou quando é a porta padrão do protocolo.

O serviço cria o bucket quando necessário e aplica uma política pública somente
para leitura dos objetos. Portanto, a credencial usada precisa permitir
`BucketExists`, `MakeBucket`, `PutObject` e `SetBucketPolicy`. O bucket deve ser
exclusivo para imagens públicas do Postfolio; não coloque documentos privados
nele.

No Render, o MinIO precisa ter disco persistente e uma URL HTTPS acessível pelo
backend e pelo navegador. Nenhuma credencial do MinIO deve ser cadastrada na
Vercel; o frontend conhece apenas a URL da API do backend.

## Verificação

Com um token válido, `GET /api/storage/health` responde se a configuração está
presente e se o bucket pode ser alcançado. A resposta não expõe credenciais.
