import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

// Tạo axios instance với token
const createAxiosInstance = () => {
  const token = localStorage.getItem('authToken'); // Sửa từ 'token' thành 'authToken'
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Upload file và tạo song mới
export const uploadSong = async (songData) => {
  try {
    const api = createAxiosInstance();
    
    // Tạo FormData để upload file
    const formData = new FormData();
    formData.append('title', songData.title);
    formData.append('artist', songData.artist);
    formData.append('album', songData.album || '');
    formData.append('duration', songData.duration);
    
    // Upload file nhạc
    if (songData.audioFile) {
      formData.append('audioFile', songData.audioFile);
    }
    
    // Upload file cover image (optional)
    if (songData.coverFile) {
      formData.append('coverFile', songData.coverFile);
    }

    const response = await api.post('/Songs', formData);
    return response.data;
  } catch (error) {
    console.error('Upload song error:', error);
    throw error;
  }
};

// Tạo song với URL (không upload file, chỉ metadata)
export const createSongWithUrl = async (songData) => {
  try {
    const token = localStorage.getItem('authToken');
    
    // Debug log
    console.log('🔑 Token being sent:', token ? 'EXISTS' : 'MISSING');
    console.log('📤 Song data:', songData);
    
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    
    // Backend expects PascalCase properties
    const requestBody = {
      Title: songData.title,
      Artist: songData.artist,
      Album: songData.album || '',
      Duration: songData.duration,
      FilePath: songData.filePath,
      CoverImagePath: songData.coverImagePath || null
    };
    
    console.log('📤 Request body:', requestBody);
    
    const response = await api.post('/Songs', requestBody);
    
    return response.data;
  } catch (error) {
    console.error('Create song error:', error);
    console.error('Response data:', error.response?.data);
    console.error('Response status:', error.response?.status);
    throw error;
  }
};

// Xóa bài hát (chỉ admin)
export const deleteSong = async (songId) => {
  try {
    const api = createAxiosInstance();
    api.defaults.headers['Content-Type'] = 'application/json';
    
    const response = await api.delete(`/Songs/${songId}`);
    return response.status === 204;
  } catch (error) {
    console.error('Delete song error:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết bài hát
export const getSongDetails = async (songId) => {
  try {
    const api = createAxiosInstance();
    api.defaults.headers['Content-Type'] = 'application/json';
    
    const response = await api.get(`/Songs/${songId}`);
    return response.data;
  } catch (error) {
    console.error('Get song details error:', error);
    throw error;
  }
};

// Tìm kiếm bài hát
export const searchSongs = async (query) => {
  try {
    const api = createAxiosInstance();
    api.defaults.headers['Content-Type'] = 'application/json';
    
    const response = await api.get(`/Songs/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Search songs error:', error);
    throw error;
  }
};

// Validate file trước khi upload
export const validateAudioFile = (file) => {
  const allowedTypes = [
    'audio/mpeg', 
    'audio/mp3', 
    'audio/wav', 
    'audio/ogg', 
    'audio/m4a',
    'audio/aac'
  ];
  
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Định dạng file không được hỗ trợ. Chỉ chấp nhận: MP3, WAV, OGG, M4A, AAC');
  }
  
  if (file.size > maxSize) {
    throw new Error('File quá lớn. Kích thước tối đa là 50MB');
  }
  
  return true;
};

// Validate image file
export const validateImageFile = (file) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/gif',
    'image/webp'
  ];
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Định dạng ảnh không được hỗ trợ. Chỉ chấp nhận: JPG, PNG, GIF, WebP');
  }
  
  if (file.size > maxSize) {
    throw new Error('Ảnh quá lớn. Kích thước tối đa là 10MB');
  }
  
  return true;
};

// Lấy thời lượng audio file
export const getAudioDuration = (file) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      resolve(Math.round(audio.duration));
    });
    
    audio.addEventListener('error', (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    });
    
    audio.src = url;
  });
};