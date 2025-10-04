import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button, 
  Box,
  Container,
} from '@mui/material';
import {
  MusicNote as MusicNoteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { getCurrentUser, isAuthenticated } from '../services/authService';

function HeaderSimple() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const authenticated = isAuthenticated();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <AppBar position="sticky" elevation={4}>
      <Container maxWidth="xl">
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4, cursor: 'pointer' }} onClick={handleHome}>
            <MusicNoteIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              ZMusic
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* User Controls */}
          {authenticated ? (
            <Typography variant="body2" sx={{ color: 'white' }}>
              Welcome, {user?.username || user?.email}!
            </Typography>
          ) : (
            <Button
              variant="contained"
              startIcon={<PersonIcon />}
              onClick={handleLogin}
            >
              Đăng nhập
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default HeaderSimple;
