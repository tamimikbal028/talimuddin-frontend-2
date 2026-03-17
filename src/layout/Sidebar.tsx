import { NavLink, useLocation } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaSchool,
  FaDoorOpen,
  FaNewspaper,
} from "react-icons/fa";
import { authHooks } from "../hooks/useAuth";
import { DEFAULT_POTRIKA_ID } from "../constants/potrika";

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();
  const { user, isAppAdmin } = authHooks.useUser();

  // Dynamic profile path - uses username
  const profilePath = user?.userName ? `/profile/${user.userName}` : "/profile";

  const navigationItems: {
    icon: React.ElementType;
    label: string;
    path: string;
    display: boolean;
    active: boolean;
  }[] = [
    {
      icon: FaSchool,
      label: "My Branch",
      path: "/branch",
      display: !isAppAdmin,
      active: location.pathname === "/branch",
    },
    {
      icon: FaDoorOpen,
      label: "All Branches (Admin)",
      path: "/branch/all",
      display: true,
      active: location.pathname === "/branch/all",
    },
    {
      icon: FaNewspaper,
      label: "Al-Kawsar",
      path: `/potrika/${DEFAULT_POTRIKA_ID}`,
      display: true,
      active: location.pathname.startsWith("/potrika"),
    },

    {
      icon: FaCog,
      label: "Settings",
      path: "/settings",
      display: true,
      active: location.pathname.startsWith("/settings"),
    },
  ];

  return (
    <div className="flex h-full flex-col space-y-1 p-3">
      {/* Logo/Brand + Close button (mobile drawer) */}
      <div className="flex items-center justify-between border-b border-gray-300 px-2 pb-3">
        <NavLink to="/" onClick={onClose} className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-green-500 to-green-700 shadow-md">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-900">
              Talimuddin
            </span>
            <span className="text-sm text-gray-500">Connect & Learn</span>
          </div>
        </NavLink>
      </div>

      {/* Navigation Menu */}
      <div className="hide-scrollbar flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {navigationItems.map((item, index) => {
            if (!item.display) {
              return null;
            }
            return (
              <NavLink
                key={index}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                  item.active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-100 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors ${
                      item.active
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-gray-900"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Profile & Logout Section */}
      <div className="border-t border-gray-300 pt-3">
        <div className="flex items-center gap-2">
          <NavLink
            to={profilePath}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex flex-1 items-center rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <FaUser className="mr-3 h-5 w-5" />
            <span>Profile</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
