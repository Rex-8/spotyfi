import { Link } from 'react-router-dom';
import './PlaylistCard.css';

const PlaylistCard = ({ playlist }) => {
  return (
    <Link to={`/playlist/${playlist._id}`} className="playlist-card">
      <div className="playlist-card-image-container">
        <img 
          src={playlist.cover_image_url || 'https://via.placeholder.com/200'} 
          alt={playlist.title}
          className="playlist-card-image"
        />
        <button className="play-button">
          ▶️
        </button>
      </div>
      
      <div className="playlist-card-content">
        <h3 className="playlist-title">{playlist.title}</h3>
        <p className="playlist-description">
          {playlist.description || 'No description'}
        </p>
        <div className="playlist-meta">
          <span className={`privacy-badge ${playlist.is_public ? 'public' : 'private'}`}>
            {playlist.is_public ? '🌐 Public' : '🔒 Private'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;