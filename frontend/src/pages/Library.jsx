import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TrackCard from '../components/tracks/TrackCard';
import AlbumCard from '../components/albums/AlbumCard';
import ArtistCard from '../components/artists/ArtistCard';
import PlaylistCard from '../components/playlists/PlaylistCard';
import Loading from '../components/common/Loading';
import API from '../utils/api';
import './Library.css';

const Library = () => {
  const { type } = useParams(); // 'tracks', 'playlists', 'albums', or 'artists'
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLibraryContent();
  }, [type]);

  const fetchLibraryContent = async () => {
    try {
      setLoading(true);
      let response;

      switch(type) {
        case 'tracks':
          response = await API.get('/api/tracks');
          break;
        case 'playlists':
          response = await API.get('/api/playlists');
          break;
        case 'albums':
          response = await API.get('/api/albums');
          break;
        case 'artists':
          response = await API.get('/api/artists');
          break;
        default:
          response = await API.get('/api/playlists');
      }

      setContent(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load library');
      console.error('Error fetching library:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'tracks': return 'Liked Songs';
      case 'playlists': return 'Your Playlists';
      case 'albums': return 'Saved Albums';
      case 'artists': return 'Following';
      default: return 'Your Library';
    }
  };

  const renderContent = () => {
    if (content.length === 0) {
      return (
        <div className="empty-library">
          <div className="empty-icon">
            {type === 'tracks' && '❤️'}
            {type === 'playlists' && '📝'}
            {type === 'albums' && '💿'}
            {type === 'artists' && '👤'}
          </div>
          <h2>Nothing here yet</h2>
          <p>Start {type === 'tracks' ? 'liking songs' : `following ${type}`} to build your library</p>
        </div>
      );
    }

    return (
      <div className="library-grid">
        {type === 'tracks' && content.map(item => (
          <TrackCard key={item._id} track={item} />
        ))}
        {type === 'playlists' && content.map(item => (
          <PlaylistCard key={item._id} playlist={item} />
        ))}
        {type === 'albums' && content.map(item => (
          <AlbumCard key={item._id} album={item} />
        ))}
        {type === 'artists' && content.map(item => (
          <ArtistCard key={item._id} artist={item} />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="library-page">
        <div className="library-header">
          <h1>{getTitle()}</h1>
          <p>{content.length} {type}</p>
        </div>

        {loading && <Loading message={`Loading ${type}...`} />}

        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={fetchLibraryContent}>Try Again</button>
          </div>
        )}

        {!loading && !error && renderContent()}
      </div>
    </Layout>
  );
};

export default Library;