import { createTheme } from '@mui/material/styles';
import { arEG } from '@mui/material/locale';

const theme = createTheme(
  {
    direction: 'rtl',

    typography: {
      fontFamily: 'Tajawal, sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },

    palette: {
      primary: {
        main: '#b69143', // الذهبي الأساسي
        dark: '#b08937', // الذهبي الغامق
        light: '#e0c17b', // الذهبي الفاتح
        contrastText: '#fff',
      },
      secondary: {
        main: '#b69143',
      },
      success: {
        main: '#10b981',
      },
      error: {
        main: '#ef4444',
      },
      background: {
        default: '#fdfaf5', // خلفية فاتحة تميل للعاجي
        paper: '#ffffff',
      },
      text: {
        primary: '#1f1f1f',
        secondary: '#6b7280',
      },
    },

    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            direction: 'rtl',
            textAlign: 'right',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            textAlign: 'right',
            direction: 'rtl',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 'bold',
            padding: '10px 16px',
            color: '#fff',
            backgroundColor: '#b69143',
            boxShadow: '0 4px 10px rgba(182,145,67,0.25)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#b08937',
              boxShadow: '0 6px 12px rgba(182,145,67,0.35)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: '1px solid rgba(182,145,67,0.2)', // بوردر ذهبي شفاف
            boxShadow: '0 4px 20px rgba(182,145,67,0.15)', // ظل ذهبي ناعم
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 24px rgba(182,145,67,0.25)',
            },
          },
        },
      },
    },
  },
  arEG
);

export default theme;
