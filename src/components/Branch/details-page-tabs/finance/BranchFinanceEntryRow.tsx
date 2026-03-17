import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaChevronDown,
  FaUser,
  FaPhone,
} from "react-icons/fa";
import type { FinanceEntry } from "../../../../types";
import { formatCurrency, formatDate } from "./financeUtils";
import { AvatarImage } from "../../../shared/FallbackImage";

interface BranchFinanceEntryRowProps {
  entry: FinanceEntry;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isAppAdmin: boolean;
}

const BranchFinanceEntryRow = ({
  entry,
  onDelete,
  isDeleting,
  isAppAdmin,
}: BranchFinanceEntryRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 ${isExpanded ? "bg-blue-50/50" : ""}`}
      >
        <td className="px-4 py-3 text-sm text-gray-600">
          <span className="sm:hidden">
            {new Date(entry.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </span>
          <span className="hidden sm:inline">{formatDate(entry.date)}</span>
        </td>
        <td className="hidden px-4 py-3 sm:table-cell">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              entry.type === "INCOME"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {entry.type === "INCOME" ? (
              <FaArrowUp className="h-3 w-3" />
            ) : (
              <FaArrowDown className="h-3 w-3" />
            )}
            <span className="hidden sm:inline">
              {entry.type === "INCOME" ? "Income" : "Expense"}
            </span>
          </span>
        </td>
        <td className="px-4 py-3 text-sm font-medium text-gray-700">
          {entry.category}
        </td>
        <td className="hidden px-4 py-3 text-sm sm:table-cell">
          {entry.person ? (
            <div className="flex items-center gap-2">
              <AvatarImage
                src={entry.person.avatar}
                name={entry.person.fullName}
                alt={entry.person.fullName}
                className="h-6 w-6 rounded-full object-cover"
                textClassName="text-[10px]"
              />
              <span className="text-gray-700">{entry.person.fullName}</span>
            </div>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </td>
        <td
          className={`px-4 py-3 text-right text-sm font-bold ${
            entry.type === "INCOME" ? "text-green-600" : "text-red-600"
          }`}
        >
          {entry.type === "INCOME" ? "+" : "-"}
          {formatCurrency(entry.amount)}
        </td>
        <td className="hidden px-4 py-3 text-right sm:table-cell">
          <div className="flex items-center justify-end gap-2 text-gray-400">
            <FaChevronDown
              className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {isExpanded && (
        <tr className="border-b border-gray-100 bg-gray-50/50">
          <td colSpan={6} className="px-4 py-4">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              {/* Details & Structure Section */}
              {/* Note Section */}
              <div className="min-w-0 flex-1 space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Note
                  </span>
                  <p className="max-w-full text-justify text-sm leading-relaxed break-words whitespace-pre-wrap text-gray-700">
                    {entry.note || "No note provided."}
                  </p>
                </div>

                {/* Breakdown Details */}
                {entry.details && entry.details.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      Breakdown Details
                    </span>
                    <div className="max-w-full rounded-xl border border-gray-100 bg-white p-3 shadow-sm lg:w-80">
                      <div className="space-y-2">
                        {entry.details.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between border-b border-gray-50 pb-2 text-sm last:border-0 last:pb-0"
                          >
                            <span className="min-w-0 break-words text-gray-600">
                              {item.itemName}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm font-bold text-gray-900">
                        <span>Total Sum</span>
                        <span>
                          {formatCurrency(
                            entry.details.reduce(
                              (sum, item) => sum + item.amount,
                              0
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Person & Actions Section */}
              <div className="flex flex-col gap-3">
                {entry.person && (
                  <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:w-80">
                    <Link
                      to={`/profile/${entry.person.userName}`}
                      className="group -m-2 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <AvatarImage
                        src={entry.person.avatar}
                        name={entry.person.fullName}
                        alt={entry.person.fullName}
                        className="h-12 w-12 rounded-full border border-gray-100 object-cover shadow-sm transition-transform group-hover:scale-105"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                          {entry.person.fullName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <FaUser className="h-2.5 w-2.5" />
                          <span>@{entry.person.userName}</span>
                        </div>
                      </div>
                    </Link>

                    <div className="h-[1px] w-full bg-gray-50" />

                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <FaPhone className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
                          Phone Number
                        </span>
                        <span className="font-semibold">
                          {entry.person.phoneNumber ||
                            "No phone number available"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete Button (Expanded only) */}
                {!isAppAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(entry._id);
                    }}
                    disabled={isDeleting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 sm:w-auto sm:px-4"
                  >
                    <FaTrash className="h-3 w-3" />
                    {isDeleting ? "Deleting..." : "Delete Entry"}
                  </button>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default BranchFinanceEntryRow;
