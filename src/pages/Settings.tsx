import { FaSignOutAlt } from "react-icons/fa";
import { authHooks } from "../hooks/useAuth";

const Settings = () => {
  const { mutate: logout } = authHooks.useLogout();
  const handleSignOut = () => {
    logout();
  };

  return (
    <>
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Logout Section */}
      <div className="w-fit rounded-lg bg-white p-5 shadow-sm">
        <button
          onClick={handleSignOut}
          className="flex w-fit cursor-pointer items-center space-x-3 rounded-lg bg-red-50 px-4 py-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
        >
          <FaSignOutAlt />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );
};

export default Settings;
