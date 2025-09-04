import { Link } from "react-router-dom";
import { FiMessageSquare, FiBell } from "react-icons/fi";

interface ActionIconsProps {
  notificationCount?: number;
}

export default function ActionIcons({ notificationCount = 3 }: ActionIconsProps) {
  return (
    <>
      <Link
        to="/messages"
        className="text-blue-200 hover:text-indigo-300 transition-colors"
        title="Mensagens"
      >
        <FiMessageSquare size={22} />
      </Link>
      <button
        className="relative text-blue-200 hover:text-indigo-300 transition-colors"
        title="Notificações"
      >
        <FiBell size={22} />
        {notificationCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
            {notificationCount}
          </span>
        )}
      </button>
    </>
  );
}
