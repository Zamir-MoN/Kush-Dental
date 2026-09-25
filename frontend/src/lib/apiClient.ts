export class ApiError extends Error {
  public status: number;
  public details: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// In-memory token storage
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Single-flight refresh mechanism
let refreshPromise: Promise<any> | null = null;

const getCsrfToken = (): string | null => {
  const match = document.cookie.match(new RegExp('(^| )csrf_token=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

interface RequestOptions extends RequestInit {
  data?: any;
  params?: Record<string, string | number | boolean>;
  skipAuth?: boolean;
}

const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean>) => {
  let baseUrl = window.location.origin;
  if (window.location.port === '3000') {
    baseUrl = `${window.location.protocol}//${window.location.hostname}:8000`;
  }
  const url = new URL(endpoint, baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  return url.toString();
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let message = 'An unexpected error occurred';
    let details = null;
    
    try {
      const errorData = await response.json();
      message = errorData.detail || errorData.message || message;
      details = errorData;
    } catch (e) {
      // Not JSON
    }

    throw new ApiError(response.status, message, details);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const refreshSession = async (): Promise<any> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const csrfToken = getCsrfToken();
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };
      
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch(buildUrl('/api/v1/auth/refresh'), {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        setAccessToken(null);
        throw new Error('Session expired');
      }

      const data = await response.json();
      setAccessToken(data.access_token);
      return data;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const apiClient = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { data, params, skipAuth, headers: customHeaders, ...fetchOptions } = options;
  
  const headers = new Headers(customHeaders);
  
  if (data) {
    headers.set('Content-Type', 'application/json');
    fetchOptions.body = JSON.stringify(data);
  }

  headers.set('Accept', 'application/json');

  if (!skipAuth && accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const method = (fetchOptions.method || 'GET').toUpperCase();
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }
  }

  const finalOptions: RequestInit = {
    ...fetchOptions,
    headers,
    credentials: 'include'
  };

  const url = buildUrl(endpoint, params);

  try {
    const response = await fetch(url, finalOptions);
    
    if (response.status === 401 && !skipAuth) {
      // Attempt refresh
      const refreshData = await refreshSession();
      headers.set('Authorization', `Bearer ${refreshData.access_token}`);
      
      const retryResponse = await fetch(url, { ...finalOptions, headers });
      return handleResponse(retryResponse);
    }

    return handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error or server unreachable');
  }
};

export default apiClient;
