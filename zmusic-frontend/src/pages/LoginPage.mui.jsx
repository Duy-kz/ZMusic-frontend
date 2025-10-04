import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Tab,
  Tabs,
  Stack,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  MusicNote as MusicNoteIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { loginUser, registerUser, isAuthenticated } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
      setLoginForm(prev => ({ ...prev, [name]: value }));
    } else {
      setRegisterForm(prev => ({ ...prev, [name]: value }));
    }
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
    setFieldErrors({});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const errors = validateForm(loginForm, true);
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      console.log('🔐 Attempting login with:', loginForm.email);
      
      const response = await loginUser({
        email: loginForm.email,
        password: loginForm.password
      });
      
      console.log('✅ Login successful:', response);
      setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Đăng nhập thất bại';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const errors = validateForm(registerForm, false);
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      console.log('📝 Attempting registration:', registerForm.email);
      
      const response = await registerUser({
        email: registerForm.email,
        password: registerForm.password,
        fullName: registerForm.fullName
      });
      
      console.log('✅ Registration successful:', response);
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      
      setRegisterForm({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
      });
      
      setTimeout(() => {
        setTabValue(0);
        setSuccess('');
      }, 2000);
      
    } catch (err) {
      console.error('❌ Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Đăng ký thất bại';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Card
            elevation={10}
            sx={{
              borderRadius: 3,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(20px)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Logo & Title */}
              <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  <MusicNoteIcon sx={{ fontSize: 48, color: 'white' }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ZMusic
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nhạc hay vãi nho 🎵
                </Typography>
              </Stack>

              {/* Tabs */}
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  mb: 3,
                  '& .MuiTab-root': {
                    fontSize: '1rem',
                    fontWeight: 600,
                  },
                }}
              >
                <Tab label="Đăng nhập" />
                <Tab label="Đăng ký" />
              </Tabs>

              {/* Alerts */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              {/* Login Form */}
              {tabValue === 0 && (
                <Box component="form" onSubmit={handleLogin}>
                  <Stack spacing={2.5}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => handleInputChange(e, 'login')}
                      error={!!fieldErrors.email}
                      helperText={fieldErrors.email}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Mật khẩu"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => handleInputChange(e, 'login')}
                      error={!!fieldErrors.password}
                      helperText={fieldErrors.password}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        mt: 2,
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Register Form */}
              {tabValue === 1 && (
                <Box component="form" onSubmit={handleRegister}>
                  <Stack spacing={2.5}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="fullName"
                      value={registerForm.fullName}
                      onChange={(e) => handleInputChange(e, 'register')}
                      error={!!fieldErrors.fullName}
                      helperText={fieldErrors.fullName}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => handleInputChange(e, 'register')}
                      error={!!fieldErrors.email}
                      helperText={fieldErrors.email}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Mật khẩu"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={registerForm.password}
                      onChange={(e) => handleInputChange(e, 'register')}
                      error={!!fieldErrors.password}
                      helperText={fieldErrors.password}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Xác nhận mật khẩu"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerForm.confirmPassword}
                      onChange={(e) => handleInputChange(e, 'register')}
                      error={!!fieldErrors.confirmPassword}
                      helperText={fieldErrors.confirmPassword}
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        mt: 2,
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Đăng ký'}
                    </Button>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginPage;
