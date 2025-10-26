import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './styles/variables.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <div className="app-container">
            <main className="main-content">
              <h1 className="page-title">MERN Music App</h1>
              <p className="page-subtitle">Frontend initialized successfully!</p>
            </main>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;