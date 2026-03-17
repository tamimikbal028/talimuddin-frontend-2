import {
  FaEllipsisH,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaLink,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Branch } from "../../../types";
import { branchHooks } from "../../../hooks/useBranch";
import confirm from "../../../utils/sweetAlert";

import { useDropdown } from "../../../hooks/useDropdown";
import type { BranchDetailsMeta } from "../../../types/branch.types";
import { authHooks } from "../../../hooks/useAuth";
import { CoverImage } from "../../shared/FallbackImage";

interface BranchHeaderProps {
  branch: Branch;
  meta: BranchDetailsMeta;
}

const BranchHeader = ({ branch, meta }: BranchHeaderProps) => {
  const navigate = useNavigate();
  const { isAppAdmin } = authHooks.useUser();

  const { mutate: deleteBranch, isPending: isDeleting } =
    branchHooks.useDeleteBranch();

  const {
    isOpen: showMenu,
    openUpward,
    menuRef,
    triggerRef: buttonRef,
    toggle: toggleMenu,
    close: closeMenu,
  } = useDropdown();

  const handleDelete = async () => {
    closeMenu();
    const ok = await confirm({
      title: "Delete Branch?",
      text: "Are you sure you want to delete this branch? This action cannot be undone.",
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d33",
      isDanger: true,
    });

    if (ok) {
      deleteBranch(branch._id);
    }
  };

  return (
    <div>
      {/* Cover Image with Back Button */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700">
        <CoverImage
          src={branch.coverImage}
          name={branch.name}
          alt={branch.name}
          className="h-full w-full object-cover"
          showName
        />

        {/* Back Button */}
        <button
          onClick={() => navigate("/branch/all")}
          className="absolute top-4 left-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-black/70 active:scale-95"
          title="Go back to branches"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Header Content */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl space-y-3 p-5">
          {/* Row 1: Name + Count (left) | Action Buttons (right) */}
          <div className="flex items-start justify-between gap-4">
            {/* Left: Name, Badges & Count */}
            <div className="flex-1">
              {/* Name & Badges */}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {branch.name}
                </h1>
              </div>


            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <div
                className="relative rounded-lg border border-gray-300"
                ref={menuRef}
              >
                <button
                  ref={buttonRef}
                  onClick={toggleMenu}
                  className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200"
                  title="More actions"
                >
                  <FaEllipsisH className="h-5 w-5" />
                </button>

                {showMenu && (
                  <div
                    className={`absolute right-0 z-50 w-56 rounded-lg border border-gray-200 bg-white shadow-lg ${
                      openUpward ? "bottom-full mb-1" : "top-full mt-1"
                    }`}
                  >
                    <div className="py-1">
                      {/* Copy Branch Link */}
                      <button
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        onClick={async () => {
                          try {
                            await window.navigator.clipboard.writeText(
                              window.location.href
                            );
                            toast.success("Branch link copied to clipboard");
                          } catch {
                            toast.error("Failed to copy branch link");
                          }
                          closeMenu();
                        }}
                      >
                        <FaLink className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">Copy Branch Link</span>
                      </button>

                      {/* Edit Branch */}
                      {meta.isAdmin && (
                        <>
                          <Link
                            to={`/branch/branches/${branch._id}/edit`}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            onClick={closeMenu}
                          >
                            <FaEdit className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">Edit Branch</span>
                          </Link>
                        </>
                      )}

                      {/* Delete Branch */}
                      {isAppAdmin && (
                        <button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FaTrash className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium">
                            {isDeleting ? "Deleting..." : "Delete Branch"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="mt-4">
            <p
              className={
                branch.description
                  ? "text-gray-700"
                  : "font-medium text-gray-500 italic"
              }
            >
              {branch.description}
            </p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default BranchHeader;
