import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#0e7490',
    },
    secondary: {
      main: '#d97706',
    },
    background: {
      default: '#fcfbf7',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
    h2: {
      fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
      fontWeight: 700,
      lineHeight: 1.04,
      letterSpacing: '-0.05em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 22px 70px rgba(15, 23, 42, 0.08)',
        },
      },
    },
  },
})
