import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/authService';

function QuickAuthTest() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = async () => {
    setLoading(true);
    try {
      // Test đăng nhập với admin từ database (dựa vào ảnh attachment)
      const loginData = {
        email: 'admin@zmusic.com', // Email từ database
        password: 'password123' // Password cần phải đúng với hash trong DB
      };
      
      const result = await loginUser(loginData);
      alert('Đăng nhập thành công! Role: ' + (result.user?.role || 'Unknown'));
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      alert('Lỗi đăng nhập: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRegisterAdmin = async () => {
    setLoading(true);
    try {
      // Đăng ký admin test
      const registerData = {
        email: 'admin@test.com',
        password: 'Admin123!',
        confirmPassword: 'Admin123!',
        fullName: 'Admin Test'
      };
      
      const result = await registerUser(registerData);
      alert('Đăng ký thành công! Bây giờ hãy đăng nhập.');
    } catch (error) {
      console.error('Register error:', error);
      alert('Lỗi đăng ký: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testDirectApi = async () => {
    try {
      const response = await fetch('https://localhost:7151/api/auth/test-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@test.com',
          role: 'Admin'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Tạo admin token thành công!');
        window.location.reload();
      } else {
        alert('API test thất bại: ' + data.message);
      }
    } catch (error) {
      console.error('API test error:', error);
      alert('Không thể kết nối API: ' + error.message);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '120px',
          right: '20px',
          background: '#FF5722',
          color: 'white',
          border: 'none',
          padding: '12px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 1000
        }}
      >
        🔑 Quick Auth
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '120px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 1000,
      border: '1px solid #333',
      minWidth: '220px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, color: '#FF5722' }}>🔑 Quick Auth Test</h4>
        <button 
          onClick={() => setIsVisible(false)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={handleQuickLogin}
          disabled={loading}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Loading...' : '🔓 Login Admin'}
        </button>
        
        <button 
          onClick={handleQuickRegisterAdmin}
          disabled={loading}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Loading...' : '📝 Register Admin'}
        </button>
        
        <button 
          onClick={testDirectApi}
          disabled={loading}
          style={{
            background: '#FF9800',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Loading...' : '🧪 Test API'}
        </button>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
        <strong>Chú ý:</strong> Cần backend chạy trên https://localhost:7151
      </div>
    </div>
  );
}

export default QuickAuthTest;