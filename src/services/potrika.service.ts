import type { ApiResponse, Potrika, ProfilePostsResponse } from "../types";
import api from "../lib/axios";
import { POST_LIMIT } from "../constants";

export const potrikaService = {
  getPotrikaHeader: async (
    potrikaId: string
  ): Promise<ApiResponse<{ potrika: Potrika }>> => {
    const response = await api.get<ApiResponse<{ potrika: Potrika }>>(
      `/potrikas/${potrikaId}`
    );
    return response.data;
  },

  getPotrikaPosts: async (
    potrikaId: string,
    page: number = 1
  ): Promise<ProfilePostsResponse> => {
    const response = await api.get<ProfilePostsResponse>(
      `/potrikas/${potrikaId}/posts`,
      {
        params: { page, limit: POST_LIMIT },
      }
    );
    return response.data;
  },
};

export default potrikaService;
