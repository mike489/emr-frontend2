import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { AppRouter } from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lightTheme, darkTheme } from './theme';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AppRouter darkMode={darkMode} onToggleTheme={toggleTheme} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
    </ThemeProvider>
  );
}

export default App;
