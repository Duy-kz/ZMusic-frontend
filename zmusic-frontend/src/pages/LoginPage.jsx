import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { loginUser, registerUser, isAuthenticated } from '../services/authService';
import '../assets/css/pages/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  // Form validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (formData, isLoginForm = true) => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email là bắt buộc';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      errors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!isLoginForm) {
      if (!formData.fullName) {
        errors.fullName = 'Họ tên là bắt buộc';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }
    
    return errors;
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    
    if (formType === 'login') {
      setLoginForm(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setRegisterForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const formData = isLogin ? loginForm : registerForm;
    const errors = validateForm(formData, isLogin);
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setFieldErrors({});
    setLoading(true);
    
    try {
      let response;
      
      if (isLogin) {
        response = await loginUser({
          email: loginForm.email,
          password: loginForm.password
        });
      } else {
        response = await registerUser({
          username: registerForm.fullName, // Backend expects 'username', not 'fullName'
          email: registerForm.email,
          password: registerForm.password
        });
      }
      
      setSuccess(isLogin ? 'Đăng nhập thành công!' : 'Đăng ký thành công!');
      
      // Redirect to home page after successful login/register
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFieldErrors({});
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ email: '', password: '', confirmPassword: '', fullName: '' });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon">🎵</span>
            <span className="login-logo-text">ZMusic</span>
          </div>
          <h1 className="login-title">
            {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
          </h1>
          <p className="login-subtitle">
            {isLogin 
              ? 'Đăng nhập để khám phá thế giới âm nhạc' 
              : 'Tham gia cộng đồng âm nhạc ZMusic'
            }
          </p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Đăng nhập
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Đăng ký
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                className={`form-input ${fieldErrors.fullName ? 'error' : ''}`}
                placeholder="Nhập họ và tên của bạn"
                value={registerForm.fullName}
                onChange={(e) => handleInputChange(e, 'register')}
              />
              {fieldErrors.fullName && (
                <div className="error-message">
                  <span>⚠️</span>
                  <span>{fieldErrors.fullName}</span>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-input ${fieldErrors.email ? 'error' : ''}`}
              placeholder="Nhập email của bạn"
              value={isLogin ? loginForm.email : registerForm.email}
              onChange={(e) => handleInputChange(e, isLogin ? 'login' : 'register')}
            />
            {fieldErrors.email && (
              <div className="error-message">
                <span>⚠️</span>
                <span>{fieldErrors.email}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              className={`form-input ${fieldErrors.password ? 'error' : ''}`}
              placeholder="Nhập mật khẩu"
              value={isLogin ? loginForm.password : registerForm.password}
              onChange={(e) => handleInputChange(e, isLogin ? 'login' : 'register')}
            />
            {fieldErrors.password && (
              <div className="error-message">
                <span>⚠️</span>
                <span>{fieldErrors.password}</span>
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                placeholder="Nhập lại mật khẩu"
                value={registerForm.confirmPassword}
                onChange={(e) => handleInputChange(e, 'register')}
              />
              {fieldErrors.confirmPassword && (
                <div className="error-message">
                  <span>⚠️</span>
                  <span>{fieldErrors.confirmPassword}</span>
                </div>
              )}
            </div>
          )}

          {isLogin && (
            <div className="forgot-password">
              <a href="#forgot">Quên mật khẩu?</a>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading && <div className="loading-spinner"></div>}
            {loading 
              ? (isLogin ? 'Đang đăng nhập...' : 'Đang đăng ký...') 
              : (isLogin ? 'Đăng nhập' : 'Đăng ký')
            }
          </button>
        </form>

        <div className="auth-divider">
          <span>hoặc tiếp tục với</span>
        </div>

        <div className="social-login">
          <button className="social-btn" title="Google">
            🔍
          </button>
          <button className="social-btn" title="Facebook">
            📘
          </button>
          <button className="social-btn" title="Apple">
            🍎
          </button>
        </div>

        <div className="login-footer">
          <p>
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <a href="#switch" onClick={(e) => { e.preventDefault(); switchAuthMode(); }}>
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;