import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9106d7ff', // Neon purple
      light: '#d580ff',
      dark: '#8000cc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4d1aff', // Electric blue
      light: '#8c66ff',
      dark: '#3300cc',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0f',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    error: {
      main: '#ff0055',
    },
    success: {
      main: '#b829ff',
    },
  },
  typography: {
    fontFamily: "'Rajdhani', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(26, 26, 46, 0.8), rgba(26, 26, 46, 0.9))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 159, 0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(26, 26, 46, 0.8), rgba(26, 26, 46, 0.9))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 159, 0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
        contained: {
          boxShadow: '0 0 10px rgba(0, 255, 159, 0.3)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 255, 159, 0.5)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 255, 159, 0.1)',
        },
      },
    },
  },
});