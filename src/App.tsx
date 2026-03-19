import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Sidebar from "./layout/Sidebar";
import MainContent from "./layout/MainContent";
import TopNav from "./layout/TopNav";
import { authHooks, AUTH_KEYS } from "./hooks/useAuth";

const App = () => {
  const queryClient = useQueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { isCheckingAuth, isAuthenticated } = authHooks.useUser();

  // Global logout event listener
  // Axios interceptor fires this when all tokens expire
  useEffect(() => {
    const handleLogout = () => {
      console.log("Global logout event received");
      // Clear user data in cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, null);
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [queryClient]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center text-2xl font-semibold text-gray-600 sm:text-5xl">
        Checking Authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <MainContent />;
  }

  return (
    <>
      {/* Mobile/Tablet portrait: backdrop overlay for drawer */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile/Tablet portrait: slide-in sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-gray-50 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Page shell */}
      <div className="flex h-screen flex-col overflow-hidden bg-gray-100">
        {/* TopNav — mobile/tablet portrait only (hidden on lg+) */}
        <div className="flex-none lg:hidden">
          <TopNav onMenuOpen={() => setIsSidebarOpen(true)} />
        </div>

        {/* Sidebar + Main content area */}
        <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[15rem_1fr]">
          {/* Desktop/tablet landscape sidebar — hidden below lg */}
          <div className="hidden h-full overflow-y-auto border-r border-gray-200 bg-gray-50 lg:block">
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="h-full overflow-y-auto scroll-smooth pt-[70px] lg:pt-0">
            <div className="mx-auto w-full max-w-[850px] space-y-5 px-3 pb-3 sm:px-5 sm:py-3 lg:px-4">
              <MainContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
