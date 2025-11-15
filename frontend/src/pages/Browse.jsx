import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import TrackCard from '../components/tracks/TrackCard';
import AlbumCard from '../components/albums/AlbumCard';
import ArtistCard from '../components/artists/ArtistCard';
import Loading from '../components/common/Loading';
import API from '../utils/api';
import './Browse.css';

const Browse = () => {
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks', 'albums', or 'artists'

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [tracksRes, albumsRes, artistsRes] = await Promise.all([
        API.get('/api/tracks'),
        API.get('/api/albums'),
        API.get('/api/artists')
      ]);
      console.log('API is working fine')
      
      setTracks(tracksRes.data);
      setAlbums(albumsRes.data);
      setArtists(artistsRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load content');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="browse-page">
        <div className="browse-header">
          <h1>Browse Music</h1>
          <p>Discover tracks, albums, and artists</p>
        </div>

        {loading && <Loading message="Loading content..." />}

        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={fetchAllData}>Try Again</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="browse-tabs">
              <button 
                className={`browse-tab ${activeTab === 'tracks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tracks')}
              >
                Tracks ({tracks.length})
              </button>
              <button 
                className={`browse-tab ${activeTab === 'albums' ? 'active' : ''}`}
                onClick={() => setActiveTab('albums')}
              >
                Albums ({albums.length})
              </button>
              <button 
                className={`browse-tab ${activeTab === 'artists' ? 'active' : ''}`}
                onClick={() => setActiveTab('artists')}
              >
                Artists ({artists.length})
              </button>
            </div>

            <div className="browse-content">
              {activeTab === 'tracks' && (
                tracks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎵</div>
                    <h2>No tracks yet</h2>
                    <p>Be the first to upload some music!</p>
                  </div>
                ) : (
                  <div className="tracks-grid">
                    {tracks.map((track) => (
                      <TrackCard key={track._id} track={track} />
                    ))}
                  </div>
                )
              )}

              {activeTab === 'albums' && (
                albums.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💿</div>
                    <h2>No albums yet</h2>
                    <p>Artists haven't created any albums yet</p>
                  </div>
                ) : (
                  <div className="tracks-grid">
                    {albums.map((album) => (
                      <AlbumCard key={album._id} album={album} />
                    ))}
                  </div>
                )
              )}

              {activeTab === 'artists' && (
                artists.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">👤</div>
                    <h2>No artists yet</h2>
                    <p>No artists have joined yet</p>
                  </div>
                ) : (
                  <div className="tracks-grid">
                    {artists.map((artist) => (
                      <ArtistCard key={artist._id} artist={artist} />
                    ))}
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Browse;