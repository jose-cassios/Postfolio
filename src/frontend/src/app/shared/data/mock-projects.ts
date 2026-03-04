import { ProjectDetails } from "../models/project-details";

export const FEATURED_PROJECTS: ProjectDetails[] = [

  {
    id: '1',
    title: 'Dashboard de Analytics Moderno Atualizado Com as melhores práticas do mercado texto exageradamente grande',
    slug: 'dashboard-analytics-moderno',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',

    likes: 2245,
    views: 10000,
    commentsCount: 1088,
    appreciates: 845,
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
    appreciates: 72,
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
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    publishedAt: "1997 05 14"
  },

];