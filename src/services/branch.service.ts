import api from "../lib/axios";
import { BRANCH_LIMIT, MEMBERS_LIMIT } from "../constants";
import type {
  CreateBranchResponse,
  BranchDetailsResponse,
  DeleteBranchResponse,
  UpdateBranchResponse,
  UpdateBranchData,
  BranchMembersResponse,
  BaseBranchActionResponse,
  MyBranchResponse,
  AllBranchesResponse,
} from "../types";

export const branchService = {
  // Create Branch (app admin only)
  createBranch: async (branchData: {
    name: string;
    description?: string;
    branchType: string;
    parentBranchId?: string;
  }): Promise<CreateBranchResponse> => {
    const response = await api.post<CreateBranchResponse>(
      "/branches",
      branchData
    );
    return response.data;
  },

  // Get My Branches
  getMyBranch: async (): Promise<MyBranchResponse> => {
    const response = await api.get<MyBranchResponse>("/branches/myBranch");
    return response.data;
  },

  // Get All Branches
  getAllBranches: async (page: number): Promise<AllBranchesResponse> => {
    const limit = BRANCH_LIMIT;
    const response = await api.get<AllBranchesResponse>(
      "/branches/allBranches",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get Branch Details
  getBranchDetails: async (
    branchId: string
  ): Promise<BranchDetailsResponse> => {
    const response = await api.get<BranchDetailsResponse>(
      `/branches/${branchId}`
    );
    return response.data;
  },

  // Delete Branch (App admin only)
  deleteBranch: async (branchId: string): Promise<DeleteBranchResponse> => {
    const response = await api.delete<DeleteBranchResponse>(
      `/branches/${branchId}`
    );
    return response.data;
  },

  // Update Branch (Branch admin or app admin)
  updateBranch: async (
    branchId: string,
    updateData: UpdateBranchData
  ): Promise<UpdateBranchResponse> => {
    const response = await api.patch<UpdateBranchResponse>(
      `/branches/${branchId}`,
      updateData
    );
    return response.data;
  },

  // Update Branch Cover Image (Branch admin or app admin)
  updateBranchCoverImage: async (
    branchId: string,
    coverImage: File
  ): Promise<UpdateBranchResponse> => {
    const formData = new FormData();
    formData.append("coverImage", coverImage);
    const response = await api.patch<UpdateBranchResponse>(
      `/branches/${branchId}/cover-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get Branch Members
  getBranchMembers: async (
    branchId: string,
    page: number
  ): Promise<BranchMembersResponse> => {
    const limit = MEMBERS_LIMIT;
    const response = await api.get<BranchMembersResponse>(
      `/branches/${branchId}/members`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Remove Member (Branch admin or app admin)
  removeMember: async (
    branchId: string,
    userId: string
  ): Promise<BaseBranchActionResponse> => {
    const response = await api.delete<BaseBranchActionResponse>(
      `/branches/${branchId}/remove/${userId}`
    );
    return response.data;
  },

  // Promote Member to Admin (App admin only)
  promoteMember: async (
    branchId: string,
    userId: string
  ): Promise<BaseBranchActionResponse> => {
    const response = await api.patch<BaseBranchActionResponse>(
      `/branches/${branchId}/promote/${userId}`
    );
    return response.data;
  },

  // Demote Admin to Member (App admin only)
  demoteMember: async (
    branchId: string,
    userId: string
  ): Promise<BaseBranchActionResponse> => {
    const response = await api.patch<BaseBranchActionResponse>(
      `/branches/${branchId}/demote/${userId}`
    );
    return response.data;
  },
};
