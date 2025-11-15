import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TrackCard from '../components/tracks/TrackCard';
import AlbumCard from '../components/albums/AlbumCard';
import Loading from '../components/common/Loading';
import API from '../utils/api';
import './ArtistPage.css';

const ArtistPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks' or 'albums'

  useEffect(() => {
    fetchArtistData();
  }, [id]);

  const fetchArtistData = async () => {
    try {
      setLoading(true);
      
      // Fetch artist details
      const artistResponse = await API.get(`/api/artists/${id}`);
      setArtist(artistResponse.data);
      
      // Fetch all tracks and filter by artist_id
      const tracksResponse = await API.get('/api/tracks');
      const artistTracks = tracksResponse.data.filter(
        track => track.artist_id === id
      );
      setTracks(artistTracks);
      
      // Fetch all albums and filter by artist_id
      const albumsResponse = await API.get('/api/albums');
      const artistAlbums = albumsResponse.data.filter(
        album => album.artist_id === id
      );
      setAlbums(artistAlbums);
      
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load artist');
      console.error('Error fetching artist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await API.post(`/api/artists/follow/${id}`);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following artist:', error);
    }
  };

  if (loading) return <Layout><Loading message="Loading artist..." /></Layout>;
  
  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchArtistData}>Try Again</button>
        </div>
      </Layout>
    );
  }

  if (!artist) return <Layout><p>Artist not found</p></Layout>;

  return (
    <Layout>
      <div className="artist-page">
        <div className="artist-header">
          <img 
            src={artist.artist_picture || 'https://via.placeholder.com/300'} 
            alt="Artist"
            className="artist-picture-large"
          />
          
          <div className="artist-info">
            <p className="artist-type">ARTIST</p>
            <h1 className="artist-name-large">
              Artist {artist.user_id?.substring(0, 10)}
            </h1>
            <div className="artist-meta">
              <span>{artist.genre || 'Unknown Genre'}</span>
              <span>•</span>
              <span>{tracks.length} tracks</span>
              <span>•</span>
              <span>{albums.length} albums</span>
            </div>
            
            <div className="artist-actions">
              <button className="play-all-button">
                ▶️ Play All
              </button>
              <button 
                className={`follow-artist-button ${isFollowing ? 'following' : ''}`}
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>

        {artist.bio && (
          <div className="artist-bio">
            <h2>About</h2>
            <p>{artist.bio}</p>
          </div>
        )}

        {artist.social_links && artist.social_links.length > 0 && (
          <div className="artist-social">
            <h3>Social Links</h3>
            <div className="social-links">
              {artist.social_links.map((link, index) => (
                <a 
                  key={index} 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  🔗 {link}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="artist-content">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'tracks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tracks')}
            >
              Tracks ({tracks.length})
            </button>
            <button 
              className={`tab ${activeTab === 'albums' ? 'active' : ''}`}
              onClick={() => setActiveTab('albums')}
            >
              Albums ({albums.length})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'tracks' && (
              <div className="tracks-grid">
                {tracks.length === 0 ? (
                  <p className="empty-message">No tracks yet</p>
                ) : (
                  tracks.map(track => (
                    <TrackCard key={track._id} track={track} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'albums' && (
              <div className="albums-grid">
                {albums.length === 0 ? (
                  <p className="empty-message">No albums yet</p>
                ) : (
                  albums.map(album => (
                    <AlbumCard key={album._id} album={album} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtistPage;