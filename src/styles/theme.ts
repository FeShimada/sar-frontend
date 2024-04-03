
'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    primary: {
      main: '#0089ED' //blue
    },
    secondary: {
      main: '#000000'
    },
    background: {
      default: '#FFFFFF',
    },
    error: {
      main: '#EA3D3D'
    }
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        subtitle1: {
          fontSize: '18px'
        },
        subtitle2: {
          fontSize: '12px'
        },
        h1: {
          fontSize: '44px',
        },
        h2: {
          fontSize: '38px'
        },
        h3: {
          fontSize: '32px'
        },
        h4: {
          fontSize: '25px'
        },
        h5: {
          fontsize: '20px',
        },
        h6: {
          fontSize: '16px'
        },
        root: {
          fontSize: '14px',
          fontWeight: 400,
        },
      },
    }
  }
});

export default theme;
