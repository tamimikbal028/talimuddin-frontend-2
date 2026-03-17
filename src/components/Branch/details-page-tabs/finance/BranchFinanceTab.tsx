import { useState } from "react";
import { FaWallet } from "react-icons/fa";
import BranchFinanceTransactions from "./BranchFinanceTransactions";
import BranchFinanceReports from "./BranchFinanceReports";

// ── Main Component ────────────────────────────────────────────────
type SubTab = "TRANSACTIONS" | "REPORTS";

const BranchFinanceTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("TRANSACTIONS");

  return (
    <div className="space-y-5">
      {/* Header & Sub-tabs */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <FaWallet className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Branch Finance
              </h1>
              <p className="text-sm text-gray-500">Income & Expense tracker</p>
            </div>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="flex px-4 pt-2">
          {(
            [
              { id: "TRANSACTIONS", label: "Transactions" },
              { id: "REPORTS", label: "Reports & Summary" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`border-b-2 px-6 py-2.5 text-sm font-semibold transition-colors ${
                activeSubTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === "TRANSACTIONS" && <BranchFinanceTransactions />}
      {activeSubTab === "REPORTS" && <BranchFinanceReports />}
    </div>
  );
};

export default BranchFinanceTab;
