import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import Loading from '../components/common/Loading';
import API from '../utils/api';
import './PlaylistPage.css';

const PlaylistPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchPlaylistData();
  }, [id]);

  const fetchPlaylistData = async () => {
    try {
      setLoading(true);
      
      // Fetch playlist details
      const playlistResponse = await API.get(`/api/playlists/${id}`);
      setPlaylist(playlistResponse.data);
      
      // Fetch all tracks (in real app, would filter by playlist)
      const tracksResponse = await API.get('/api/tracks');
      // For now, showing all tracks as we don't have PlaylistTrack queries
      setTracks(tracksResponse.data.slice(0, 10));
      
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load playlist');
      console.error('Error fetching playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await API.post(`/api/playlists/follow/${id}`);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following playlist:', error);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOwner = user?._id === playlist?.owner_id;

  if (loading) return <Layout><Loading message="Loading playlist..." /></Layout>;
  
  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchPlaylistData}>Try Again</button>
        </div>
      </Layout>
    );
  }

  if (!playlist) return <Layout><p>Playlist not found</p></Layout>;

  return (
    <Layout>
      <div className="playlist-page">
        <div className="playlist-header">
          <img 
            src={playlist.cover_image_url || 'https://via.placeholder.com/300'} 
            alt={playlist.title}
            className="playlist-cover-large"
          />
          
          <div className="playlist-info">
            <p className="playlist-type">PLAYLIST</p>
            <h1 className="playlist-title-large">{playlist.title}</h1>
            
            {playlist.description && (
              <p className="playlist-description-large">{playlist.description}</p>
            )}
            
            <div className="playlist-meta">
              <span>Owner ID: {playlist.owner_id?.substring(0, 8)}</span>
              <span>•</span>
              <span>{tracks.length} songs</span>
              <span>•</span>
              <span className={`privacy-indicator ${playlist.is_public ? 'public' : 'private'}`}>
                {playlist.is_public ? '🌐 Public' : '🔒 Private'}
              </span>
            </div>
            
            <div className="playlist-actions">
              <button className="play-all-button">
                ▶️ Play All
              </button>
              
              {!isOwner && (
                <button 
                  className={`follow-playlist-button ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
              
              {isOwner && (
                <button className="edit-playlist-button">
                  ✏️ Edit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="playlist-tracks">
          <h2>Tracks</h2>
          {tracks.length === 0 ? (
            <div className="empty-playlist">
              <p>No tracks in this playlist yet</p>
              {isOwner && (
                <button className="add-tracks-button">Add Tracks</button>
              )}
            </div>
          ) : (
            <div className="tracks-list">
              {tracks.map((track, index) => (
                <div key={track._id} className="track-row">
                  <span className="track-number">{index + 1}</span>
                  <div className="track-info">
                    <p className="track-title">{track.title}</p>
                    <p className="track-artist">Artist ID: {track.artist_id}</p>
                  </div>
                  <span className="track-duration">{formatDuration(track.duration)}</span>
                  {isOwner && (
                    <button className="remove-track-button" title="Remove from playlist">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PlaylistPage;