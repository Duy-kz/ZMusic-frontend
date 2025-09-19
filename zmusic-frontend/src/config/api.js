// config/api.js - Centralized API configuration

// Determine the correct backend URL
const getBackendUrl = () => {
  // Try to get from environment variables first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback to the correct backend port - user confirmed 7151 is correct
  return "https://localhost:7151";
};

export const API_BASE_URL = `${getBackendUrl()}/api`;

// For debugging
console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🔧 Environment VITE_API_URL:', import.meta.env.VITE_API_URL);

export default API_BASE_URL;