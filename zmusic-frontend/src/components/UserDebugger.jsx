import React from 'react';
import { getCurrentUser, isAuthenticated } from '../services/authService';

function UserDebugger() {
  const user = getCurrentUser();
  const authenticated = isAuthenticated();
  const token = localStorage.getItem('token');

  const debugStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '12px',
    zIndex: 9999,
    maxWidth: '300px',
    border: '2px solid #4CAF50'
  };

  return (
    <div style={debugStyle}>
      <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>🔍 User Debug Info</h4>
      <div><strong>Authenticated:</strong> {authenticated ? '✅ Yes' : '❌ No'}</div>
      <div><strong>Has Token:</strong> {token ? '✅ Yes' : '❌ No'}</div>
      <div><strong>User Object:</strong> {user ? '✅ Exists' : '❌ Null'}</div>
      {user && (
        <>
          <div><strong>Email:</strong> {user.email || 'N/A'}</div>
          <div><strong>Name:</strong> {user.fullName || 'N/A'}</div>
          <div><strong>Role:</strong> <span style={{color: user.role === 'Admin' ? '#4CAF50' : '#ff6b6b'}}>{user.role || 'N/A'}</span></div>
          <div><strong>Is Admin:</strong> {user.role === 'Admin' ? '✅ Yes' : '❌ No'}</div>
        </>
      )}
      {token && (
        <div style={{ marginTop: '10px', fontSize: '10px', wordBreak: 'break-all' }}>
          <strong>Token:</strong> {token.substring(0, 50)}...
        </div>
      )}
    </div>
  );
}

export default UserDebugger;