# Documentação do Frontend

## Estrutura do Projeto

O diretório `src` contém o código-fonte principal da aplicação frontend.

- **`main.tsx`**: O ponto de entrada principal da aplicação. Ele inicializa o React e renderiza o componente raiz `App`.
- **`app.tsx`**: Define o componente raiz `App`, incluindo a estrutura principal de rotas usando `react-router-dom`.
- **`index.css`**: Folha de estilos global para a aplicação. Provavelmente contém estilos base e importações do Tailwind CSS.
- **`vite-env.d.ts`**: Definições TypeScript para variáveis de ambiente do Vite.
- **`components/`**: Este diretório contém componentes de UI reutilizáveis usados em toda a aplicação.
  - **`ParticleComponent.tsx`**: Um componente provavelmente responsável por renderizar efeitos de partículas.
  - **`projects/`**: Contém componentes relacionados à exibição de projetos.
    - **`ProjectCard.tsx`**: Um componente para exibir informações de projetos individuais.
    - **`ProjectCarousel.tsx`**: Um componente para exibir múltiplos projetos em formato de carrossel.
    - **`useProjects.ts`**: Um hook customizado provavelmente responsável por buscar ou gerenciar dados de projetos.
- **`hooks/`**: Este diretório contém hooks customizados do React que encapsulam lógica reutilizável.
  - **`useUnsplashImage.ts`**: Um hook customizado provavelmente usado para buscar ou interagir com imagens do Unsplash.
- **`layouts/`**: Este diretório contém componentes que definem o layout geral ou a estrutura das páginas (ex: cabeçalhos, rodapés, barras laterais).
  - **`Header.tsx`**: Um componente para o cabeçalho/barra de navegação da aplicação.
- **`pages/`**: Este diretório contém os componentes de nível superior para diferentes páginas ou visualizações da aplicação.
  - **`Home.tsx`**: O componente para a página inicial.
  - **`Login.tsx`**: O componente para a página de login.

O diretório `public/` (fora de `src/`) contém ativos estáticos que são servidos diretamente pelo servidor web.

O arquivo `vite.config.ts` na raiz de `src/front-end/` configura a ferramenta de build Vite.

## Componentes

Esta seção descreve os componentes de UI reutilizáveis encontrados em `src/components/`.

### `ParticleComponent.tsx`

- **Propósito**: Renderiza um fundo animado de partículas usando a biblioteca `@tsparticles/react`. Este componente adiciona um efeito visual dinâmico à interface do usuário.
- **Props**: Este componente não aceita nenhuma prop.
- **Uso**: Pode ser incluído em qualquer página ou componente de layout onde um fundo de partículas é desejado.

  ```tsx
  import ParticleComponent from './components/ParticleComponent';

  // Dentro do método de renderização de um componente:
  <ParticleComponent />
  ```

### `projects/ProjectCard.tsx`

- **Propósito**: Exibe informações sobre um único projeto. Apresenta um card com uma visão frontal e traseira que vira ao passar o mouse.
  - A frente geralmente mostra o título do projeto, a função do usuário e uma imagem relevante.
  - O verso fornece conteúdo mais detalhado e um botão de contato (email).
- **Props**:
  - `title: string`: O título do projeto.
  - `role: string`: A função desempenhada no projeto.
  - `frontImage: string`: URL ou caminho para a imagem exibida na frente do card.
  - `backContent: string`: Conteúdo de texto exibido no verso do card.
  - `portfolioLink: string`: (Atualmente comentado no código-fonte, mas definido nas props) Uma URL para o portfólio do projeto ou versão ao vivo.
  - `emailContact: string`: Endereço de email para contato relacionado ao projeto.
