import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CreatePlaylistModal from '../playlists/CreatePlaylistModal';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'sidebar-link active' : 'sidebar-link';
  };

  const handlePlaylistCreated = (newPlaylist) => {
    console.log('Playlist created:', newPlaylist);
    // Could refresh playlists or navigate to new playlist
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Menu</h3>
          <Link to="/" className={isActive('/')}>
            <span className="icon">🏠</span>
            Home
          </Link>
          <Link to="/browse" className={isActive('/browse')}>
            <span className="icon">🔍</span>
            Browse
          </Link>
          <Link to="/search" className={isActive('/search')}>
            <span className="icon">🔎</span>
            Search
          </Link>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">Library</h3>
          <Link to="/library/tracks" className={isActive('/library/tracks')}>
            <span className="icon">❤️</span>
            Liked Songs
          </Link>
          <Link to="/library/playlists" className={isActive('/library/playlists')}>
            <span className="icon">📝</span>
            Playlists
          </Link>
          <Link to="/library/albums" className={isActive('/library/albums')}>
            <span className="icon">💿</span>
            Albums
          </Link>
          <Link to="/library/artists" className={isActive('/library/artists')}>
            <span className="icon">👤</span>
            Artists
          </Link>
        </div>

        <div className="sidebar-section">
          <button 
            className="create-playlist-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="icon">➕</span>
            Create Playlist
          </button>
        </div>
      </aside>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlaylistCreated={handlePlaylistCreated}
      />
    </>
  );
};

export default Sidebar;