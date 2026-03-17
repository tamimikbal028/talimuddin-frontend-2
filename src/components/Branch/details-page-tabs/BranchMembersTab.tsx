import BranchMemberCard from "../BranchMemberCard";
import FriendCardSkeleton from "../../shared/skeletons/FriendCardSkeleton";
import { branchHooks } from "../../../hooks/useBranch";

const BranchMembersTab = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = branchHooks.useBranchMembers();

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-lg bg-white p-4">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
        {[...Array(5)].map((_, i) => (
          <FriendCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center shadow">
        <p className="font-medium text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const members = data.pages.flatMap((page) => page.data.members);
  const totalDocs = data.pages[0].data.pagination.totalDocs;

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow">
        <p className="text-xl font-extrabold tracking-widest text-gray-600">
          No member available in this branch
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg bg-white p-4  shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">
        Members ({totalDocs})
      </h2>

      <div className="space-y-3">
        {members.map((member) => (
          <BranchMemberCard key={member.meta.memberId} member={member} />
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading more members..." : "Load More Members"}
        </button>
      )}
    </div>
  );
};

export default BranchMembersTab;