- **Uso**: Este componente é usado primariamente pelo `ProjectCarousel` para renderizar cards de projetos individuais.

  ```tsx
  import ProjectCard from './components/projects/ProjectCard';

  <ProjectCard
    title="Meu Projeto Incrível"
    role="Desenvolvedor Líder"
    frontImage="caminho/para/imagem.png"
    backContent="Descrição detalhada do projeto e minhas contribuições."
    portfolioLink="https://exemplo.com/portfolio/projeto"
    emailContact="contato@exemplo.com"
  />
  ```

### `projects/ProjectCarousel.tsx`

- **Propósito**: Exibe uma coleção de projetos em formato de carrossel com rolagem horizontal. Utiliza a biblioteca `keen-slider` para sua funcionalidade, incluindo looping, modo de rolagem livre e ajustes responsivos para diferentes tamanhos de tela. O carrossel também possui um mecanismo de autoplay.
- **Props**:
  - `projects: Project[]`: Um array de objetos de projeto. Cada objeto deve estar em conformidade com o seguinte tipo:
    ```typescript
    type Project = {
      title: string;
      role: string;
      frontImage: string;
      backContent: string;
      portfolioLink: string;
      emailContact: string;
    };
    ```
- **Uso**: Usado para mostrar múltiplos projetos de uma maneira visualmente atraente e interativa.

  ```tsx
  import ProjectCarousel from './components/projects/ProjectCarousel';

  const meusProjetos = [
    // ... array de objetos de projeto
  ];

  <ProjectCarousel projects={meusProjetos} />
  ```

## Páginas

Esta seção descreve os componentes de página de nível superior encontrados em `src/pages/`. Esses componentes são tipicamente renderizados com base no roteamento da aplicação.

### `Home.tsx`

- **Propósito**: Serve como a página de destino principal para a aplicação "Competição de Portfólios".
- **Funcionalidade**:
  - Exibe uma seção de cabeçalho (através do componente de layout `Header`).
  - Incorpora o `ParticleComponent` para um fundo animado.
  - Fornece informações sobre a competição, incluindo seus objetivos, critérios de participação e métricas de avaliação.
  - Apresenta botões de chamada para ação como "Veja os competidores" e "Participe da competição".
  - Mostra projetos de participantes usando o componente `ProjectCarousel`. Os dados para esses projetos estão atualmente hardcoded nesta página.
- **Rota**: `/` (Caminho raiz)

### `Login.tsx`

- **Propósito**: Fornece a interface do usuário para autenticação.
- **Funcionalidade**:
  - Apresenta um formulário de login com campos para nome de usuário e senha.
  - Inclui um link "Esqueci minha senha" e uma caixa de seleção "Lembrar de mim".
  - Apresenta um botão proeminente "Entrar".
  - A página tem um design visual distinto com um layout de dois painéis (um painel de marca e um painel de formulário) e usa efeitos de glassmorphism.
  - **Estilização**: Uma porção significativa da estilização para esta página é autocontida. É definida dentro de um subcomponente `PageStyles` que injeta CSS diretamente no cabeçalho do documento usando uma tag `<style>`. Isso inclui propriedades CSS customizadas, animações e regras de layout.
  - **Nota**: Na versão atual, o formulário de login é primariamente uma representação de UI e não implementa lógica de autenticação real ou integração com API.
- **Rota**: `/login`

## Hooks

Esta seção descreve hooks customizados do React usados na aplicação para encapsular lógica com estado reutilizável.

### `components/projects/useProjects.ts`

- **Propósito**: Este arquivo parece ser uma tentativa inicial de criar um hook customizado para buscar ou gerenciar dados de projetos.
- **Estado Atual**:
  - A lógica principal do hook dentro de uma função `useProjects` está atualmente comentada.
  - O arquivo exporta um array hardcoded de dois objetos de projeto. Este array não é um hook em si e não é atualmente consumido por outras partes da aplicação (ex: a página `Home` usa seu próprio array local `projects`).
- **Nota**: Este hook pode ser um remanescente do desenvolvimento anterior ou uma funcionalidade incompleta.

### `hooks/useUnsplashImage.ts`

