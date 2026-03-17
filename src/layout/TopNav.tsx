import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const TopNav = ({ onMenuOpen }: { onMenuOpen: () => void }) => {
  return (
    <div className="fixed top-0 right-0 left-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
      <NavLink to="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-green-500 to-green-700 shadow-md">
          <span className="text-lg font-bold text-white">T</span>
        </div>
        <span className="text-base font-semibold text-gray-900">Talimuddin</span>
      </NavLink>
      <button
        onClick={onMenuOpen}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
        aria-label="Open navigation menu"
      >
        <FaBars className="h-5 w-5" />
      </button>
    </div>
  );
};

export default TopNav;
