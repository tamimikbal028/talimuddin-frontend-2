const BranchFinanceEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center">
      <div>
        <p className="font-mono text-2xl font-semibold text-gray-500">
          No entries found
        </p>
      </div>
    </div>
  );
};

export default BranchFinanceEmptyState;
