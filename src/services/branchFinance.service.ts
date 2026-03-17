import api from "../lib/axios";
import type {
  BranchFinanceEntriesResponse,
  BranchFinanceSummaryResponse,
  CreateFinanceEntryResponse,
  DeleteFinanceEntryResponse,
  CreateFinanceEntryRequest,
} from "../types";

export const branchFinanceService = {
  getEntries: async (
    branchId: string,
    params: {
      type?: "INCOME" | "EXPENSE";
      category?: string;
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<BranchFinanceEntriesResponse> => {
    const response = await api.get<BranchFinanceEntriesResponse>(
      `/branches/${branchId}/finance`,
      { params }
    );
    return response.data;
  },

  getSummary: async (
    branchId: string,
    params: {
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<BranchFinanceSummaryResponse> => {
    const response = await api.get<BranchFinanceSummaryResponse>(
      `/branches/${branchId}/finance/summary`,
      { params }
    );
    return response.data;
  },

  createEntry: async (
    branchId: string,
    data: CreateFinanceEntryRequest
  ): Promise<CreateFinanceEntryResponse> => {
    const response = await api.post<CreateFinanceEntryResponse>(
      `/branches/${branchId}/finance`,
      data
    );
    return response.data;
  },

  deleteEntry: async (
    branchId: string,
    entryId: string
  ): Promise<DeleteFinanceEntryResponse> => {
    const response = await api.delete<DeleteFinanceEntryResponse>(
      `/branches/${branchId}/finance/${entryId}`
    );
    return response.data;
  },
};
