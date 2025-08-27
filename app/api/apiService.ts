// apiService.ts - Frontend API service for client-side use

export interface APIConfig {
  method?: string;
  headers?: Record<string, any>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
}

export interface APIResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

class FrontendAPIService {
  private baseURL: string;
  private defaultHeaders: Record<string, string> = {
    'Accept': 'application/json'
  };

  constructor() {
    // Frontend environment variables
    this.baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT_URL || 'http://localhost:5000/api';
  }

  // Set auth token (JWT, Bearer, etc.)
  setAuth(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove auth
  clearAuth(): void {
    delete this.defaultHeaders['Authorization'];
  }

  // Set custom headers
  setHeaders(headers: Record<string, string>): void {
    Object.assign(this.defaultHeaders, headers);
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    // Ensure baseURL ends with '/' and endpoint starts without '/'
    const baseURL = this.baseURL.endsWith('/') ? this.baseURL : this.baseURL + '/';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    const url = new URL(cleanEndpoint, baseURL);
    
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
        if (value != null) url.searchParams.set(key, String(value));
        });
    }
    return url.toString();
    }

  private prepareBody(body: any): any {
    if (!body) return null;
    
    // If it's already a browser-native type, return as-is
    if (body instanceof FormData || body instanceof File || body instanceof Blob || 
        body instanceof ArrayBuffer || body instanceof URLSearchParams || 
        typeof body === 'string') {
      return body;
    }

    // Check if body contains files
    if (this.hasFiles(body)) {
      const formData = new FormData();
      this.buildFormData(formData, body);
      return formData;
    }

    // Default to JSON
    return JSON.stringify(body);
  }

  private hasFiles(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;
    
    const checkValue = (val: any): boolean => {
      if (val instanceof File || val instanceof Blob) return true;
      if (Array.isArray(val)) return val.some(checkValue);
      if (val && typeof val === 'object') return Object.values(val).some(checkValue);
      return false;
    };
    
    return Object.values(obj).some(checkValue);
  }

  private buildFormData(formData: FormData, obj: any, prefix = ''): void {
    Object.entries(obj).forEach(([key, value]) => {
      const fieldName = prefix ? `${prefix}[${key}]` : key;
      
      if (value instanceof File || value instanceof Blob) {
        formData.append(fieldName, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayFieldName = `${fieldName}[${index}]`;
          if (item instanceof File || item instanceof Blob) {
            formData.append(arrayFieldName, item);
          } else if (item && typeof item === 'object') {
            this.buildFormData(formData, item, arrayFieldName);
          } else {
            formData.append(arrayFieldName, String(item));
          }
        });
      } else if (value && typeof value === 'object') {
        this.buildFormData(formData, value, fieldName);
      } else if (value != null) {
        formData.append(fieldName, String(value));
      }
    });
  }

  async request<T = any>(endpoint: string, config: APIConfig = {}): Promise<APIResponse<T>> {
    const { method = 'GET', headers = {}, body, params, timeout = 30000 } = config;
    
    const url = this.buildURL(endpoint, params);
    const mergedHeaders = { ...this.defaultHeaders, ...headers };
    const preparedBody = this.prepareBody(body);
    
    // Let browser set Content-Type for FormData (includes boundary)
    if (preparedBody instanceof FormData) {
      delete mergedHeaders['Content-Type'];
    } else if (preparedBody && typeof preparedBody === 'string') {
      mergedHeaders['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: mergedHeaders,
        body: preparedBody,
        signal: controller.signal,
        // Frontend specific options
        credentials: 'include', // Include cookies for CORS
        mode: 'cors'
      });

      clearTimeout(timeoutId);

      // Parse response based on content type
      let data: T;
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('json')) {
        data = await response.json();
      } else if (contentType.includes('text')) {
        data = await response.text() as T;
      } else if (contentType.includes('blob') || contentType.includes('octet-stream')) {
        data = await response.blob() as T;
      } else {
        // Try JSON first, fallback to text
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = text as T;
        }
      }

      if (!response.ok) {
        throw {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          data
        };
      }

      return { data, status: response.status, ok: response.ok };
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  // HTTP method shortcuts
  get<T = any>(url: string, config?: Omit<APIConfig, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  post<T = any>(url: string, body?: any, config?: Omit<APIConfig, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST', body });
  }

  put<T = any>(url: string, body?: any, config?: Omit<APIConfig, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PUT', body });
  }

  patch<T = any>(url: string, body?: any, config?: Omit<APIConfig, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PATCH', body });
  }

  delete<T = any>(url: string, config?: Omit<APIConfig, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }
}

// Export singleton instance for frontend use
const api = new FrontendAPIService();
export default api;

/* 
USAGE WITH YOUR EXPRESS BACKEND:

import api from './apiService';

// --- PUBLIC AUTH ROUTES ---
// Register
const register = await api.post('/auth/register', {
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe'
});

// Login
const login = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Google Auth
const googleAuth = await api.post('/auth/google', { token: 'google_token' });

// Apple Auth
const appleAuth = await api.post('/auth/apple', { token: 'apple_token' });

// Refresh Token
const refreshToken = await api.post('/auth/refresh-token', { 
  refreshToken: 'stored_refresh_token' 
});

// --- PROTECTED ROUTES (after login) ---
// Set JWT token after login
api.setAuth(login.data.token); // or from localStorage

// Get current user
const currentUser = await api.get('/auth/me');

// Update profile
const updateProfile = await api.put('/auth/me', {
  name: 'Updated Name',
  email: 'newemail@example.com'
});

// Update profile image (file upload)
const updateProfileImage = await api.put('/auth/me/image', { image: fileInput.files[0] });

// Change password
const changePassword = await api.put('/auth/me/password', {
  currentPassword: 'oldpass',
  newPassword: 'newpass'
});

// Session Management
const logout = await api.post('/auth/logout');
const logoutAll = await api.post('/auth/logout-all');
const sessions = await api.get('/auth/sessions');

// --- ADMIN ROUTES ---
const allUsers = await api.get('/auth/users');
const userByEmail = await api.get('/auth/users/email/user@example.com');
const userById = await api.get('/auth/users/id/123');
const usersByProvider = await api.get('/auth/users/provider/google');

// Error handling example
try {
  const result = await api.post('/auth/login', credentials);
  localStorage.setItem('token', result.data.token);
  api.setAuth(result.data.token);
} catch (error) {
  if (error.status === 401) {
    setError('Invalid credentials');
  } else {
    setError(error.message);
  }
}

// Environment setup (.env):
// NEXT_PUBLIC_API_ENDPOINT_URL=http://localhost:3000 (your Express server)
// REACT_APP_API_ENDPOINT_URL=https://yourapi.com
*/