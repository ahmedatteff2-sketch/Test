/**
 * Typed API client wrapping fetch.
 * All requests go through this to ensure consistent error handling,
 * auth headers, and response parsing.
 */

const getApiBase = () => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8080/api`;
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
};

const API_BASE = getApiBase();

interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

interface ApiError {
  status: number;
  message: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      ...options,
      credentials: "include", // send httpOnly cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error: ApiError = {
        status: response.status,
        message: errorBody.error || `Request failed with status ${response.status}`,
      };

      // Auto-refresh on 401
      if (response.status === 401) {
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          // Retry the original request
          return this.request<T>(path, options);
        }
      }

      throw error;
    }

    return response.json();
  }

  private async tryRefreshToken(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<T>(`${path}${query}`);
  }

  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "DELETE" });
  }

  async upload<T>(path: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "POST",
      body: formData,
      headers: {}, // let browser set Content-Type with boundary
    });
  }
}

export const api = new ApiClient(API_BASE);
