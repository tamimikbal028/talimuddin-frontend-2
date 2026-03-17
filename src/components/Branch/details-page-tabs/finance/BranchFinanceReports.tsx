import { useState } from "react";
import { branchHooks } from "../../../../hooks/useBranch";
import { FaWallet } from "react-icons/fa";
import { formatCurrency } from "./financeUtils";

const BranchFinanceReports = () => {
  const [page, setPage] = useState(1);
  const { data: summaryData, isLoading: isSummaryLoading } =
    branchHooks.useBranchFinanceSummary({ page });

  const summary = summaryData?.data.summary;
  const overall = summary?.overall;
  const monthlyStats = summary?.monthlyStats ?? [];

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1).toLocaleString("en-BD", { month: "long" });
  };

  return (
    <div className="space-y-5">
      {/* Overall Summary */}
      {isSummaryLoading ? (
        <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-600 p-6 text-white shadow-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <FaWallet className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium tracking-widest text-white/80 uppercase">
              Overall Balance
            </p>
            <h2 className="text-3xl font-bold">
              {formatCurrency(overall?.balance ?? 0)}
            </h2>
          </div>
        </div>
      )}

      {/* Monthly Summary Section */}
      {!isSummaryLoading && monthlyStats.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
              Monthly Statistics
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {monthlyStats.map((stat) => (
              <div
                key={`${stat.year}-${stat.month}`}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-colors hover:border-blue-100"
              >
                {/* Month Header */}
                <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/50 px-5 py-3">
                  <span className="text-base font-bold text-gray-800">
                    {getMonthName(stat.month)} {stat.year}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      stat.income - stat.expense >= 0
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {formatCurrency(stat.income - stat.expense)}
                  </span>
                </div>

                <div className="p-5">
                  {/* Monthly Totals */}
                  <div className="mb-4 grid grid-cols-2 gap-4 border-b border-gray-50 pb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        Total Income
                      </p>
                      <p className="text-sm font-bold text-green-600">
                        {formatCurrency(stat.income)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        Total Expense
                      </p>
                      <p className="text-sm font-bold text-red-600">
                        {formatCurrency(stat.expense)}
                      </p>
                    </div>
                  </div>

                  {/* Monthly Category Breakdown */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                      Breakdown by Category
                    </p>
                    <div className="space-y-2">
                      {stat.breakdown.map((item, idx) => (
                        <div
                          key={`${item.category}-${idx}`}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.type === "INCOME"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <span className="text-gray-700">
                              {item.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">
                              ({item.count})
                            </span>
                            <span
                              className={`font-semibold ${
                                item.type === "INCOME"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.type === "INCOME" ? "+" : "-"}
                              {formatCurrency(item.total)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {summaryData?.data.pagination && (
            <div className="mt-6 flex items-center justify-between rounded-xl border-t border-gray-100 bg-white px-4 py-3 shadow-sm sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((p) =>
                      Math.min(summaryData.data.pagination.totalPages, p + 1)
                    )
                  }
                  disabled={page === summaryData.data.pagination.totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{" "}
                    <span className="font-medium">
                      {summaryData.data.pagination.totalPages}
                    </span>
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {/* Page Numbers */}
                    {[...Array(summaryData.data.pagination.totalPages)].map(
                      (_, idx) => {
                        const pageNum = idx + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === summaryData.data.pagination.totalPages ||
                          (pageNum >= page - 1 && pageNum <= page + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                                page === pageNum
                                  ? "z-10 bg-blue-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                  : "text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === page - 2 ||
                          pageNum === page + 2
                        ) {
                          return (
                            <span
                              key={pageNum}
                              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}
                    <button
                      onClick={() =>
                        setPage((p) =>
                          Math.min(
                            summaryData.data.pagination.totalPages,
                            p + 1
                          )
                        )
                      }
                      disabled={page === summaryData.data.pagination.totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BranchFinanceReports;
