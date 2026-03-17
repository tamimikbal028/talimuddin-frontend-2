import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { branchHooks } from "../../../../hooks/useBranch";
import { authHooks } from "../../../../hooks/useAuth";
import BranchFinanceEntryRow from "./BranchFinanceEntryRow";
import BranchFinanceAddEntryForm from "./BranchFinanceAddEntryForm";
import BranchFinanceFilter, { type FilterType } from "./BranchFinanceFilter";
import BranchFinanceEmptyState from "./BranchFinanceEmptyState";
import type { FinanceType } from "../../../../types";
import confirm from "../../../../utils/sweetAlert";

const BranchFinanceTransactions = () => {
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [page, setPage] = useState(1);

  const filters =
    filterType === "ALL" ? { page } : { type: filterType as FinanceType, page };

  const { isAppAdmin } = authHooks.useUser();

  const { data: entriesData, isLoading: isEntriesLoading } =
    branchHooks.useBranchFinanceEntries(filters);
  const { mutate: deleteEntry, isPending: isDeleting } =
    branchHooks.useDeleteFinanceEntry();

  const handleDelete = async (entryId: string) => {
    const ok = await confirm({
      title: "Delete Entry?",
      text: "This cannot be undone.",
      confirmButtonText: "Yes, delete",
      isDanger: true,
    });
    if (ok) deleteEntry(entryId);
  };

  const entries = entriesData?.data.entries ?? [];
  const pagination = entriesData?.data.pagination;

  // Handle filter change to reset page
  const handleFilterChange = (newType: FilterType) => {
    setFilterType(newType);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
          Recent Transactions
        </h2>
        {!isAppAdmin && (
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              showAddForm
                ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <FaPlus
              className={`h-3.5 w-3.5 transition-transform ${showAddForm ? "rotate-45" : ""}`}
            />
            {showAddForm ? "Cancel" : "Add Entry"}
          </button>
        )}
      </div>

      {/* Add Entry Form */}
      {showAddForm && !isAppAdmin && (
        <BranchFinanceAddEntryForm onSuccess={() => setShowAddForm(false)} />
      )}

      {/* Filter Bar */}
      <BranchFinanceFilter
        filterType={filterType}
        setFilterType={handleFilterChange}
        entriesCount={pagination?.totalDocs ?? entries.length}
      />

      {/* Entries Section */}
      {isEntriesLoading ? (
        <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-50" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <BranchFinanceEmptyState />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="hidden px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase sm:table-cell">
                    Type
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="hidden px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase sm:table-cell">
                    Person
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="hidden px-4 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase sm:table-cell"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <BranchFinanceEntryRow
                    key={entry._id}
                    entry={entry}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    isAppAdmin={isAppAdmin}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination && (
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3 sm:px-6">
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
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{" "}
                    <span className="font-medium">{pagination.totalPages}</span>
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
                    {[...Array(pagination.totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      // Show max 5 pages around current page
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
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
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
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
                    })}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(pagination.totalPages, p + 1))
                      }
                      disabled={page === pagination.totalPages}
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

export default BranchFinanceTransactions;