- **Propósito**: Um hook customizado para buscar uma URL de imagem aleatória da API do Unsplash com base em uma consulta fornecida.
- **Funcionalidade**:
  - Aceita um argumento `query: string` para especificar o tipo de imagem a ser pesquisada.
  - Gerencia o estado para a URL da imagem buscada.
  - Busca dados da imagem de `https://api.unsplash.com/photos/random` quando o componente é montado ou a `query` muda.
  - Retorna a URL da imagem buscada (tamanho regular).
  - Inclui tratamento básico de erros, registrando quaisquer erros de busca no console.
- **Parâmetros**:
  - `query: string`: O termo de busca para a API do Unsplash (ex: "technology", "nature").
- **Retorna**:
  - `string | null`: A URL da imagem do Unsplash buscada, ou `null` se a imagem ainda não foi carregada ou se ocorreu um erro durante a busca.
- **Uso**:

  ```tsx
  import useUnsplashImage from './hooks/useUnsplashImage';

  function MeuComponente() {
    const imageUrl = useUnsplashImage('natureza');

    if (!imageUrl) {
      return <p>Carregando imagem...</p>;
    }

    return <img src={imageUrl} alt="Imagem Aleatória da Natureza do Unsplash" />;
  }
  ```
- **Importante**: Este hook contém uma `ACCESS_KEY` do Unsplash hardcoded. Para ambientes de produção, as chaves de API devem ser gerenciadas de forma segura, tipicamente através de variáveis de ambiente.

## Estilização

O projeto emprega uma abordagem multicamadas para estilização, utilizando primariamente o Tailwind CSS, com estilos globais e algum CSS específico de componente.

### 1. Tailwind CSS

- **Framework Principal**: Tailwind CSS é o principal framework de estilização. Classes utilitárias são aplicadas diretamente no JSX dos componentes para construir os designs.
- **Configuração (`tailwind.config.js`)**:
  - **Observação de Conteúdo**: O Tailwind é configurado para escanear `index.html` e todos os arquivos `.js`, `.ts`, `.jsx`, e `.tsx` dentro do diretório `src/` para nomes de classes para gerar o CSS necessário.
  - **Customização do Tema**: O tema padrão do Tailwind é estendido com:
    - Paletas de cores customizadas: `dark` (rosa, preto, azul) e `light` (rosa, branco, azul).
    - Uma imagem de fundo customizada: `pattern` (definida como `url(/bg.png)`).
    - Uma fonte sans-serif padrão: `Inter`.
    - Um estilo de sombra de caixa customizado: `shape`.
  - **Plugins**: Nenhum plugin externo do Tailwind CSS está atualmente em uso.

### 2. Folha de Estilos Global (`src/index.css`)

- **Integração com Tailwind**: Este arquivo é responsável por importar as camadas `base`, `components`, e `utilities` do Tailwind.
- **Estilos Base**:
  - Define um `min-width: 0` global para todos os elementos.
  - Garante que `html` e `body` ocupem pelo menos 100% da altura da viewport e habilitem a rolagem vertical.
- **Barra de Rolagem Customizada**: Inclui CSS customizado para estilizar barras de rolagem em navegadores baseados em Webkit (ex: Chrome, Safari), afetando o polegar, a trilha e os estados de hover.
- **Classes Utilitárias Customizadas**:
  - Várias classes utilitárias customizadas são definidas aqui para complementar o Tailwind, particularmente para efeitos de transformação 3D usados em componentes como `ProjectCard.tsx`:
    - `.perspective`: Aplica `perspective: 1000px;`
    - `.transform-style`: Aplica `transform-style: preserve-3d;`
    - `.backface-hidden`: Aplica `backface-visibility: hidden;` (Nota: Esta definição de classe está duplicada no arquivo).
    - `.rotate-y-180`: Aplica `transform: rotateY(180deg);`
  - `.no-scrollbar`: Um utilitário para esconder barras de rolagem em elementos.

