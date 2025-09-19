import React from 'react';
import '../assets/css/components/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Description */}
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">🎵</span>
            <span className="logo-text">ZMusic</span>
          </div>
          <p className="footer-description">
            Nền tảng nghe nhạc hàng đầu Việt Nam với kho nhạc khổng lồ và chất lượng âm thanh tuyệt vời.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">📷</a>
            <a href="#" className="social-link">🐦</a>
            <a href="#" className="social-link">📺</a>
            <a href="#" className="social-link">🎵</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-title">Khám Phá</h4>
          <ul className="footer-links">
            <li><a href="#">BXH Nhạc Mới</a></li>
            <li><a href="#">Thể Loại</a></li>
            <li><a href="#">Top 100</a></li>
            <li><a href="#">MV</a></li>
            <li><a href="#">Podcast</a></li>
            <li><a href="#">Radio</a></li>
          </ul>
        </div>

        {/* Artists */}
        <div className="footer-section">
          <h4 className="footer-title">Nghệ Sĩ</h4>
          <ul className="footer-links">
            <li><a href="#">Nghệ sĩ Việt Nam</a></li>
            <li><a href="#">Nghệ sĩ Quốc Tế</a></li>
            <li><a href="#">Nghệ sĩ Indie</a></li>
            <li><a href="#">Nhạc sĩ</a></li>
            <li><a href="#">Producer</a></li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-section">
          <h4 className="footer-title">Công ty</h4>
          <ul className="footer-links">
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Tuyển dụng</a></li>
            <li><a href="#">Liên hệ</a></li>
            <li><a href="#">Quảng cáo</a></li>
            <li><a href="#">Đối tác</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4 className="footer-title">Hỗ trợ</h4>
          <ul className="footer-links">
            <li><a href="#">Trung tâm hỗ trợ</a></li>
            <li><a href="#">Điều khoản sử dụng</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Bản quyền âm nhạc</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* Download App */}
        <div className="footer-section">
          <h4 className="footer-title">Tải Ứng Dụng</h4>
          <div className="app-downloads">
            <a href="#" className="download-link">
              <div className="download-icon">📱</div>
              <div className="download-info">
                <span className="download-text">Chưa Hỗ Trợ</span>
                <span className="download-store">App Store</span>
              </div>
            </a>
            <a href="#" className="download-link">
              <div className="download-icon">🤖</div>
              <div className="download-info">
                <span className="download-text">Chưa Hỗ Trợ</span>
                <span className="download-store">Google Play</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="bottom-content">
            <p className="copyright">
              © 2024 ZMusic. Phát hay cả rồi. Tất cả các quyền được bảo lưu.
            </p>
            <div className="footer-bottom-links">
              <a href="#">Chính sách Cookie</a>
              <a href="#">Báo cáo vi phạm bản quyền</a>
              <a href="#">Quảng cáo</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;