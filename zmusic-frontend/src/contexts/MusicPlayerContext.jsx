import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const MusicPlayerContext = createContext();

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

export const MusicPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const audioRef = useRef(null);

  // Helper function để xác định loại URL
  const getUrlType = (url) => {
    if (!url) return 'unknown';
    
    // Check if it's a YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    }
    
    // Check if it's a blob URL (from file upload)
    if (url.startsWith('blob:')) {
      return 'blob';
    }
    
    // Check if it's a backend file path (từ wwwroot)
    if (url.startsWith('/music/') || url.startsWith('/covers/')) {
      return 'backend';
    }
    
    // Check if it's a local file URL (từ public folder hoặc relative path)
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return 'local';
    }
    
    // Check if it's a direct audio file URL
    if (url.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) {
      return 'audio';
    }
    
    // Check if it's from localhost
    if (url.startsWith('http://localhost') || url.startsWith('https://localhost')) {
      return 'local';
    }
    
    // Other online audio sources
    return 'online';
  };

  // Helper function để build URL cho backend files
  const buildBackendUrl = (filePath) => {
    // Nếu đã là URL đầy đủ thì return luôn
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    
    // Nếu là path từ backend (bắt đầu với /music/ hoặc /covers/)
    if (filePath.startsWith('/music/') || filePath.startsWith('/covers/')) {
      // Lấy backend URL từ environment hoặc fallback options
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:7000';
      console.log('🔗 Building backend URL:', `${backendUrl}${filePath}`);
      return `${backendUrl}${filePath}`;
    }
    
    return filePath;
  };

  // Test URL accessibility
  const testUrlAccessibility = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn('❌ URL not accessible:', url, error.message);
      return false;
    }
  };

  // Play a song
  const playSong = async (song) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🎵 Playing song:', song.title, 'URL:', song.filePath);
      
      if (!song.filePath) {
        throw new Error('Không có đường dẫn file cho bài hát này');
      }

      const urlType = getUrlType(song.filePath);
      console.log('🔗 URL Type:', urlType);
      
      let finalUrl = song.filePath;
      
      // Handle different URL types
      if (urlType === 'youtube') {
        throw new Error('Hiện tại chưa hỗ trợ phát từ YouTube. Vui lòng sử dụng link audio trực tiếp.');
      } else if (urlType === 'backend') {
        finalUrl = buildBackendUrl(song.filePath);
        console.log('🏗️ Built backend URL:', finalUrl);
        
        const isAccessible = await testUrlAccessibility(finalUrl);
        if (!isAccessible) {
          throw new Error(`Không thể truy cập file từ backend: ${finalUrl}. Kiểm tra backend có đang chạy không?`);
        }
      } else if (urlType === 'blob') {
        finalUrl = song.filePath;
        console.log('📁 Using blob URL:', finalUrl);
      } else if (urlType === 'audio' || urlType === 'local' || urlType === 'online') {
        finalUrl = song.filePath;
        console.log('🎯 Using direct URL:', finalUrl);
      }

      if (audioRef.current) {
        console.log('🎯 Setting audio source:', finalUrl);
        audioRef.current.src = finalUrl;
        
        audioRef.current.onerror = (e) => {
          console.error('❌ Audio load error:', e);
          const errorMsg = `Không thể tải file nhạc: ${finalUrl}`;
          setError(errorMsg);
          setSnackbar({ open: true, message: errorMsg, severity: 'error' });
          setIsPlaying(false);
        };
        
        await audioRef.current.load();
      }

      setCurrentSong(song);
      setIsPlaying(true);
      setSnackbar({ open: true, message: `Đang phát: ${song.title}`, severity: 'success' });
      
      if (audioRef.current) {
        console.log('▶️ Starting playback...');
        await audioRef.current.play();
        console.log('✅ Playback started successfully');
      }
    } catch (err) {
      console.error('❌ Error playing song:', err);
      setError(err.message);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Pause/Resume
  const togglePlayPause = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Stop playing
  const stopSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Seek to specific time
  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Change volume
  const changeVolume = (newVolume) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError('Không thể phát bài hát này');
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const value = {
    // State
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isLoading,
    error,
    
    // Actions
    playSong,
    togglePlayPause,
    stopSong,
    seekTo,
    changeVolume,
    
    // Utils
    getUrlType,
    
    // Snackbar
    showSnackbar: (message, severity = 'info') => {
      setSnackbar({ open: true, message, severity });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="metadata"
        style={{ display: 'none' }}
      />
      
      {/* Snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ mb: 10 }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MusicPlayerContext.Provider>
  );
};

export default MusicPlayerContext;