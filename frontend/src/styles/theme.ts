// frontend/src/styles/theme/ts
import { createTheme } from '@mui/material/styles';

const colors = {
  greenForest: '#2E7D32',
  greenDark: '#1B5E20',
  greenLight: '#A5D6A7',
  blueSoft: '#4FC3F7',
  grayDark: '#263238',
  grayLight: '#F5F5F5',
  white: '#FFFFFF',
  redLight: '#E53935',
  yellow: '#FDD835',
  disabledText: 'rgba(0,0,0,0.4)',
  borderGray: '#BDBDBD',
};

// 1rem = 16px
const pxToRem = (px: number) => `${px / 16}rem`;

const theme = createTheme({
  palette: {
    primary: {
      main: colors.greenForest, // Vert forêt
      dark: colors.greenDark, // Vert foncé (hover/contrast)
      light: colors.greenLight, // Vert clair
      contrastText: colors.white,
    },
    secondary: {
      main: colors.blueSoft, // Bleu doux
      contrastText: colors.grayDark, // Gris foncé
    },
    error: {
      main: colors.redLight, // Rouge léger
    },
    warning: {
      main: colors.yellow, // Jaune
    },
    background: {
      default: colors.greenLight, // Gris clair
      paper: colors.grayLight,
    },
    text: {
      primary: colors.grayDark, // Gris foncé
      secondary: colors.blueSoft, // Accent secondaire
      disabled: colors.disabledText,
    },
    grey: {
      100: colors.grayLight,
      800: colors.grayDark,
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
            backgroundColor: colors.greenDark, // Vert foncé
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
          '&:disabled': {
            opacity: 0.4,
            cursor: 'not-allowed',
          },
        },
        containedPrimary: {
          backgroundColor: colors.greenForest,
          color: colors.white,
        },
        outlinedPrimary: {
          borderColor: colors.greenForest,
          color: colors.greenForest,
          backgroundColor: colors.white,
          '&:hover': {
            backgroundColor: colors.greenLight,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white,
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
            color: colors.borderGray,
            opacity: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            borderColor: colors.greenForest,
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
