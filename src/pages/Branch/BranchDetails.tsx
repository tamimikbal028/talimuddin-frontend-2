import { Suspense, lazy } from "react";
import { branchHooks } from "../../hooks/useBranch";
import BranchHeader from "../../components/Branch/details-page/BranchHeader";
import BranchDetailsSkeleton from "../../components/shared/skeletons/BranchDetailsSkeleton";
import PageLoader from "../Fallbacks/PageLoader";

const BranchFinanceTab = lazy(
  () =>
    import("../../components/Branch/details-page-tabs/finance/BranchFinanceTab")
);

const BranchDetails = () => {
  const { data: response, isLoading, error } = branchHooks.useBranchDetails();

  if (isLoading) {
    return <BranchDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-xl border-2 border-gray-200 bg-gray-50 py-5">
        <span className="font-semibold text-red-700">{error.message}</span>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  const branch = response.data.branch;
  const meta = response.data.meta;

  if (!meta.isMember) {
    return (
      <div className="space-y-5">
        <BranchHeader branch={branch} meta={meta} />

        <h2 className="rounded-2xl border-2 bg-gray-50 p-5 py-10 text-center text-2xl font-bold text-gray-900">
          You are not a member of this branch.
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <BranchHeader branch={branch} meta={meta} />

      <div className="mx-auto max-w-5xl">
        <div className="space-y-3 rounded-xl">
          <Suspense fallback={<PageLoader />}>
            {meta.isAdmin ? (
              <BranchFinanceTab />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
                <div className="rounded-full bg-gray-100 p-4">
                  <svg
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="max-w-xs space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    Access Restricted
                  </h3>
                  <p className="text-gray-500">
                    Only branch administrators have access to view and manage
                    finance records.
                  </p>
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default BranchDetails;
