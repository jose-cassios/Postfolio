import { useRef, useEffect, useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiBriefcase,
  FiPlusCircle,
  FiLogOut,
} from "react-icons/fi";

interface User {
  username: string;
  name: string;
  email: string | ReactNode;
  photo?: string;
  userType: string;
}

interface UserDropdownProps {
  user: User;
  handleLogout: () => void;
  handleToggleUserType: () => void;
}

export default function UserDropdown({
  user,
  handleLogout,
  handleToggleUserType,
}: UserDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const profilePath = user.username.toLowerCase().replace(/\s/g, "");

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="dropdownAvatarNameButton"
        className="flex items-center text-sm pe-1 font-medium text-blue-100 rounded-full hover:text-indigo-300 focus:ring-4 focus:ring-blue-300/30 transition"
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="sr-only">Open user menu</span>
        {user.photo ? (
          <img
            className="w-9 h-9 me-2 rounded-full border-2 border-indigo-400 object-cover"
            src={`/${user.photo}`}
            alt={user.name}
          />
        ) : (
          <div className="w-9 h-9 me-2 rounded-full bg-indigo-700 flex items-center justify-center text-white text-xl">
            <FiUser />
          </div>
        )}
        {user.name}
        <svg
          className={`w-2.5 h-2.5 ms-3 transition-transform ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <div
        id="dropdownAvatarName"
        className={`absolute right-0 mt-2 z-10 bg-indigo-900/95 divide-y divide-indigo-800 rounded-lg shadow-xl w-52 backdrop-blur-md transition-all duration-200 ease-out transform ${
          dropdownOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 text-sm text-white">
          <div className="font-bold text-base">{user.name}</div>
          <div className="truncate text-indigo-200">{user.email}</div>
        </div>
        <ul className="py-2 text-sm text-indigo-100">
          <li>
            <Link
              to={`/profile/${profilePath}`}
              className="flex items-center px-4 py-2 hover:bg-indigo-700 hover:text-white transition"
              onClick={() => setDropdownOpen(false)}
            >
              <FiUser className="mr-2" /> Ver Perfil
            </Link>
          </li>
          <li>
            {user.userType === "contractor" ? (
              <button
                onClick={() => {
                  handleToggleUserType();
                  setDropdownOpen(false);
                }}
                className="flex items-center w-full text-left px-4 py-2 hover:bg-purple-700 hover:text-white transition"
              >
                <FiBriefcase className="mr-2" /> Trocar para Freelancer
              </button>
            ) : (
              <button
                onClick={() => {
                  handleToggleUserType();
                  setDropdownOpen(false);
                }}
                className="flex items-center w-full text-left px-4 py-2 hover:bg-green-700 hover:text-white transition"
              >
                <FiPlusCircle className="mr-2" /> Trocar para Contratante
              </button>
            )}
          </li>
        </ul>
        <div className="py-2">
          <button
            onClick={() => {
              handleLogout();
              setDropdownOpen(false);
            }}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-200 hover:bg-red-700 hover:text-white transition"
          >
            <FiLogOut className="mr-2" /> Sair
          </button>
        </div>
      </div>
    </div>
  );
}
