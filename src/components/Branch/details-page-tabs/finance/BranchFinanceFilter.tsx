export type FilterType = "ALL" | "INCOME" | "EXPENSE";

interface BranchFinanceFilterProps {
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  entriesCount: number;
}

const BranchFinanceFilter = ({
  filterType,
  setFilterType,
  entriesCount,
}: BranchFinanceFilterProps) => {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      {(["ALL", "INCOME", "EXPENSE"] as const).map((f) => (
        <button
          key={f}
          onClick={() => setFilterType(f)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            filterType === f
              ? f === "INCOME"
                ? "bg-green-100 text-green-700"
                : f === "EXPENSE"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {f === "ALL" ? "All" : f === "INCOME" ? "Income" : "Expense"}
        </button>
      ))}
      <span className="ml-auto text-xs text-gray-400">
        {entriesCount} entries
      </span>
    </div>
  );
};

export default BranchFinanceFilter;
