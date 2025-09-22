import { JSX } from "react";
import { Link } from "react-router-dom";

type NavLinkItem = {
  label: string;
  path: string;
  icon?: JSX.Element;
};

interface DesktopNavigationProps {
  navLinks: NavLinkItem[];
}

export default function DesktopNavigation({ navLinks }: DesktopNavigationProps) {
  return (
    <nav className="hidden md:flex items-center">
      <ul className="flex gap-6 lg:gap-8 font-medium text-blue-100">
        {navLinks.map(({ label, path }) => (
          <li key={path}>
            <Link
              to={`/${path}`}
              className="hover:text-indigo-300 text-blue-200 transition-colors duration-200 text-sm lg:text-base"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
