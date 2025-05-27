import { createTheme } from '@mui/material/styles';

// 1rem = 16px
const pxToRem = (px: number) => `${px / 16}rem`;

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Vert forêt
      dark: '#1B5E20', // Vert foncé (hover/contrast)
      light: '#A5D6A7', // Vert clair
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4FC3F7', // Bleu doux
      contrastText: '#263238', // Gris foncé
    },
    error: {
      main: '#E53935', // Rouge léger
    },
    warning: {
      main: '#FDD835', // Jaune
    },
    background: {
      default: '#F5F5F5', // Gris clair
      paper: '#FFFFFF',
    },
    text: {
      primary: '#263238', // Gris foncé
      secondary: '#4FC3F7', // Accent secondaire
      disabled: 'rgba(0,0,0,0.4)',
    },
    grey: {
      100: '#F5F5F5',
      800: '#263238',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: pxToRem(32),
      fontWeight: 700,
    },
    h2: {
      fontSize: pxToRem(24),
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: pxToRem(18),
      fontWeight: 500,
    },
    body1: {
      fontSize: pxToRem(16),
      fontWeight: 400,
    },
    button: {
      fontSize: pxToRem(16),
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontSize: pxToRem(14),
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 6,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: `${pxToRem(8)} ${pxToRem(16)}`,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#1B5E20', // Vert foncé
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
          '&:disabled': {
            opacity: 0.4,
            cursor: 'not-allowed',
          },
        },
        containedPrimary: {
          backgroundColor: '#2E7D32',
          color: '#FFFFFF',
        },
        outlinedPrimary: {
          borderColor: '#2E7D32',
          color: '#2E7D32',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#A5D6A7',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #BDBDBD',
          '&:hover': {
            backgroundColor: '#F1F8F1',
          },
          '&.Mui-disabled': {
            opacity: 0.4,
            cursor: 'not-allowed',
          },
        },
        input: {
          '::placeholder': {
            color: '#BDBDBD',
            opacity: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            borderColor: '#2E7D32',
            boxShadow: '0 0 0 2px rgba(46,125,50,0.2)',
          },
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(14),
          fontWeight: 500,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        '*': {
          boxSizing: 'border-box',
        },
        '*::before': {
          boxSizing: 'inherit',
        },
        '*::after': {
          boxSizing: 'inherit',
        },
        html: {
          fontSize: '1rem', // 16px
        },
        body: {
          margin: 0,
          fontFamily: themeParam.typography.fontFamily,
          backgroundColor: themeParam.palette.background.default,
          color: themeParam.palette.text.primary,
        },
        h1: {
          fontSize: themeParam.typography.h1.fontSize,
          fontWeight: themeParam.typography.h1.fontWeight,
        },
        h2: {
          fontSize: themeParam.typography.h2.fontSize,
          fontWeight: themeParam.typography.h2.fontWeight,
        },
        a: {
          color: themeParam.palette.primary.dark,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        button: {
          fontFamily: themeParam.typography.fontFamily,
          fontSize: themeParam.typography.button.fontSize,
          backgroundColor: themeParam.palette.primary.main,
          color: themeParam.palette.primary.contrastText,
          padding: '0.5rem 1rem',
          borderRadius: themeParam.shape.borderRadius,
          border: 'none',
        },
      }),

      // ... les autres overrides de Button, Input, etc.
    },
  },
});

export default theme;
