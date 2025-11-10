import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Welcome to Music App!</h1>
      <p>Hello, {user?.display_name || 'User'}!</p>
      <p>Email: {user?.email}</p>
      <p>Username: @{user?.username}</p>
      <p>Artist Account: {user?.is_artist ? 'Yes' : 'No'}</p>
      
      <button 
        onClick={logout}
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Logout
      </button>
      
      <p style={{ marginTop: '40px', color: '#666' }}>
        More features coming soon...
      </p>
    </div>
  );
};

export default Home;