### 3. Estilos Específicos de Componente (ex: `Login.tsx`)

- **Estilos Encapsulados**: A página `Login.tsx` é um exemplo notável de estilização específica de componente. Ela define suas próprias regras CSS diretamente no arquivo do componente usando uma tag `<style>` (através de um subcomponente `PageStyles`).
- **Abordagem**: Este método é usado para estilos que são únicos e complexos para aquela página específica, incluindo propriedades CSS customizadas para tematizar aquela página, regras de layout intrincadas e animações (como `moveGradient` e `fadeInUp`). Isso mantém a estilização altamente especializada para a página de login separada dos estilos globais ou utilitários Tailwind.

### Fluxo de Trabalho Geral de Estilização

1.  Utilize classes utilitárias do Tailwind CSS para a maioria das necessidades de estilização diretamente nos componentes.
2.  Para sobrescritas de estilo global, estilização de elementos base ou utilitários customizados que são amplamente aplicáveis, modifique `src/index.css`.
3.  Para estilos complexos e únicos de componentes que podem ser trabalhosos de alcançar apenas com Tailwind ou que precisam de controle refinado, considere estilos embutidos como visto em `Login.tsx`, embora isso deva ser usado com moderação para manter a consistência geral do estilo.

## Gerenciamento de Estado

A aplicação atualmente utiliza as funcionalidades de gerenciamento de estado incorporadas ao React para controlar o estado dos componentes e o fluxo de dados.

- **`useState` (Estado Local)**:
  - O hook `useState` do React é usado para gerenciar o estado local dentro dos componentes. Por exemplo:
    - O componente `Header.tsx` usa `useState` para controlar a visibilidade do menu de navegação móvel (aberto/fechado).
    - O hook customizado `useUnsplashImage.ts` usa `useState` para armazenar a URL da imagem buscada.
  - Este é o método predominante para estados que não precisam ser compartilhados globalmente.

- **Props (Propriedades)**:
  - Os dados são passados de componentes pais para componentes filhos através de props.
  - Por exemplo, o componente `ProjectCarousel.tsx` recebe a lista de `projects` como uma prop da página `Home.tsx`. O `ProjectCard.tsx` por sua vez recebe dados de projetos individuais do `ProjectCarousel.tsx`.

- **Dados Hardcoded**:
  - Atualmente, alguns dados são diretamente inseridos no código (hardcoded). Por exemplo, a lista de projetos exibida na página `Home.tsx` é definida como uma constante dentro do próprio arquivo `Home.tsx`.
  - O arquivo `components/projects/useProjects.ts` também contém um array de projetos hardcoded (embora a funcionalidade do hook principal esteja comentada).

- **Ausência de Bibliotecas de Gerenciamento de Estado Externas**:
  - Até o momento, a aplicação não integra bibliotecas de gerenciamento de estado globais mais robustas como Redux, Zustand, Jotai ou Context API do React de forma extensiva para gerenciamento de estado global complexo.
  - A necessidade de tais bibliotecas pode surgir à medida que a aplicação cresce em complexidade e mais estados precisam ser compartilhados entre partes distantes da árvore de componentes.

Em resumo, o gerenciamento de estado é mantido de forma simples, utilizando `useState` para estados locais e props para a comunicação entre componentes. Para dados mais estáticos ou de exemplo, eles são atualmente definidos diretamente no código.

## Interações com API

Esta seção descreve como o frontend interage com APIs externas ou um backend.

- **API do Unsplash (`hooks/useUnsplashImage.ts`)**:
  - A única interação de API atualmente ativa no código é com a API do Unsplash.
  - O hook customizado `useUnsplashImage` busca imagens aleatórias da Unsplash usando o endpoint `https://api.unsplash.com/photos/random`.
  - Ele utiliza a API `fetch` do navegador para realizar a requisição GET.
  - Uma chave de acesso (`ACCESS_KEY`) para a API do Unsplash está hardcoded dentro deste hook. (Lembrete: para produção, chaves de API devem ser gerenciadas de forma segura).

