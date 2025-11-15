import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Loading from '../components/common/Loading';
import API from '../utils/api';
import './TrackPage.css';

const TrackPage = () => {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchTrackData();
  }, [id]);

  const fetchTrackData = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/tracks/${id}`);
      setTrack(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load track');
      console.error('Error fetching track:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await API.post(`/api/tracks/like/${id}`);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking track:', error);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) return <Layout><Loading message="Loading track..." /></Layout>;
  
  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchTrackData}>Try Again</button>
        </div>
      </Layout>
    );
  }

  if (!track) return <Layout><p>Track not found</p></Layout>;

  return (
    <Layout>
      <div className="track-page">
        <div className="track-hero">
          <img 
            src={track.cover_art_url || 'https://via.placeholder.com/400'} 
            alt={track.title}
            className="track-cover-hero"
          />
          
          <div className="track-info-hero">
            <p className="track-type">SONG</p>
            <h1 className="track-title-hero">{track.title}</h1>
            
            <div className="track-meta-hero">
              <Link to={`/artist/${track.artist_id}`} className="track-artist-link">
                Artist ID: {track.artist_id?.substring(0, 10)}
              </Link>
              {track.album_id && (
                <>
                  <span>•</span>
                  <Link to={`/album/${track.album_id}`} className="track-album-link">
                    Album
                  </Link>
                </>
              )}
              <span>•</span>
              <span>{formatDate(track.release_date)}</span>
              <span>•</span>
              <span>{formatDuration(track.duration)}</span>
            </div>
          </div>
        </div>

        <div className="track-controls">
          <button className="play-track-button">
            ▶️ Play
          </button>
          
          <button 
            className={`like-track-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            {isLiked ? '❤️ Liked' : '🤍 Like'}
          </button>
          
          <button className="add-to-playlist-button">
            ➕ Add to Playlist
          </button>
          
          <button className="share-button">
            🔗 Share
          </button>
        </div>

        <div className="track-details">
          <div className="detail-section">
            <h2>Track Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{formatDuration(track.duration)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Release Date</span>
                <span className="detail-value">{formatDate(track.release_date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Artist</span>
                <Link to={`/artist/${track.artist_id}`} className="detail-link">
                  View Artist Profile
                </Link>
              </div>
              {track.album_id && (
                <div className="detail-item">
                  <span className="detail-label">Album</span>
                  <Link to={`/album/${track.album_id}`} className="detail-link">
                    View Album
                  </Link>
                </div>
              )}
            </div>
          </div>

          {track.audio_file_url && (
            <div className="detail-section">
              <h2>Audio Player</h2>
              <audio controls className="audio-player">
                <source src={track.audio_file_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackPage;