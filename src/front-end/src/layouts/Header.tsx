import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiAward,
  FiInfo,
  FiMail,
  FiGithub,
  FiInstagram,
} from "react-icons/fi";
import { createPortal } from "react-dom";

const navLinks = [
  {
    label: "Competição",
    path: "competicao",
    icon: <FiAward className="mr-3 text-lg text-blue-300" />,
  },
  {
    label: "Sobre",
    path: "sobre",
    icon: <FiInfo className="mr-3 text-lg text-indigo-200" />,
  },
  {
    label: "Contato",
    path: "contato",
    icon: <FiMail className="mr-3 text-lg text-blue-200" />,
  },
];

function MobileMenu({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if ((e.target as HTMLElement).id === "mobile-menu-overlay") {
      setMenuOpen(false);
    }
  };

  if (!menuOpen) return null;

  return createPortal(
    <div
      id="mobile-menu-overlay"
      className="fixed inset-0 z-[9999] bg-black/60 flex"
      onClick={handleOverlayClick}
    >
      <div
        className="
          relative ml-auto w-4/5 max-w-xs h-full
          bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900
          rounded-l-3xl shadow-2xl
          flex flex-col items-center pt-12 pb-4 px-6
          animate-slide-in
          border-l-4 border-blue-800
        "
        style={{
          boxShadow: "0 0 40px 0 rgba(40,80,180,0.12)",
        }}
      >
        {/* Botão de fechar */}
        <button
          className="absolute top-4 right-4 text-4xl text-blue-200 hover:text-indigo-300 p-2 rounded-full transition"
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar Menu"
        >
          <FiX />
        </button>
        {/* Links do menu */}
        <div className="flex flex-col w-full gap-2 mt-8">
          {navLinks.map(({ label, path, icon }) => (
            <Link
              key={path}
              to={`/${path}`}
              className="flex items-center w-full text-xl font-semibold py-3 px-4 rounded-lg text-blue-100 hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-900 hover:text-white transition"
              onClick={() => setMenuOpen(false)}
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>
        {/* Botões de login/cadastro dentro do menu lateral */}
        <div className="flex flex-col w-full gap-4 mt-8">
          <Link
            to="/login"
            className="w-full text-center px-4 py-2 rounded-full bg-transparent border-2 border-blue-400 text-blue-100 font-medium shadow hover:border-white hover:bg-blue-800 transition"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="w-full text-center px-4 py-2 rounded-full bg-blue-700 border-2 border-blue-700 text-white font-medium shadow hover:bg-blue-800 transition"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
        {/* Informações extras no rodapé */}
        <div className="mt-auto w-full flex flex-col items-center gap-2 pt-8 border-t border-blue-900">
          <span className="text-xs text-blue-300">
            © {new Date().getFullYear()} Postfolio
          </span>
          <span className="text-xs text-indigo-200">
            Integrando experiências e conhecimentos
          </span>
          <div className="flex gap-4 mt-2">
            <a
              href="https://github.com/seuusuario"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white text-xl transition"
            >
              <FiGithub />
            </a>
            <a
              href="https://instagram.com/seuusuario"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-white text-xl transition"
            >
              <FiInstagram />
            </a>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in {
            animation: slideIn 0.3s cubic-bezier(0.4,0,0.2,1);
          }
        `}
      </style>
    </div>,
    document.body
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-5 py-3 bg-gradient-to-b from-dark-blue/90 to-transparent shadow-lg z-50 backdrop-blur-md">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 drop-shadow-lg select-none"
          style={{ letterSpacing: "2px" }}
        >
          Postfolio
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          <ul className="flex gap-8 font-medium text-blue-100">
            {navLinks.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={`/${path}`}
                  className="hover:text-blue-400 text-blue-200 transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop botões */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="px-7 py-1 rounded-full bg-transparent border-blue-400 border-opacity-30 hover:border-white hover:border-opacity-55 border-2 text-blue-100 font-medium shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-7 py-1 rounded-full bg-blue-700 border-blue-700 border-2 text-white font-medium shadow-md hover:bg-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Sign Up
          </Link>
        </div>

        {/* Botão do menu mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button
            className="text-blue-200 text-3xl ml-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir Menu"
          >
            <FiMenu />
          </button>
        </div>
      </header>

      {/* Menu lateral mobile via Portal */}
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
}
