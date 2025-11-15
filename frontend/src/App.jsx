import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Browse from './pages/Browse';
import AlbumPage from './pages/AlbumPage';
import ArtistPage from './pages/ArtistPage';
import TrackPage from './pages/TrackPage';
import PlaylistPage from './pages/PlaylistPage';
import Library from './pages/Library';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/browse" 
            element={
              <ProtectedRoute>
                <Browse />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/track/:id" 
            element={
              <ProtectedRoute>
                <TrackPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/album/:id" 
            element={
              <ProtectedRoute>
                <AlbumPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/artist/:id" 
            element={
              <ProtectedRoute>
                <ArtistPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/playlist/:id" 
            element={
              <ProtectedRoute>
                <PlaylistPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/library/:type" 
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;