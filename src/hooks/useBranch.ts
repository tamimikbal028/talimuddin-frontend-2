import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { branchService } from "../services/branch.service";
import { branchFinanceService } from "../services/branchFinance.service";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import type { AxiosError } from "axios";
import { authHooks } from "./useAuth";
import type {
  ApiError,
  UpdateBranchData,
  BranchDetailsResponse,
  BranchMembersResponse,
  MyBranchResponse,
  AllBranchesResponse,
  BranchFinanceEntriesResponse,
  BranchFinanceSummaryResponse,
  CreateFinanceEntryRequest,
} from "../types";

import { FINANCE_ENTRY_LIMIT } from "../constants/pagination";
import { USER_TYPES } from "../constants";

const useCreateBranch = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (branchData: {
      name: string;
      description?: string;
      branchType: string;
      parentBranchId?: string;
    }) => branchService.createBranch(branchData),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["allBranches"] });
      navigate("/branch/all");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message || "Failed to create branch");
    },
  });
};

const useMyBranch = () => {
  return useQuery<MyBranchResponse, AxiosError<ApiError>>({
    queryKey: ["myBranch"],
    queryFn: () => branchService.getMyBranch(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const useAllBranches = () => {
  return useInfiniteQuery<AllBranchesResponse, AxiosError<ApiError>>({
    queryKey: ["allBranches", "infinite"],
    queryFn: ({ pageParam }) =>
      branchService.getAllBranches(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const useBranchDetails = () => {
  const { branchId } = useParams();
  return useQuery<BranchDetailsResponse, AxiosError<ApiError>>({
    queryKey: ["branchDetails", branchId],
    queryFn: () => branchService.getBranchDetails(branchId as string),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
};



const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (branchId: string) => branchService.deleteBranch(branchId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["allBranches"] });
      navigate("/branch/all");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to delete branch");
    },
  });
};



const useUpdateBranchDetails = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: UpdateBranchData) =>
      branchService.updateBranch(branchId as string, updateData),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["branchDetails"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update branch details"
      );
    },
  });
};

const useUpdateBranchCoverImage = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coverImage: File) =>
      branchService.updateBranchCoverImage(branchId as string, coverImage),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["branchDetails"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update branch cover image"
      );
    },
  });
};

// ====================================
// Branch Posts & Members
// ====================================



const useBranchMembers = () => {
  const { branchId } = useParams();
  const { user: currentUser } = authHooks.useUser();

  return useInfiniteQuery<BranchMembersResponse, AxiosError<ApiError>>({
    queryKey: ["branchMembers", branchId],
    queryFn: async ({ pageParam }) => {
      const response = await branchService.getBranchMembers(
        branchId as string,
        pageParam as number
      );

      const isRequesterAdmin = response.data.meta.isRequesterAdmin;
      const isAppAdmin = currentUser?.userType === USER_TYPES.ADMIN;

      // Inject meta into each member to maintain compatibility with BranchMemberCard
      response.data.members = response.data.members.map((member) => ({
        ...member,
        meta: {
          isSelf: member.user._id === currentUser?._id,
          isAdmin: member.isAdmin,
          joinedAt: member.joinedAt,
          canManage:
            (isRequesterAdmin || isAppAdmin) &&
            member.user._id !== currentUser?._id,
          memberId: member.user._id,
        },
      }));

      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!branchId && !!currentUser,
    staleTime: Infinity,
  });
};

// Branch Post Actions - Using Common Hooks




// ====================================
// Join Request Management
// ====================================

const useRemoveBranchMember = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      branchService.removeMember(branchId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["branchMembers", branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["branchDetails", branchId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to remove member");
    },
  });
};

const usePromoteBranchMember = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      branchService.promoteMember(branchId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["branchMembers", branchId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to promote member");
    },
  });
};

const useDemoteBranchMember = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      branchService.demoteMember(branchId as string, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["branchMembers", branchId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to demote member");
    },
  });
};







// ====================================
// Finance Hooks
// ====================================

const useBranchFinanceSummary = (
  filters: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}
) => {
  const { branchId } = useParams();
  return useQuery<BranchFinanceSummaryResponse, AxiosError<ApiError>>({
    queryKey: ["branchFinanceSummary", branchId, filters],
    queryFn: () =>
      branchFinanceService.getSummary(branchId as string, {
        ...filters,
        limit: FINANCE_ENTRY_LIMIT,
      }),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 2,
  });
};

const useBranchFinanceEntries = (
  filters: {
    type?: "INCOME" | "EXPENSE";
    category?: string;
    page?: number;
    startDate?: string;
    endDate?: string;
  } = {}
) => {
  const { branchId } = useParams();
  return useQuery<BranchFinanceEntriesResponse, AxiosError<ApiError>>({
    queryKey: ["branchFinanceEntries", branchId, filters],
    queryFn: () =>
      branchFinanceService.getEntries(branchId as string, {
        ...filters,
        limit: FINANCE_ENTRY_LIMIT,
      }),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 1,
  });
};

const useCreateFinanceEntry = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFinanceEntryRequest) =>
      branchFinanceService.createEntry(branchId as string, data),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["branchFinanceEntries", branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["branchFinanceSummary", branchId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to create entry");
    },
  });
};

const useDeleteFinanceEntry = () => {
  const { branchId } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) =>
      branchFinanceService.deleteEntry(branchId as string, entryId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["branchFinanceEntries", branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["branchFinanceSummary", branchId],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to delete entry");
    },
  });
};

const branchHooks = {
  useCreateBranch,
  useMyBranch,
  useAllBranches,
  useBranchDetails,
  useDeleteBranch,
  useUpdateBranchDetails,
  useUpdateBranchCoverImage,

  // Members
  useBranchMembers,
  // Join Request Management
  useRemoveBranchMember,
  usePromoteBranchMember,
  useDemoteBranchMember,

  // Finance
  useBranchFinanceSummary,
  useBranchFinanceEntries,
  useCreateFinanceEntry,
  useDeleteFinanceEntry,
} as const;

export { branchHooks };
