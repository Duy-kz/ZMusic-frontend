import React from 'react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

function MusicPlayerDebug() {
  const { playSong, currentSong, isPlaying, error } = useMusicPlayer();

  const testSongs = [
    {
      id: 'debug-1',
      title: 'Test Local MP3',
      artist: 'Debug Artist',
      filePath: '/music/AmThamBenEm.mp3',
      duration: 210
    },
    {
      id: 'debug-2',
      title: 'Test Online Audio',
      artist: 'Online Test',
      filePath: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 3
    }
  ];

  const handleTestPlay = (song) => {
    console.log('🧪 Debug: Testing song:', song);
    playSong(song);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '100px', 
      right: '20px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '15px', 
      borderRadius: '8px',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '250px'
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>🎵 Music Player Debug</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Current:</strong> {currentSong ? currentSong.title : 'None'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Status:</strong> {isPlaying ? '▶️ Playing' : '⏸️ Paused'}
      </div>
      
      {error && (
        <div style={{ marginBottom: '10px', color: '#ff6b6b' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* <div style={{ marginBottom: '10px' }}>
        <strong>Test Songs:</strong>
      </div> */}
      
      {/* {testSongs.map(song => (
        <button
          key={song.id}
          onClick={() => handleTestPlay(song)}
          style={{
            display: 'block',
            width: '100%',
            margin: '5px 0',
            padding: '5px 8px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          ▶️ {song.title}
        </button>
      ))} */}
    </div>
  );
}

export default MusicPlayerDebug;