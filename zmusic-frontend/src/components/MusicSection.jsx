import React, { useRef } from 'react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { Play, Pause, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import '../assets/css/components/MusicSection.css';

// Helper function to format duration from seconds to mm:ss
const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Helper function để build URL cho backend files (image/audio)
const buildBackendUrl = (filePath) => {
  if (!filePath) return null;
  
  // Nếu đã là URL đầy đủ thì return luôn
  if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('blob:')) {
    return filePath;
  }
  
  // Nếu là path từ backend (bắt đầu với /music/ hoặc /covers/)
  if (filePath.startsWith('/music/') || filePath.startsWith('/covers/')) {
    // Lấy backend URL từ environment hoặc default
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${backendUrl}${filePath}`;
  }
  
  return filePath;
};

function MusicSection({ title, subtitle, items, type = 'song' }) {
  const scrollRef = useRef(null);
  const { playSong, currentSong, isPlaying } = useMusicPlayer();

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount;
      } else {
        current.scrollLeft += scrollAmount;
      }
    }
  };

  const renderItem = (item, index) => {
    if (type === 'artist') {
      return (
        <div key={item.id || index} className="music-item artist-item">
          <div className="item-image">
            <img src={item.image || `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2YjZiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4ke2l0ZW0ubmFtZX08L3RleHQ+PC9zdmc+`} alt={item.name} />
            <div className="item-overlay">
              <button className="play-btn">
                <Play size={18} />
              </button>
              <button className="add-btn">
                <Plus size={18} />
              </button>
            </div>
          </div>
          <div className="item-info">
            <h4 className="item-title">{item.name}</h4>
            <p className="item-subtitle">{item.followers || '1.2M'} followers</p>
          </div>
        </div>
      );
    }

    if (type === 'album') {
      return (
        <div key={item.id || index} className="music-item album-item">
          <div className="item-image">
            <img src={item.image || `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGVjZGM0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4ke2l0ZW0udGl0bGV9PC90ZXh0Pjwvc3ZnPg==`} alt={item.title} />
            <div className="item-overlay">
              <button className="play-btn">
                <Play size={18} />
              </button>
              <button className="add-btn">
                <Plus size={18} />
              </button>
            </div>
          </div>
          <div className="item-info">
            <h4 className="item-title">{item.title}</h4>
            <p className="item-subtitle">{item.artist}</p>
            <span className="item-year">{item.year}</span>
          </div>
        </div>
      );
    }

    // Default: song type
    const isCurrentSong = currentSong && currentSong.id === item.id;
    const isCurrentPlaying = isCurrentSong && isPlaying;

    const handlePlayClick = () => {
      if (item.filePath) {
        playSong(item);
      } else {
        console.warn('No file path for song:', item.title);
      }
    };

    return (
      <div key={item.id || index} className={`music-item song-item ${isCurrentSong ? 'current-song' : ''}`}>
        <div className="item-image">
          <img 
            src={buildBackendUrl(item.coverImagePath) || `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDViN2QxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7in6XvuI/wn47liJI8L3RleHQ+PC9zdmc+`} 
            alt={item.title} 
            onError={(e) => {
              // Fallback khi không load được ảnh từ backend
              console.warn('Failed to load cover image:', buildBackendUrl(item.coverImagePath));
              e.target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDViN2QxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7in6XvuI/wn47liJI8L3RleHQ+PC9zdmc+`;
            }}
          />
          <div className="item-overlay">
            <button 
              className={`play-btn ${isCurrentPlaying ? 'playing' : ''}`}
              onClick={handlePlayClick}
              title={isCurrentPlaying ? 'Đang phát' : 'Phát nhạc'}
            >
              {isCurrentPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button className="add-btn" title="Thêm vào playlist">
              <Plus size={18} />
            </button>
          </div>
        </div>
        <div className="item-info">
          <h4 className="item-title">{item.title}</h4>
          <p className="item-subtitle">{item.artist}</p>
          <div className="item-stats">
            {item.album && <span className="album">Album: {item.album}</span>}
            <span className="duration">{formatDuration(item.duration)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="music-section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        
        <div className="section-controls">
          <button className="scroll-btn scroll-left" onClick={() => scroll('left')}>
            <ChevronLeft size={18} />
          </button>
          <button className="scroll-btn scroll-right" onClick={() => scroll('right')}>
            <ChevronRight size={18} />
          </button>
          <button className="view-all-btn">Xem tất cả</button>
        </div>
      </div>

      <div className="music-list-wrapper">
        <div className="music-list" ref={scrollRef}>
          {items && items.length > 0 ? (
            items.map((item, index) => renderItem(item, index))
          ) : (
            // Placeholder items if no data
            Array.from({ length: 8 }, (_, index) => renderItem({
              id: index,
              title: `Bài hát ${index + 1}`,
              artist: `Nghệ sĩ ${index + 1}`,
              name: `Nghệ sĩ ${index + 1}`,
              plays: '1.2M',
              duration: '3:45',
              year: '2024'
            }, index))
          )}
        </div>
      </div>
    </section>
  );
}

export default MusicSection;