import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

/**
 * ====================================
 * AXIOS INSTANCE CONFIGURATION
 * ====================================
 *
 * This file contains the base setup for Axios.
 * All API calls will use this instance.
 *
 * Key Features:
 * 1. Base URL: Taken from .env (VITE_API_BASE_URL)
 * 2. withCredentials: true → Sends cookies with every request
 * 3. Auto Token Refresh → Tries to refresh token automatically on 401 error
 */

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // CRITICAL: Required for sending/receiving cookies!
  // Backend CORS must also have credentials: true
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },

  // timeout to prevent hanging requests
  timeout: 15000, // 15 seconds
  // Some requests might need a longer timeout, can be set per-request
});

/**
 * ====================================
 * AUTO TOKEN REFRESH LOGIC
 * ====================================
 *
 * When Access Token expires:
 * 1. Backend returns 401 Unauthorized
 * 2. This interceptor catches it
 * 3. Automatically calls /refresh-token
 * 4. Retries the original request if new token is received
 * 5. Seamless experience for the user!
 */

// Flag to prevent multiple refresh attempts at the same time
// If multiple requests get 401 at once, only refresh once
let isRefreshing = false;

// Queue for requests that are waiting for token refresh
// Other requests will wait here during refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Process all queued requests after refresh completes
const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor for handling 401 errors and token refresh
api.interceptors.response.use(
  // Success response → directly return
  (response) => response,

  // Error response → try refresh if 401
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // No need to refresh for these routes
      // Case A: Login/Register fail is user error, not token issue
      // Case B: current-user fail means user is logged out, no point in refresh
      const skipRefreshUrls = [
        "/users/login",
        "/users/register",
        "/users/refresh-token",
        "/users/current-user", // expected if logged out
      ];
      if (skipRefreshUrls.some((url) => originalRequest.url?.includes(url))) {
        return Promise.reject(error);
      }

      // If already refreshing, add to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // Mark as retrying and start refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        // Backend will set new access token in cookie
        await api.post("/users/refresh-token");
        processQueue(null);

        // Refresh successful! Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh also failed - session expired
        processQueue(refreshError as Error);

        // Custom event dispatch - listened in App.tsx
        // This will logout the user and redirect to login page
        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
