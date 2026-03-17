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
    return <Navigate to="/branch/joinbranch" replace />;
  }
};

export default MyBranch;
