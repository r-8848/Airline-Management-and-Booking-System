// API utility functions for handling JWT authentication

const API_BASE_URL = 'https://airline-management-and-booking-syst.vercel.app/';

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Basic check for token expiry (decode JWT payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Get user info from token
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      title: payload.title,
      firstName: payload.firstName,
      lastName: payload.lastName
    };
  } catch (error) {
    return null;
  }
};

// Create headers with authorization token
export const createAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createAuthHeaders();
  
  const config = {
    headers,
    ...options
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    // Handle token expiry
    if (response.status === 401 || response.status === 403) {
      removeToken();
      // Redirect to login or handle as needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return { success: false, message: 'Authentication required' };
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    return { success: false, message: 'Network error' };
  }
};

// Login function
export const login = async (email, password, userType = 'client') => {
  const endpoint = userType === 'client' ? '/api/login' : '/api/adlogin';
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success && data.token) {
    setToken(data.token);
  }
  
  return data;
};

// Logout function
export const logout = async () => {
  // Update user status to offline if needed
  try {
    const user = getUserFromToken();
    if (user) {
      await apiCall('/api/update-profile-on', {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          status: 0,
        }),
      });
    }
  } catch (error) {
    console.error('Error updating user status on logout:', error);
  }
  
  removeToken();
};

// Verify token validity
export const verifyToken = async () => {
  return await apiCall('/api/verify-token', {
    method: 'POST'
  });
};

// Refresh token
export const refreshToken = async () => {
  const response = await apiCall('/api/refresh-token', {
    method: 'POST'
  });
  
  if (response.success && response.token) {
    setToken(response.token);
  }
  
  return response;
};

// Forgot password function
export const forgotPassword = async (email, userType = 'client') => {
  const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, userType }),
  });
  
  return await response.json();
};

// Verify reset token
export const verifyResetToken = async (token, userType = 'client') => {
  const response = await fetch(`${API_BASE_URL}/api/verify-reset-token/${token}?userType=${userType}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return await response.json();
};

// Reset password function
export const resetPassword = async (token, newPassword, userType = 'client') => {
  const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword, userType }),
  });
  
  return await response.json();
}; 