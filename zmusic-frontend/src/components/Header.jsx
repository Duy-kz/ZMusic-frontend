import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser, isAuthenticated, logout } from '../services/authService';
import '../assets/css/components/Header.css';

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const user = getCurrentUser();
  const authenticated = isAuthenticated();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality here
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">🎵</span>
            <span className="logo-text">ZMusic</span>
          </div>
          <span className="tagline">Nhạc hay vãi nho</span>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <a href="http://localhost:5173/" className="nav-item active">Trang chủ</a>
          <a href="#" className="nav-item">Thể loại</a>
          <a href="#" className="nav-item">BXH</a>
          <a href="#" className="nav-item">Playlist</a>
   
          
          {/* Admin menu */}
          {user?.role === 'Admin' && (
            <a 
              href="/upload" 
              className="nav-item admin-nav"
              onClick={(e) => {
                e.preventDefault();
                navigate('/upload');
              }}
            >
              🎵 Upload
            </a>
          )}
        </nav>

        {/* Search Bar */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Tìm bài hát, nghệ sĩ, MV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide-search"
              >
                <path d="m21 21-4.34-4.34"/>
                <circle cx="11" cy="11" r="8"/>
              </svg>
            </button>
          </form>
        </div>

        {/* User Controls */}
        <div className="user-controls">
          {authenticated ? (
            <>
              {user?.role === 'Admin' && (
                <button 
                  className="control-btn upload-btn"
                  onClick={() => navigate('/upload')}
                  title="Tải lên nhạc mới"
                >
                   Tải lên
                </button>
              )}
              
              {/* <button className="control-btn vip-btn">
                 VIP
              </button> */}

              <button className="control-btn settings-btn">
                 Cài đặt
              </button>

              <div className="user-menu">
                <button 
                  className="user-avatar"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  title={user?.fullName || user?.email || 'User'}
                >
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : '👤'}
                </button>
                
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <span className="user-name">{user?.fullName || 'User'}</span>
                      <span className="user-email">{user?.email}</span>
                    </div>
                    <hr />
                    <a href="#" className="dropdown-item">Thông tin cá nhân</a>
                    <a href="#" className="dropdown-item">Playlist của tôi</a>
                   
                    <a href="#" className="dropdown-item">Cài đặt</a>
                    <hr />
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
            

              <button 
                className="control-btn login-btn"
                onClick={handleLogin}
              >
                Đăng Ký
              </button>

               <button 
                className="control-btn login-btn"
                onClick={handleLogin}
              >
                Đăng nhập
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;