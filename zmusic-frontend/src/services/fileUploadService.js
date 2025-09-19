// Service để xử lý upload file với .NET API
import { API_BASE_URL } from '../config/api.js';

// Upload file audio và cover image
export async function uploadFiles(audioFile, coverFile, songData) {
  try {
    const formData = new FormData();
    
    // Thêm file audio (required)
    formData.append('AudioFile', audioFile);
    
    // Thêm file cover image (optional)
    if (coverFile) {
      formData.append('CoverFile', coverFile);
    }
    
    // Thêm thông tin bài hát (theo UploadSongRequest DTO)
    formData.append('Title', songData.title);
    formData.append('Artist', songData.artist);
    formData.append('Album', songData.album || '');
    formData.append('Duration', songData.duration || 0);

    // Lấy token từ localStorage
    const token = localStorage.getItem('authToken');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/songs`, {
      method: 'POST',
      headers: headers,
      body: formData,
      // Không set Content-Type, để browser tự set với boundary cho multipart
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading files:", error);
    throw new Error("Không thể upload file: " + error.message);
  }
}

// Save song data to localStorage (fallback nếu server lỗi)
export async function saveSongToLocal(songData) {
  try {
    const existingSongs = JSON.parse(localStorage.getItem('localSongs') || '[]');
    
    const newSong = {
      id: Date.now().toString(),
      ...songData,
      createdAt: new Date().toISOString()
    };
    
    existingSongs.push(newSong);
    localStorage.setItem('localSongs', JSON.stringify(existingSongs));
    
    return {
      success: true,
      song: newSong
    };
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Không thể lưu bài hát');
  }
}

// Get songs from localStorage
export function getLocalSongs() {
  try {
    return JSON.parse(localStorage.getItem('localSongs') || '[]');
  } catch (error) {
    console.error('Error getting local songs:', error);
    return [];
  }
}

// Validate file types (theo backend .NET validation)
export function validateAudioFileType(file) {
  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac', 'audio/m4a', 'audio/aac'];
  const allowedExtensions = ['.mp3', '.wav', '.flac', '.m4a', '.aac'];
  
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  return allowedTypes.includes(file.type) || allowedExtensions.includes(extension);
}

export function validateImageFileType(file) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  return allowedTypes.includes(file.type) || allowedExtensions.includes(extension);
}

// Get file duration
export function getFileDuration(file) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      resolve(Math.floor(audio.duration));
      URL.revokeObjectURL(audio.src);
    });
    
    audio.addEventListener('error', () => {
      reject(new Error('Không thể đọc thời lượng file'));
      URL.revokeObjectURL(audio.src);
    });
  });
}