import { branchHooks } from "../../hooks/useBranch";
import { Navigate } from "react-router-dom";
import ErrorState from "../shared/ErrorState";

const MyBranch = () => {
  const { data, isLoading, error } = branchHooks.useMyBranch();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-5 border p-20">
        <p className="text-3xl text-gray-700">Loading branch information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error.response?.data.message || "Failed to load my branch"}
      />
    );
  }

  if (!data) {
    return null;
  }

  const branchId = data.data.meta.branchId;

  if (branchId) {
    return <Navigate to={`/branch/branches/${branchId}`} replace />;
  } else {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">No Branch Found</h2>
        <p className="text-gray-600">
          You are not a member of any branch. Please contact an administrator
          to be added to a branch.
        </p>
      </div>
    );
  }
};

export default MyBranch;
