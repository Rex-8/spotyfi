import { Link } from 'react-router-dom';
import './AlbumCard.css';

const AlbumCard = ({ album }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  return (
    <Link to={`/album/${album._id}`} className="album-card">
      <div className="album-card-image-container">
        <img 
          src={album.cover_art_url || 'https://via.placeholder.com/200'} 
          alt={album.title}
          className="album-card-image"
        />
        <button className="play-button">
          ▶️
        </button>
      </div>
      
      <div className="album-card-content">
        <h3 className="album-title">{album.title}</h3>
        <p className="album-artist">Artist ID: {album.artist_id}</p>
        <p className="album-year">{formatDate(album.release_date)}</p>
      </div>
    </Link>
  );
};

export default AlbumCard;