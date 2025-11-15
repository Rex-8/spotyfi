import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import './ArtistCard.css';

const ArtistCard = ({ artist }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await API.post(`/api/artists/follow/${artist._id}`);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following artist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link to={`/artist/${artist._id}`} className="artist-card">
      <div className="artist-card-image-container">
        <img 
          src={artist.artist_picture || 'https://via.placeholder.com/200'} 
          alt={artist.user_id}
          className="artist-card-image"
        />
      </div>
      
      <div className="artist-card-content">
        <h3 className="artist-name">Artist {artist.user_id?.substring(0, 8)}</h3>
        <p className="artist-genre">{artist.genre || 'Unknown Genre'}</p>
        
        <button 
          className={`follow-button ${isFollowing ? 'following' : ''}`}
          onClick={handleFollow}
          disabled={isLoading}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </Link>
  );
};

export default ArtistCard;