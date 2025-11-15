import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Loading from '../components/common/Loading';
import API from '../utils/api';
import './AlbumPage.css';

const AlbumPage = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchAlbumData();
  }, [id]);

  const fetchAlbumData = async () => {
    try {
      setLoading(true);
      
      // Fetch album details
      const albumResponse = await API.get(`/api/albums/${id}`);
      setAlbum(albumResponse.data);
      
      // Fetch all tracks and filter by album_id
      const tracksResponse = await API.get('/api/tracks');
      const albumTracks = tracksResponse.data.filter(
        track => track.album_id === id
      );
      setTracks(albumTracks);
      
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load album');
      console.error('Error fetching album:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await API.post(`/api/albums/follow/${id}`);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following album:', error);
    }
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

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <Layout><Loading message="Loading album..." /></Layout>;
  
  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchAlbumData}>Try Again</button>
        </div>
      </Layout>
    );
  }

  if (!album) return <Layout><p>Album not found</p></Layout>;

  return (
    <Layout>
      <div className="album-page">
        <div className="album-header">
          <img 
            src={album.cover_art_url || 'https://via.placeholder.com/300'} 
            alt={album.title}
            className="album-cover-large"
          />
          
          <div className="album-info">
            <p className="album-type">ALBUM</p>
            <h1 className="album-title-large">{album.title}</h1>
            <div className="album-meta">
              <span>Artist ID: {album.artist_id}</span>
              <span>•</span>
              <span>{formatDate(album.release_date)}</span>
              <span>•</span>
              <span>{tracks.length} songs</span>
            </div>
            
            <div className="album-actions">
              <button className="play-all-button">
                ▶️ Play All
              </button>
              <button 
                className={`follow-album-button ${isFollowing ? 'following' : ''}`}
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>

        <div className="album-tracks">
          <h2>Tracks</h2>
          {tracks.length === 0 ? (
            <p className="no-tracks">No tracks in this album yet</p>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AlbumPage;