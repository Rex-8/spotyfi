import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import './TrackCard.css';

const TrackCard = ({ track }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLike = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking like
    setIsLoading(true);
    
    try {
      await API.post(`/api/tracks/like/${track._id}`);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link to={`/track/${track._id}`} className="track-card">
      <div className="track-card-image-container">
        <img 
          src={track.cover_art_url || 'https://via.placeholder.com/200'} 
          alt={track.title}
          className="track-card-image"
        />
        <button className="play-button">
          ▶️
        </button>
      </div>
      
      <div className="track-card-content">
        <h3 className="track-title">{track.title}</h3>
        <p className="track-artist">Artist ID: {track.artist_id}</p>
        
        <div className="track-card-footer">
          <span className="track-duration">
            {track.duration ? formatDuration(track.duration) : '--:--'}
          </span>
          <button 
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={isLoading}
          >
            {isLiked ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default TrackCard;