- **Ausência de Interação com API Backend Dedicada**:
  - No estado atual, a aplicação não parece interagir com uma API backend dedicada para suas funcionalidades principais.
  - **Autenticação (`Login.tsx`)**: O formulário de login é uma representação visual e não envia credenciais para um servidor para autenticação.
  - **Dados da Competição (`Home.tsx`)**: Os dados dos projetos e participantes da competição são hardcoded na página `Home.tsx` e não são buscados de um backend.
  - **Ações do Usuário**: Botões como "Veja os competidores" ou "Participe da competição" na página `Home.tsx` não estão atualmente conectados para disparar requisições a uma API.

- **Potenciais Interações Futuras**:
  - Para que a aplicação seja totalmente funcional (além de uma demonstração estática), interações com uma API backend seriam necessárias para:
    - Autenticação de usuários.
    - Cadastro e gerenciamento de participantes e seus portfólios.
    - Sistema de votação.
    - Gerenciamento de rankings.
  - Estas interações provavelmente envolveriam o uso da API `fetch` ou uma biblioteca cliente HTTP (como `axios`, que não está atualmente listada nas dependências do projeto).

Em resumo, as interações com API são limitadas ao hook `useUnsplashImage` para buscar imagens. As funcionalidades centrais da "Competição de Portfólios" ainda não possuem a integração com API backend correspondente.

## Roteamento

A aplicação utiliza a biblioteca `react-router-dom` para gerenciar a navegação do lado do cliente (client-side routing).

- **Configuração Principal (`src/app.tsx`)**:
  - O componente `App` é onde a configuração principal de roteamento é definida.
  - Ele utiliza `BrowserRouter` (geralmente aliasado como `Router`) para envolver a aplicação e habilitar o roteamento baseado em URL de navegador.
  - O componente `Routes` é usado para agrupar múltiplas definições de `Route`.
  - Cada componente `Route` mapeia um caminho de URL (`path`) para um componente de página específico (`element`).

- **Rotas Definidas Atualmente**:
  - `path="/"`: Renderiza o componente `Home` (localizado em `src/pages/Home.tsx`). Esta é a página inicial da aplicação.
  - `path="/login"`: Renderiza o componente `Login` (localizado em `src/pages/Login.tsx`). Esta é a página de autenticação.

- **Componentes de Navegação**:
  - Componentes como `Header.tsx` utilizam o componente `<Link>` do `react-router-dom` para criar links de navegação declarativos. Por exemplo:
    ```tsx
    import { Link } from "react-router-dom";

    // Exemplo de uso no Header.tsx
    <Link to="/">POSTFOLIO</Link>
    <Link to="/ranking">Ranking</Link>
    <Link to="/sobre">Sobre</Link>
    ```

- **Rotas Ausentes (Observação)**:
  - O componente `Header.tsx` inclui links para `/ranking` e `/sobre`. No entanto, rotas correspondentes para estes caminhos não estão atualmente definidas no arquivo `src/app.tsx`.
  - Se um usuário tentar navegar para essas rotas, o `react-router-dom` não encontrará um mapeamento e, por padrão (sem uma rota "catch-all" ou "Not Found"), provavelmente renderizará uma página em branco ou o componente pai mais próximo que não depende da rota. Para uma aplicação completa, seria necessário definir componentes para estas rotas ou uma página "Não Encontrado" (404).

- **Adicionando Novas Rotas**:
  - Para adicionar novas páginas/rotas à aplicação:
    1. Crie o novo componente de página em `src/pages/`.
    2. Importe o componente em `src/app.tsx`.
    3. Adicione um novo elemento `<Route path="/seu-novo-caminho" element={<SeuNovoComponente />} />` dentro do componente `Routes`.

## Build e Deploy

Esta seção descreve como compilar a aplicação para produção e algumas notas sobre o deploy.

