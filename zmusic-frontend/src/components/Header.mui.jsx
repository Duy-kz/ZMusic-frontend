import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  InputBase, 
  Button, 
  Menu, 
  MenuItem, 
  Box,
  Container,
  Avatar,
  Chip,
  styled,
  alpha
} from '@mui/material';
import {
  MusicNote as MusicNoteIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  Leaderboard as LeaderboardIcon,
  QueueMusic as PlaylistIcon,
} from '@mui/icons-material';
import { getCurrentUser, isAuthenticated, logout } from '../services/authService';

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.10),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
      '&:focus': {
        width: '50ch',
      },
    },
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  
  const user = getCurrentUser();
  const authenticated = isAuthenticated();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality here
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const handleUpload = () => {
    navigate('/upload');
    handleUserMenuClose();
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <MusicNoteIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}
              >
                ZMusic
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  display: 'block',
                }}
              >
                Nhạc hay vãi nho
              </Typography>
            </Box>
          </Box>

          {/* Navigation Menu - Desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <NavButton 
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
            >
              Trang chủ
            </NavButton>
            <NavButton startIcon={<CategoryIcon />}>
              Thể loại
            </NavButton>
            <NavButton startIcon={<LeaderboardIcon />}>
              BXH
            </NavButton>
            <NavButton startIcon={<PlaylistIcon />}>
              Playlist
            </NavButton>
            
            {user?.role === 'Admin' && (
              <NavButton 
                startIcon={<UploadIcon />}
                onClick={handleUpload}
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                }}
              >
                Upload
              </NavButton>
            )}
          </Box>

          {/* Search Bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <form onSubmit={handleSearch}>
              <StyledInputBase
                placeholder="Tìm bài hát, nghệ sĩ, MV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputProps={{ 'aria-label': 'search' }}
              />
            </form>
          </Search>

          {/* User Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {authenticated ? (
              <>
                {user?.role === 'Admin' && (
                  <Chip 
                    label="Admin" 
                    color="primary" 
                    size="small"
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  />
                )}
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{ 
                    border: 2, 
                    borderColor: 'primary.main',
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'primary.main' 
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{
                    '& .MuiPaper-root': {
                      mt: 1,
                      minWidth: 200,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user?.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  {user?.role === 'Admin' && (
                    <MenuItem onClick={handleUpload}>
                      <UploadIcon sx={{ mr: 1 }} fontSize="small" />
                      Upload Music
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<PersonIcon />}
                onClick={handleLogin}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Đăng nhập
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
