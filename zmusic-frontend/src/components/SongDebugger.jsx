import React, { useState, useEffect } from 'react';
import { getAllSongs } from '../services/songService';

function SongDebugger() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllSongs();
      setSongs(data);
      console.log('Songs data:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#1a1a2e', color: 'white', minHeight: '100vh' }}>
      <h2>Song API Debugger</h2>
      
      <button onClick={testConnection} disabled={loading} style={{
        padding: '10px 20px',
        backgroundColor: '#ff6b6b',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '20px'
      }}>
        {loading ? 'Loading...' : 'Test Connection'}
      </button>

      {error && (
        <div style={{ color: '#ff6b6b', marginBottom: '20px' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {songs.length > 0 && (
        <div>
          <h3>Songs ({songs.length} found):</h3>
          <pre style={{ 
            backgroundColor: '#2a2a3e', 
            padding: '15px', 
            borderRadius: '5px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(songs, null, 2)}
          </pre>
        </div>
      )}

      {!loading && songs.length === 0 && !error && (
        <p>No songs found. Make sure your backend is running on https://localhost:7151</p>
      )}
    </div>
  );
}

export default SongDebugger;