### Scripts Disponíveis (`package.json`)

O arquivo `package.json` localizado em `src/front-end/` define os seguintes scripts principais para desenvolvimento, build e preview:

-   **`npm run dev`**:
    -   Comando: `vite`
    -   Propósito: Inicia o servidor de desenvolvimento do Vite. Isso permite desenvolver a aplicação com hot module replacement (HMR) e outras facilidades de desenvolvimento. Geralmente acessível em `http://localhost:5173` (ou uma porta similar).

-   **`npm run build`**:
    -   Comando: `tsc -b && vite build`
    -   Propósito: Cria uma build de produção da aplicação.
        1.  `tsc -b`: Executa o compilador TypeScript para verificar os tipos do projeto. Se houver erros de tipo, a build pode ser interrompida.
        2.  `vite build`: Se a verificação de tipos for bem-sucedida, este comando compila e minimiza os ativos da aplicação (HTML, CSS, JavaScript) para produção.
    -   **Saída**: Por padrão, o Vite colocará os arquivos da build no diretório `src/front-end/dist/`. Este diretório conterá os arquivos estáticos prontos para serem implantados em um servidor web.

-   **`npm run lint`**:
    -   Comando: `eslint .`
    -   Propósito: Executa o ESLint para analisar o código em busca de problemas de linting e estilo, conforme configurado.

-   **`npm run preview`**:
    -   Comando: `vite preview`
    -   Propósito: Inicia um servidor local simples que serve os arquivos da build de produção (do diretório `dist/`). Isso é útil para verificar se a build de produção está funcionando corretamente antes de fazer o deploy.

### Configuração do Vite (`vite.config.ts`)

-   O arquivo `vite.config.ts` contém a configuração para o Vite.
-   **Plugins**: Utiliza `@vitejs/plugin-react` para suporte a projetos React.
-   **Configurações de Build**:
    -   Não há configurações explícitas de `build.outDir` ou `build.base` no `vite.config.ts`. Portanto, o Vite usará seus padrões:
        -   Diretório de Saída (`outDir`): `dist` (dentro de `src/front-end/`).
        -   Caminho Base Público (`base`): `/` (assume que a aplicação será implantada na raiz de um domínio). Se a aplicação for implantada em um subdiretório (ex: `https://example.com/meu-app/`), a opção `base` precisará ser ajustada no `vite.config.ts`.
-   **Configuração do Servidor de Desenvolvimento**:
    -   `server.allowedHosts: true`: Permite que o servidor de desenvolvimento seja acessado por qualquer host. Isso é principalmente para conveniência durante o desenvolvimento e não afeta diretamente a build de produção.

### Processo de Deploy

1.  **Execute a Build**:
    ```bash
    npm run build
    ```
    Isso gerará o diretório `src/front-end/dist/`.

2.  **Implante os Arquivos Estáticos**:
    -   O conteúdo do diretório `src/front-end/dist/` deve ser implantado em um provedor de hospedagem de sites estáticos (como Vercel, Netlify, GitHub Pages, AWS S3, etc.) ou em qualquer servidor web.
    -   Certifique-se de que o servidor esteja configurado para lidar com single-page applications (SPAs) corretamente. Isso geralmente significa que todas as requisições devem ser redirecionadas para o `index.html` principal, permitindo que o `react-router-dom` gerencie as rotas do lado do cliente.

### Considerações Adicionais

-   **Variáveis de Ambiente**: Se a aplicação precisar de variáveis de ambiente diferentes para produção (ex: URLs de API, chaves de serviço), consulte a documentação do Vite sobre como lidar com [Variáveis de Ambiente e Modos](https://vitejs.dev/guide/env-and-mode.html). Atualmente, a chave da API do Unsplash está hardcoded, o que não é recomendado para produção.
-   **Roteamento em Subdiretório**: Se implantar em um subdiretório, lembre-se de configurar a opção `base` no `vite.config.ts`.
