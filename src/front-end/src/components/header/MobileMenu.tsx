import { JSX, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiX,
  FiUser,
  FiGithub,
  FiInstagram,
  FiAward,
  FiInfo,
  FiHome,
} from "react-icons/fi";
import { createPortal } from "react-dom";

type NavLinkItem = {
  label: string;
  path: string;
  icon: JSX.Element;
};

const defaultNavLinks: NavLinkItem[] = [
  {
    label: "Home",
    path: "",
    icon: <FiHome className="mr-3 text-lg text-green-300" />,
  },
  {
    label: "Competição",
    path: "competicao",
    icon: <FiAward className="mr-3 text-lg text-blue-300" />,
  },
  {
    label: "Sobre",
    path: "about-us",
    icon: <FiInfo className="mr-3 text-lg text-indigo-200" />,
  },
];

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  user: {
    email: ReactNode;
    name: string;
    photo?: string;
    userType: string;
    username?: string;
  } | null;
  handleLogout: () => void;
  handleToggleUserType: () => void;
  navLinks?: NavLinkItem[];
}

export default function MobileMenu({
  menuOpen,
  setMenuOpen,
  isLoggedIn,
  user,
  handleLogout,
  handleToggleUserType,
  navLinks = defaultNavLinks,
}: MobileMenuProps) {
  const navigate = useNavigate();

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

        {isLoggedIn && user ? (
          <div className="w-full mb-6 px-2 text-center">
            {user.photo ? (
              <img
                className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-indigo-400 object-cover"
                src={`/${user.photo}`}
                alt={user.name}
              />
            ) : (
              <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center bg-indigo-700 text-white text-4xl">
                <FiUser />
              </div>
            )}
            <div className="font-medium text-lg text-white mb-1">
              {user.name}
            </div>
            <div className="truncate text-sm text-indigo-200 mb-4">
              {user.email}
            </div>
            <button
              onClick={() => {
                setMenuOpen(false);
                const profilePath = user.username
                  ? user.username.toLowerCase().replace(/\s/g, "")
                  : user.name.toLowerCase().replace(/\s/g, "");
                navigate(`/profile/${profilePath}`);
              }}
              className="w-full px-4 py-3 rounded-lg bg-indigo-700 text-white font-semibold shadow hover:bg-indigo-800 transition mb-3"
            >
              Ver Perfil
            </button>
            {user.userType === "contractor" ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleToggleUserType();
                }}
                className="w-full px-4 py-3 rounded-lg bg-purple-700 text-white font-semibold shadow hover:bg-purple-800 transition mb-3"
              >
                Trocar para Freelancer
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleToggleUserType();
                }}
                className="w-full px-4 py-3 rounded-lg bg-green-700 text-white font-semibold shadow hover:bg-green-800 transition mb-3"
              >
                Trocar para Contratante
              </button>
            )}
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="w-full px-4 py-3 rounded-lg bg-transparent border border-red-300 text-red-200 hover:bg-red-600 hover:text-white transition"
            >
              Sair
            </button>
          </div>
        ) : (
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
        )}

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
              href="https://github.com/jose-cassios"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white text-xl transition"
            >
              <FiGithub />
            </a>
            <a
              href="https://instagram.com/jose-cassios"
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
