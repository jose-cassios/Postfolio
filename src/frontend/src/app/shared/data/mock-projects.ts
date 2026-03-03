import { Project } from "../models/project";

export const FEATURED_PROJECTS: Project[] = [

  {
    id: '1',
    title: 'Dashboard de Analytics Moderno',
    slug: 'dashboard-analytics-moderno',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    likes: 245,
    views: 1820,
    category: 'web-design',
    technologies: ['Angular', 'Chart.js', 'Figma'],
    commentsCount: 18,
    author: {
      name: 'Marcos Silva',
      username: 'marcosdev',
      avatar: 'https://i.pravatar.cc/150?img=11'
    }
  },

  {
    id: '2',
    title: 'E-commerce de Moda Sustentável',
    slug: 'ecommerce-moda-sustentavel',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80',
    likes: 189,
    views: 1340,
    category: 'web-design',
    technologies: ['Next.js', 'Stripe'],
    commentsCount: 12,
    author: {
      name: 'Juliana Rocha',
      username: 'juux',
      avatar: 'https://i.pravatar.cc/150?img=32'
    }
  },

  {
    id: '3',
    title: 'Concept Art - Guerreira Élfica',
    slug: 'concept-art-guerreira-elfica',
    imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=900&q=80',
    likes: 421,
    views: 3250,
    category: 'ilustracao',
    technologies: ['Procreate', 'Photoshop'],
    commentsCount: 34,
    author: {
      name: 'Rafael Lima',
      username: 'rafart',
      avatar: 'https://i.pravatar.cc/150?img=45'
    }
  },

  {
    id: '4',
    title: 'Branding Minimalista para Startup',
    slug: 'branding-minimalista-startup',
    imageUrl: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=900&q=80',
    likes: 178,
    views: 980,
    category: 'branding',
    technologies: ['Illustrator', 'Figma'],
    commentsCount: 6,
    author: {
      name: 'Camila Duarte',
      username: 'camidesign',
      avatar: 'https://i.pravatar.cc/150?img=21'
    }
  },

  {
    id: '5',
    title: 'App Mobile - Finanças Pessoais',
    slug: 'app-financas-pessoais',
    imageUrl: 'https://www.capela.com.br/capela/wp-content/uploads/2019/07/apps-mobile-smartphone-ss-1920-800x450-800x370.jpg',
    likes: 312,
    views: 2450,
    category: 'desenvolvimento',
    technologies: ['Flutter', 'Firebase'],
    commentsCount: 22,
    author: {
      name: 'Lucas Andrade',
      username: 'lucode',
      avatar: 'https://i.pravatar.cc/150?img=9'
    }
  },

  {
    id: '6',
    title: 'UI Kit Neon Dark Mode',
    slug: 'ui-kit-neon-dark-mode',
    imageUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80',
    likes: 256,
    views: 1670,
    category: 'ui-ux',
    technologies: ['Figma'],
    commentsCount: 15,
    author: {
      name: 'Ana Beatriz',
      username: 'anaux',
      avatar: 'https://i.pravatar.cc/150?img=48'
    }
  },

  {
    id: '7',
    title: 'Fotografia Urbana Noturna',
    slug: 'fotografia-urbana-noturna',
    imageUrl: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80',
    likes: 367,
    views: 2890,
    category: 'fotografia',
    technologies: ['Lightroom'],
    commentsCount: 19,
    author: {
      name: 'Pedro Mendes',
      username: 'pmfoto',
      avatar: 'https://i.pravatar.cc/150?img=14'
    }
  },

  {
    id: '8',
    title: 'Arquitetura Residencial Moderna',
    slug: 'arquitetura-residencial-moderna',
    imageUrl: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=900&q=80',
    likes: 298,
    views: 2210,
    category: 'arquitetura',
    technologies: ['AutoCAD', 'SketchUp'],
    commentsCount: 11,
    author: {
      name: 'Fernanda Costa',
      username: 'ferarq',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  },

  {
    id: '9',
    title: 'Jogo Indie 2D - Pixel Adventure',
    slug: 'jogo-indie-pixel-adventure',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
    likes: 489,
    views: 4100,
    category: 'jogos',
    technologies: ['Unity', 'C#'],
    commentsCount: 41,
    author: {
      name: 'Thiago Nunes',
      username: 'thigames',
      avatar: 'https://i.pravatar.cc/150?img=19'
    }
  },

  {
    id: '10',
    title: 'Motion Graphics - Intro Animada',
    slug: 'motion-graphics-intro-animada',
    imageUrl: 'https://www.capela.com.br/capela/wp-content/uploads/2018/08/top1.png',
    likes: 223,
    views: 1540,
    category: 'motion',
    technologies: ['After Effects'],
    commentsCount: 8,
    author: {
      name: 'Bruno Oliveira',
      username: 'brunomotion',
      avatar: 'https://i.pravatar.cc/150?img=27'
    }
  }
];