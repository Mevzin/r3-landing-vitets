import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppRoutes } from './routes';




function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
