import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PageLoader from "../Fallbacks/PageLoader";

// Lazy load pages
const MyBranch = lazy(() => import("../../components/Branch/MyBranch"));
const BranchDetails = lazy(() => import("./BranchDetails"));
const CreateBranchPage = lazy(() => import("./CreateBranchPage"));
const EditBranchPage = lazy(() => import("./EditBranchPage"));
const Header = lazy(() => import("../../components/Branch/BranchHeader"));
const AllBranches = lazy(() => import("../../components/Branch/AllBranches"));

const Branch = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route index element={<MyBranch />} />
        <Route
          path="all"
          element={
            <>
              <Header />
              <AllBranches />
            </>
          }
        />

        <Route path="createbranch" element={<CreateBranchPage />} />
        <Route path="branches/:branchId/edit" element={<EditBranchPage />} />
        <Route path="branches/:branchId/*" element={<BranchDetails />} />
      </Routes>
    </Suspense>
  );
};

export default Branch;
