import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";

const allProjects = [
  {
    id: 1,
    projectTitle: "Dashboard de Vendas",
    projectImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    authorName: "Cassios",
    authorProfile: "/profile/cassios",
    authorImage: "cassios.png",
    description: "Dashboard interativo para análise de vendas com gráficos e métricas em tempo real.",
    category: "backend"
  },
  {
    id: 2,
    projectTitle: "Landing Page Criativa",
    projectImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    authorName: "Mickaela",
    authorProfile: "/profile/mickaela",
    authorImage: "micka.png",
    description: "Landing page responsiva, com design moderno, animações sutis e foco em conversão para campanhas de marketing digital e lançamentos de produtos.",
    category: "frontend"
  },
  {
    id: 3,
    projectTitle: "Blog de Resenhas",
    projectImage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    authorName: "Debriane",
    authorProfile: "/profile/debriane",
    authorImage: "debriane.png",
    description: "Blog colaborativo para resenhas de livros, filmes e séries, com sistema de comentários, avaliações e integração com redes sociais.",
    category: "frontend"
  },
  {
    id: 4,
    projectTitle: "API de Integração",
    projectImage: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    authorName: "Juan Pablo",
    authorProfile: "/profile/juanpablo",
    authorImage: "juan.png",
    description: "API RESTful robusta para integração entre sistemas, com autenticação JWT, documentação Swagger e testes automatizados.",
    category: "backend"
  },
  {
    id: 5,
    projectTitle: "Sistema de Gestão",
    projectImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80",
    authorName: "Jonas Davi",
    authorProfile: "/profile/jonasdavi",
    authorImage: "jonas.png",
    description: "Sistema completo de gestão empresarial, incluindo módulos de estoque, financeiro, RH e relatórios customizáveis.",
    category: "gestao"
  },
  {
    id: 6,
    projectTitle: "Portal Jurídico",
    projectImage: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80",
    authorName: "Lara Emanuelly",
    authorProfile: "/profile/laraemanuely",
    authorImage: "lara.png",
    description: "Portal para escritórios de advocacia, com área do cliente, upload seguro de documentos e agenda de audiências integrada.",
    category: "frontend"
  },
  {
    id: 7,
    projectTitle: "App de Saúde",
    projectImage: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    authorName: "Randeson",
    authorProfile: "/profile/randerson",
    authorImage: "https://randomuser.me/api/portraits/men/45.jpg",
    description: "Aplicativo mobile para acompanhamento de saúde, agendamento de consultas, controle de medicamentos e notificações personalizadas.",
    category: "mobile"
  },
  {
    id: 8,
    projectTitle: "Portfólio Ilustrado",
    projectImage: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    authorName: "Loyse",
    authorProfile: "/profile/loyse",
    authorImage: "https://randomuser.me/api/portraits/women/62.jpg",
    description: "Portfólio visual para designers e ilustradores, com galerias de imagens, animações e integração com Behance e Dribbble.",
    category: "design"
  },
  {
    id: 9,
    projectTitle: "E-commerce",
    projectImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
    authorName: "Antonio",
    authorProfile: "/profile/antonio",
    authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
    description: "Loja virtual moderna, com carrinho de compras, checkout seguro, painel de administração e integração com meios de pagamento.",
    category: "frontend"
  },
];

const filters = [
  { label: "Todos", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Design", value: "design" },
  { label: "Mobile", value: "mobile" },
  { label: "Gestão", value: "gestao" },
];

const orders = [
  { label: "Mais recentes", value: "recent" },
  { label: "Mais vistos", value: "views" },
  { label: "A-Z", value: "az" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState("recent");
  const [visible, setVisible] = useState(6);

  let filtered = allProjects.filter((p) =>
    (filter === "all" || p.category === filter) &&
    (
      p.authorName.toLowerCase().includes(search.toLowerCase()) ||
      p.projectTitle.toLowerCase().includes(search.toLowerCase())
    )
  );
  if (order === "views") filtered = [...filtered];
  if (order === "az") filtered = [...filtered].sort((a, b) => a.projectTitle.localeCompare(b.projectTitle));

  return (
    <div className="bg-pattern bg-no-repeat bg-top bg-cover min-h-screen">
      <Header />
      {/* HERO */}
      <section className="w-full flex flex-col items-center justify-center pt-28 pb-10 px-4">
        <div className="max-w-2xl w-full flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 drop-shadow-lg">
            Conecte-se com talentos, inspire-se com projetos reais
          </h1>
          <p className="text-lg md:text-xl text-blue-100 font-light mt-2 mb-4">
            Descubra portfólios de profissionais de diversas áreas de tecnologia, design e inovação. Encontre inspiração, faça networking e acompanhe as tendências do mercado.
          </p>
        </div>
      </section>

      {/* EXPLORAR PORTFÓLIOS */}
      <section className="w-full flex flex-col items-center bg-transparent px-4 pt-2 pb-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-100 mb-8">Explorar Portfólios</h2>
        {/* Inputs de busca, filtro e ordenação */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 w-full max-w-4xl">
          <input
            type="text"
            placeholder="Procurar Portfólio"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-indigo-900/80 border border-indigo-700 text-blue-100 placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-indigo-900/80 border border-indigo-700 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            {filters.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={order}
            onChange={e => setOrder(e.target.value)}
            className="px-4 py-2 rounded-lg bg-indigo-900/80 border border-indigo-700 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            {orders.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Grid de projetos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {filtered.slice(0, visible).map((project) => (
            <Link
              key={project.id}
              to={project.authorProfile}
              className="block bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 border border-blue-800 rounded-2xl shadow-lg p-5 transition hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={project.projectImage}
                alt={project.projectTitle}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
              <h3 className="text-lg font-bold text-blue-100 mb-2">{project.projectTitle}</h3>
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={project.authorImage}
                  alt={project.authorName}
                  className="w-9 h-9 rounded-full border-2 border-indigo-700"
                />
                <span className="text-sm text-indigo-200 font-medium">{project.authorName}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Botão de carregar mais */}
        {visible < filtered.length && (
          <button
            onClick={() => setVisible(v => v + 6)}
            className="mt-10 px-8 py-2 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-semibold shadow-lg hover:brightness-110 transition"
          >
            Load More
          </button>
        )}
      </section>
    </div>
  );
}