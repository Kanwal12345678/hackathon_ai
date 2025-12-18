import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  expertiseLevel: string;
  preferences: any;
  createdAt: string;
}

class AuthService {
  private apiClient = axios.create({
    baseURL: `${API_BASE_URL}`,
    timeout: 10000,
  });

  /**
   * Initialize the auth service with existing token if available
   */
  initialize() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.setAuthToken(token);
    }
  }

  /**
   * Set auth token in axios defaults
   */
  setAuthToken(token: string | null) {
    if (token) {
      this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete this.apiClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<User> {
    try {
      // Call the Better Auth login endpoint
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();

      // Set the auth token from the response
      if (result.token) {
        this.setAuthToken(result.token);
      }

      // Get user profile after successful login
      const userResponse = await this.apiClient.get('/user/profile');
      return userResponse.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  /**
   * Register user
   */
  async register(email: string, password: string, name?: string): Promise<User> {
    try {
      // Call the Better Auth register endpoint
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();

      // Set the auth token from the response
      if (result.token) {
        this.setAuthToken(result.token);
      }

      // Get user profile after successful registration
      const userResponse = await this.apiClient.get('/user/profile');
      return userResponse.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.apiClient.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await this.apiClient.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Get dashboard data
   */
  async getDashboardData(): Promise<any> {
    try {
      const response = await this.apiClient.get('/user/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<any> {
    try {
      const response = await this.apiClient.get('/user/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get recent dashboard activity
   */
  async getRecentDashboardActivity(): Promise<any> {
    try {
      const response = await this.apiClient.get('/user/dashboard/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent dashboard activity:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    this.setAuthToken(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();
export default authService;