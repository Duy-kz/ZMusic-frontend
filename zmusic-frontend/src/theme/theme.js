import { createTheme } from '@mui/material/styles';

// Custom theme for ZMusic
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6b6b',
      light: '#ff8787',
      dark: '#ff5252',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4ecdc4',
      light: '#6dd5cd',
      dark: '#45b7af',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f1419',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    error: {
      main: '#ff5252',
    },
    warning: {
      main: '#ffa726',
    },
    info: {
      main: '#29b6f6',
    },
    success: {
      main: '#66bb6a',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.95rem',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 12,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.05)',
            '&:hover fieldset': {
              borderColor: '#ff6b6b',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff6b6b',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(15, 20, 25, 0.95), rgba(26, 26, 46, 0.95))',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#ff6b6b',
          '& .MuiSlider-thumb': {
            '&:hover, &.Mui-focusVisible': {
              boxShadow: '0 0 0 8px rgba(255, 107, 107, 0.16)',
            },
          },
        },
      },
    },
  },
});

export default theme;
