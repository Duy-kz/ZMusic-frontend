import React, { useEffect } from 'react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { FaPlay, FaPause, FaRedo, FaStepForward } from 'react-icons/fa';
import '../assets/css/components/MusicPlayer.css';

const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isLoading,
    error,
    togglePlayPause,
    stopSong,
    seekTo,
    changeVolume,
    getUrlType
  } = useMusicPlayer();

  // Handle restart song (phát lại)
  const handleRestart = () => {
    seekTo(0);
  };

  // Handle next song (tạm thời dừng bài hiện tại - có thể mở rộng sau)
  const handleNext = () => {
    // TODO: Implement next song functionality
    // For now, just stop current song
    console.log('Next song feature - coming soon!');
    stopSong();
  };

  // Add/remove body class when player is shown/hidden
  useEffect(() => {
    if (currentSong) {
      document.body.classList.add('has-music-player');
    } else {
      document.body.classList.remove('has-music-player');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('has-music-player');
    };
  }, [currentSong]);

  // Don't render if no song is selected
  if (!currentSong) {
    return null;
  }

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const urlType = getUrlType(currentSong.filePath);

  return (
    <div className="music-player">
      <div className="player-container">
        {/* Song Info */}
        <div className="song-info">
          <div className="song-cover">
            <img 
              src={currentSong.coverImagePath || `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzQ1YjdkMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4p+l77iPQjwvdGV4dD48L3N2Zz4=`}
              alt={currentSong.title}
            />
          </div>
          <div className="song-details">
            <h4 className="song-title">{currentSong.title}</h4>
            <p className="song-artist">{currentSong.artist}</p>
            <div className="url-type-indicator">
              {urlType === 'youtube' && (
                <span className="url-type youtube">
                  📺 YouTube
                </span>
              )}
              {urlType === 'local' && (
                <span className="url-type local">
                  📁 File
                </span>
              )}
              {urlType === 'audio' && (
                <span className="url-type audio">
                  🎵 Audio
                </span>
              )}
              {urlType === 'online' && (
                <span className="url-type online">
                  🌐 Online
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="player-controls">
          <div className="control-buttons">
            {/* Restart Button (Phát lại) */}
            <button 
              className="control-btn restart-btn"
              onClick={handleRestart}
              title="Phát lại từ đầu"
            >
              ↻ <FaRedo size={20} />
            </button>
            
            {/* Play/Pause Button */}
            <button 
              className={`control-btn play-pause-btn ${isLoading ? 'loading' : ''}`}
              onClick={togglePlayPause}
              disabled={isLoading}
              title={isPlaying ? 'Tạm dừng' : 'Phát'}
            >
              {isLoading ? (
                <div className="loading-spinner">⟳</div>
              ) : isPlaying ? (
                '❚❚'
              ) : (
                '▶'
              )}
            </button>

            {/* Next Button */}
            <button 
              className="control-btn next-btn"
              onClick={handleNext}
              title="Bài tiếp theo"
            >
              ▶❚
            </button>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <span className="time current-time">{formatTime(currentTime)}</span>
            <div 
              className="progress-bar" 
              onClick={handleProgressClick}
              title="Click to seek"
            >
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
                <div 
                  className="progress-thumb" 
                  style={{ left: `${progress}%` }}
                ></div>
              </div>
            </div>
            <span className="time total-time">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="volume-control">
          <span className="volume-icon">
            🔊
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            title="Volume"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="player-error">
          <span className="error-icon">
            ⚠️
          </span>
          <span className="error-message">{error}</span>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;