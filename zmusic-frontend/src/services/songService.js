// services/songService.js
import { API_BASE_URL } from '../config/api.js';

export async function getAllSongs() {
  try {
    const response = await fetch(`${API_BASE_URL}/songs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Backend trả về dữ liệu trong format {value: [...], Count: number}
    return data.value || data;
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw new Error("Không thể lấy dữ liệu bài hát từ server");
  }
}

// Additional service functions for future use
export async function getSongById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/songs/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching song:", error);
    throw new Error("Không thể lấy thông tin bài hát");
  }
}

export async function searchSongs(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/songs/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching songs:", error);
    throw new Error("Không thể tìm kiếm bài hát");
  }
}

