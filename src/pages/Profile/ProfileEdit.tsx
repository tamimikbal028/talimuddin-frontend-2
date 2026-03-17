import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaUser, FaArrowLeft } from "react-icons/fa";

import PageLoader from "../Fallbacks/PageLoader";
import { authHooks } from "../../hooks/useAuth";
import { PhotosTab, GeneralTab } from "../../components/ProfileEdit";

type TabType = "photos" | "general";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: "photos", label: "Photos", icon: <FaCamera /> },
  { id: "general", label: "General", icon: <FaUser /> },
];

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user } = authHooks.useUser();
  const [activeTab, setActiveTab] = useState<TabType>("photos");

  if (!user) {
    return <PageLoader />;
  }

  return (
    <div className="bg-gray-50 pb-5">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
                aria-label="Go back"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Edit Profile
              </h1>
            </div>
          </div>

          <div className="flex border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-6">
        {activeTab === "photos" && (
          <PhotosTab
            avatar={user.avatar}
            coverImage={user.coverImage}
            fullName={user.fullName}
          />
        )}

        {activeTab === "general" && <GeneralTab user={user} />}
      </div>
    </div>
  );
};

export default ProfileEdit;
