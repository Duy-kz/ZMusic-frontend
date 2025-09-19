import React from 'react';
import { getCurrentUser, isAuthenticated, getAuthToken } from '../services/authService';

function UserDebugInfo() {
  const user = getCurrentUser();
  const authenticated = isAuthenticated();
  const token = getAuthToken();

  return (
    <div style={{
      position: 'fixed',
      top: '400px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 1000,
      border: '1px solid #333',
      minWidth: '200px',
      
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}> User Debug Info</h4>
      
      <div style={{ marginBottom: '5px' }}>
        <strong>Authenticated:</strong> 
        <span style={{ color: authenticated ? '#4CAF50' : '#ff5252', marginLeft: '5px' }}>
          {authenticated ? '✅ Yes' : '❌ No'}
        </span>
      </div>
      
      <div style={{ marginBottom: '5px' }}>
        <strong>Has Token:</strong> 
        <span style={{ color: token ? '#4CAF50' : '#ff5252', marginLeft: '5px' }}>
          {token ? '✅ Yes' : '❌ No'}
        </span>
      </div>
      
      <div style={{ marginBottom: '5px' }}>
        <strong>User Object:</strong> 
        <span style={{ color: user ? '#4CAF50' : '#ff5252', marginLeft: '5px' }}>
          {user ? '✅ Exists' : '❌ Null'}
        </span>
      </div>
      
      {user && (
        <>
          <div style={{ marginBottom: '5px' }}>
            <strong>Name:</strong> {user.fullName || user.name || 'N/A'}
          </div>
          <div style={{ marginBottom: '5px' }}>
            <strong>Email:</strong> {user.email || 'N/A'}
          </div>
          <div style={{ marginBottom: '5px' }}>
            <strong>Role:</strong> 
            <span style={{ color: user.role === 'Admin' ? '#4CAF50' : '#ff9800', marginLeft: '5px' }}>
              {user.role || 'N/A'}
            </span>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <strong>Is Admin:</strong> 
            <span style={{ color: user.role === 'Admin' ? '#4CAF50' : '#ff5252', marginLeft: '5px' }}>
              {user.role === 'Admin' ? '✅ Yes' : '❌ No'}
            </span>
          </div>
        </>
      )}
      
      {token && (
        <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
          <strong>Token (first 20 chars):</strong><br />
          {token.substring(0, 20)}...
        </div>
      )}
      
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={() => console.log('Full user object:', user)}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          Log User to Console
        </button>
      </div>
    </div>
  );
}

export default UserDebugInfo;