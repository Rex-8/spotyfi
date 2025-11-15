import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="home-page">
        <div className="welcome-section">
          <h1>Welcome back, {user?.display_name}! 👋</h1>
          <p>Ready to discover some amazing music?</p>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">🎵</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Liked Songs</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Playlists</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Following</p>
            </div>
          </div>
          
          {user?.is_artist && (
            <div className="stat-card highlight">
              <div className="stat-icon">🎤</div>
              <div className="stat-info">
                <h3>Artist</h3>
                <p>Account Active</p>
              </div>
            </div>
          )}
        </div>

        <div className="home-sections">
          <section className="home-section">
            <h2>Recently Played</h2>
            <p className="empty-message">Start listening to see your recent tracks here</p>
          </section>

          <section className="home-section">
            <h2>Recommended for You</h2>
            <p className="empty-message">Explore music to get personalized recommendations</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Home;