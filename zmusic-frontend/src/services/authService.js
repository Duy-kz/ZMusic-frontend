// services/authService.js
import { API_BASE_URL } from '../config/api.js';
export async function loginUser(loginData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Đăng nhập thất bại');
    }

    // Backend trả về: { token, username, email, role, expiresAt }
    // Chuyển đổi để match với frontend
    const userInfo = {
      id: null, // Backend không trả về ID trong login response
      username: data.username,
      fullName: data.username, // Sử dụng username làm fullName
      email: data.email,
      role: data.role
    };

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(userInfo));
    }

    return {
      token: data.token,
      user: userInfo
    };
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.message || "Không thể kết nối đến server");
  }
}

export async function registerUser(registerData) {
  try {
    console.log('📝 Raw registerData received:', registerData);
    console.log('📡 API URL:', `${API_BASE_URL}/auth/register`);
    
    // Validate input data first
    if (!registerData) {
      throw new Error('No registration data provided');
    }
    
    if (!registerData.username || !registerData.email || !registerData.password) {
      throw new Error('Missing required fields: username, email, or password');
    }
    
    // Backend expects RegisterRequest format - ensure clean strings
    const requestBody = {
      username: String(registerData.username).trim(),
      email: String(registerData.email).trim().toLowerCase(),
      password: String(registerData.password)
    };
    
    console.log('📤 Cleaned request body being sent:', requestBody);
    console.log('📤 Request body JSON:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('📡 Response data:', data);

    // Backend trả về status 201 (Created) khi thành công
    if (!response.ok) {
      // Handle validation errors from backend with detailed logging
      console.error('❌ Backend returned error:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      if (data.errors && Array.isArray(data.errors)) {
        throw new Error(data.errors.join(', '));
      }
      
      if (data.modelState) {
        const validationErrors = Object.entries(data.modelState)
          .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
          .join('; ');
        throw new Error(`Validation errors: ${validationErrors}`);
      }
      
      throw new Error(data.message || 'Đăng ký thất bại');
    }

    console.log('✅ Registration successful!');
    
    // Backend trả về: { token, username, email, role, expiresAt }
    // Chuyển đổi để match với frontend
    const userInfo = {
      id: null,
      username: data.username,
      fullName: data.username, // Sử dụng username làm fullName
      email: data.email,
      role: data.role || 'User'
    };

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      console.log('✅ Token and user info stored in localStorage');
    }

    return {
      token: data.token,
      user: userInfo
    };
  } catch (error) {
    console.error("Register error:", error);
    throw new Error(error.message || "Không thể kết nối đến server");
  }
}

export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export function getAuthToken() {
  return localStorage.getItem('authToken');
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated() {
  const token = getAuthToken();
  return !!token;
}