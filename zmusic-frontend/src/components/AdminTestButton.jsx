import React from 'react';

function AdminTestButton() {
  const makeUserAdmin = () => {
    // Tạo một token giả với role Admin để test
    const fakeAdminToken = 'fake-admin-token';
    const fakeAdminUser = {
      id: 1,
      email: 'admin@test.com',
      fullName: 'Admin Test',
      role: 'Admin'
    };
    
    localStorage.setItem('authToken', fakeAdminToken); // Sửa từ 'token' thành 'authToken'
    localStorage.setItem('user', JSON.stringify(fakeAdminUser));
    
    // Reload trang để update UI
    window.location.reload();
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 9999
  };

  const btnStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold'
  };

  const adminBtnStyle = {
    ...btnStyle,
    background: '#4CAF50',
    color: 'white'
  };

  const clearBtnStyle = {
    ...btnStyle,
    background: '#ff5252',
    color: 'white'
  };

  return (
    <div style={buttonStyle}>
      <button style={adminBtnStyle} onClick={makeUserAdmin}>
        🔑 Test Admin Login
      </button>
      <button style={clearBtnStyle} onClick={clearAuth}>
        🗑️ Clear Auth
      </button>
    </div>
  );
}

export default AdminTestButton;