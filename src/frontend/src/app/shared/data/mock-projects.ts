import { ProjectDetails } from "../models/project-details";

type LegacyMockProject = Omit<
  ProjectDetails,
  'feedbackAspects' | 'feedbackQuestion' | 'currentVersion' | 'postmarks' | 'versions'
>;

const LEGACY_FEATURED_PROJECTS: LegacyMockProject[] = [

  {
    id: '1',
    title: 'Dashboard de Analytics Moderno Atualizado Com as melhores práticas do mercado texto exageradamente grande',
    slug: 'dashboard-analytics-moderno',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',

    likes: 2245,
    views: 10000,
    commentsCount: 1088,
    postmarksCount: 845,
    saves: 302,

    category: 'web-design',
    technologies: ['Angular', 'Chart.js', 'Figma', 'React'],
    tags: ['dashboard', 'analytics', 'ui', 'enterprise'],

    createdAt: new Date('2025-02-15'),

    description: `
    Este projeto apresenta um dashboard completo com métricas em tempo real,
    visualizações interativas e arquitetura escalável.
    Foco total em performance e usabilidade.
    `,

    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80'
    ],

    author: {
      name: 'José Cássios',
      username: 'jose-cassios',
      avatar: 'https://i.pravatar.cc/150?img=11',
      bio: 'Desenvolvedor fullstack, profissional em angular e entusiasta de novas tecnologias.'
    },
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    publishedAt: "2005 03 15"
  },

  {
    id: '2',
    title: 'E-commerce de Moda Sustentável',
    slug: 'ecommerce-moda-sustentavel',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80',

    likes: 189,
    views: 1340,
    commentsCount: 12,
    postmarksCount: 72,
    saves: 41,

    category: 'web-design',
    technologies: ['Next.js', 'Stripe'],
    tags: ['ecommerce', 'moda', 'sustentável'],

    createdAt: new Date('2025-01-20'),

    description: `
    Plataforma completa de e-commerce focada em marcas sustentáveis.
    Checkout otimizado e integração com Stripe.
    `,

    gallery: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80'
    ],

    author: {
      name: 'Debriane Silva',
      username: 'jujuba',
      avatar: 'https://i.pravatar.cc/150?img=32',
      bio: 'Leitora profissional de livros de romance'
    },
    coverImageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80',
    publishedAt: "1997 05 14"
  },

  {
    id: '3',
    title: 'Concept Art - Guerreira Élfica',
    slug: 'concept-art-guerreira-elfica',
    imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=900&q=80',
    likes: 421,
    views: 3200,
    commentsCount: 34,
    postmarksCount: 15,
    saves: 41,

    category: 'ilustracao',
    technologies: ['Procreate', 'Photoshop'],
    tags: ['ecommerce', 'moda', 'sustentável'],

    createdAt: new Date('2025-01-20'),

    description: `
      Design temático completo desenvolvido com photoshop.
    `,

    gallery: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80'
    ],

    author: {
      name: 'Lara Manuelly',
      username: 'laranja',
      avatar: 'https://i.pravatar.cc/150?img=45',
      bio: 'CEO visionária e advogada dedicada, para impulsionar o sucesso do seu negócio. Com liderança estratégica, profundo conhecimento jurídico e foco em resultados.'
    },
    coverImageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=900&q=80',
    publishedAt: "1997 05 14"
  },

  {
    id: '4',
    title: 'Branding Minimalista para Startup',
    slug: 'branding-minimalista-startup',
    imageUrl: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=900&q=80',
    likes: 178,
    views: 980,
    commentsCount: 6,
    postmarksCount: 15,
    saves: 41,

    category: 'branding',
    technologies: ['Illustrator', 'Figma'],
    tags: ['ecommerce', 'moda', 'sustentável'],

    createdAt: new Date('2025-01-20'),

    description: `
      Design temático completo desenvolvido com photoshop.
    `,

    gallery: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80'
    ],

    author: {
      name: 'Ávila conceica',
      username: 'Havilah',
      avatar: 'https://i.pravatar.cc/150?img=21',
      bio: 'Mulher que programa'
    },

    coverImageUrl: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=900&q=80',
    publishedAt: "1997 05 14"
  },

  {
    id: '5',
    title: 'App Mobile - Finanças Pessoais',
    slug: 'app-financas-pessoais',
    imageUrl: 'https://www.capela.com.br/capela/wp-content/uploads/2019/07/apps-mobile-smartphone-ss-1920-800x450-800x370.jpg',
    likes: 312,
    views: 2450,
    commentsCount: 22,
    postmarksCount: 85,
    saves: 120,

    category: 'desenvolvimento',
    technologies: ['Flutter', 'Firebase'],
    tags: ['fintech', 'mobile', 'produtividade'],

    createdAt: new Date('2025-02-10'),

    description: `
      Aplicativo focado em controle de gastos e investimentos com sincronização em tempo real e gráficos interativos.
    `,

    gallery: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80'
    ],

    author: {
      name: 'Antonio Wills',
      username: 'aws',
      avatar: 'https://i.pravatar.cc/150?img=9',
      bio: 'Desenvolvedor Fullstack apaixonado por soluções mobile.'
    },

    coverImageUrl: 'https://www.capela.com.br/capela/wp-content/uploads/2019/07/apps-mobile-smartphone-ss-1920-800x450-800x370.jpg',
    publishedAt: "2024 11 15"
  },

  {
    id: '6',
    title: 'UI Kit Neon Dark Mode',
    slug: 'ui-kit-neon-dark-mode',
    imageUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80',
    likes: 256,
    views: 1670,
    commentsCount: 15,
    postmarksCount: 92,
    saves: 210,

    category: 'ui-ux',
    technologies: ['Figma'],
    tags: ['darkmode', 'neon', 'interface'],

    createdAt: new Date('2025-01-05'),

    description: `
      Kit de interface moderno com estética neon, ideal para dashboards futuristas e aplicativos de gaming.
    `,

    gallery: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80'
    ],

    author: {
      name: 'Loyse Kelly',
      username: 'morena',
      avatar: 'https://i.pravatar.cc/150?img=48',
      bio: 'UI Designer focada em experiências imersivas e interfaces futuristas.'
    },

    coverImageUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80',
    publishedAt: "2023 08 22"
  },

  {
    id: '7',
    title: 'Fotografia Urbana Noturna',
    slug: 'fotografia-urbana-noturna',
    imageUrl: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80',
    likes: 367,
    views: 2890,
    commentsCount: 19,
    postmarksCount: 150,
    saves: 88,

    category: 'fotografia',
    technologies: ['Lightroom'],
    tags: ['cityscape', 'night', 'streetphotography'],

    createdAt: new Date('2024-12-15'),

    description: `
      Série de fotografias explorando o jogo de luzes e sombras nas metrópoles durante a madrugada.
    `,

    gallery: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80'
    ],

    author: {
      name: 'Jonas nogueira',
      username: 'davi',
      avatar: 'https://i.pravatar.cc/150?img=14',
      bio: 'Explorador urbano capturando a essência das cidades através das lentes.'
    },

    coverImageUrl: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80',
    publishedAt: "2022 12 01"
  },

  {
    id: '8',
    title: 'Arquitetura Residencial Moderna',
    slug: 'arquitetura-residencial-moderna',
    imageUrl: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=900&q=80',
    likes: 298,
    views: 2210,
    commentsCount: 11,
    postmarksCount: 67,
    saves: 145,

    category: 'arquitetura',
    technologies: ['AutoCAD', 'SketchUp'],
    tags: ['minimalismo', 'sustentabilidade', 'concreto'],

    createdAt: new Date('2025-02-28'),

    description: `
      Projeto de residência unifamiliar focado em integração com a natureza e uso de materiais brutos.
    `,

    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
    ],

    author: {
      name: 'Mickaela',
      username: 'micka',
      avatar: 'https://i.pravatar.cc/150?img=5',
      bio: 'Arquiteta minimalista transformando espaços em experiências de vida.'
    },

    coverImageUrl: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=900&q=80',
    publishedAt: "2021 03 10"
  },

  {
    id: '9',
    title: 'Jogo Indie 2D - Pixel Adventure',
    slug: 'jogo-indie-pixel-adventure',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
    likes: 489,
    views: 4100,
    commentsCount: 41,
    postmarksCount: 210,
    saves: 330,

    category: 'jogos',
    technologies: ['Unity', 'C#'],
    tags: ['pixelart', 'indie', 'plataforma'],

    createdAt: new Date('2025-01-10'),

    description: `
      Aventura épica em 16-bits com mecânicas de combate fluidas e trilha sonora original.
    `,

    gallery: [
      'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=900&q=80'
    ],

    author: {
      name: 'Wilma',
      username: 'wilma',
      avatar: 'https://i.pravatar.cc/150?img=19',
      bio: 'Game developer apaixonada por nostalgia e mecânicas retrô.'
    },

    coverImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
    publishedAt: "2024 06 30"
  },

  {
    id: '10',
    title: 'Motion Graphics - Intro Animada',
    slug: 'motion-graphics-intro-animada',
    imageUrl: 'https://www.capela.com.br/capela/wp-content/uploads/2018/08/top1.png',
    likes: 223,
    views: 1540,
    commentsCount: 8,
    postmarksCount: 45,
    saves: 72,

    category: 'motion',
    technologies: ['After Effects'],
    tags: ['animacao', 'branding', 'vfx'],

    createdAt: new Date('2025-02-15'),

    description: `
      Vinheta de abertura dinâmica para canais de tecnologia, utilizando transições orgânicas e texturas 3D.
    `,

    gallery: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80'
    ],

    author: {
      name: 'Lucas Eduardo',
      username: 'brunomotion',
      avatar: 'https://i.pravatar.cc/150?img=27',
      bio: 'Especialista em dar vida a marcas através do movimento.'
    },

    coverImageUrl: 'https://www.capela.com.br/capela/wp-content/uploads/2018/08/top1.png',
    publishedAt: "2023 10 12"
  }
];

export const FEATURED_PROJECTS: ProjectDetails[] = LEGACY_FEATURED_PROJECTS.map(
  (project) => ({
    ...project,
    feedbackAspects: [],
    feedbackQuestion: null,
    currentVersion: 1,
    postmarks: [],
    versions: [],
  }),
);
