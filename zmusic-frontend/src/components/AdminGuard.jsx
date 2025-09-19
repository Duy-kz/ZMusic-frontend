import React from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser } from '../services/authService';

function AdminGuard({ children }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  React.useEffect(() => {
    // Kiểm tra xem user có phải admin không
    if (!user) {
      // Chưa đăng nhập - chuyển đến trang login
      navigate('/login');
      return;
    }

    if (user.role !== 'Admin') {
      // Không phải admin - chuyển về trang chủ
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Chỉ render children nếu user là admin
  if (!user || user.role !== 'Admin') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0F111A, #16213e)',
        color: 'white',
        fontSize: '18px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>🔒 Truy cập bị từ chối</h2>
          <p>Chỉ Admin mới có thể truy cập trang này.</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminGuard;