import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎵 Music App
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/browse" className="nav-link">Browse</Link>
          <Link to="/library" className="nav-link">Library</Link>
          {user?.is_artist && (
            <Link to="/upload" className="nav-link">Upload</Link>
          )}
        </div>

        <div className="navbar-right">
          <div className="user-menu">
            <button className="user-button">
              <span className="user-avatar">
                {user?.display_name?.charAt(0).toUpperCase()}
              </span>
              <span className="user-name">{user?.display_name}</span>
            </button>
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">Profile</Link>
              <Link to="/settings" className="dropdown-item">Settings</Link>
              <hr className="dropdown-divider" />
              <button onClick={logout} className="dropdown-item logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;