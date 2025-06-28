import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#f50057' },
    background: { default: '#000' },
  },
  typography: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
});

export default theme;
