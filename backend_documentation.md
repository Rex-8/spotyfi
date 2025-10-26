# MERN Music App - Complete Backend API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:5000`  
**Server Framework:** Express.js + Node.js  
**Database:** MongoDB with Mongoose  
**Authentication:** JWT Bearer Tokens  

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Environment Setup](#environment-setup)
3. [Database Schema](#database-schema)
4. [Authentication](#authentication)
5. [API Endpoints](#api-endpoints)
6. [Request/Response Examples](#request-response-examples)
7. [Error Handling](#error-handling)
8. [Deployment Notes](#deployment-notes)

---

## Project Structure

```
backend/
├── config/                   # Database configuration (optional)
├── controllers/              # Business logic for each entity
│   ├── authController.js     # User registration/login
│   ├── userController.js     # User management & following
│   ├── artistController.js   # Artist management & following
│   ├── trackController.js    # Track CRUD & likes
│   ├── albumController.js    # Album CRUD & following
│   └── playlistController.js # Playlist CRUD & management
├── middleware/               # Custom middleware
│   └── auth.js              # JWT token verification
├── models/                  # Mongoose schemas
│   ├── User.js             # User entity
│   ├── Artist.js           # Artist profiles
│   ├── Track.js            # Individual songs
│   ├── Album.js            # Album collections
│   ├── Playlist.js         # User playlists
│   ├── PlaylistTrack.js    # Playlist-track relationships
│   ├── UserFollowers.js    # User following relationships
│   ├── ArtistFollowers.js  # Artist following relationships
│   ├── AlbumFollowers.js   # Album following relationships
│   ├── PlaylistFollowers.js # Playlist following relationships
│   └── Likes.js            # Track likes
├── routes/                 # API route definitions
│   ├── auth.js            # Authentication routes
│   ├── users.js           # User management routes
│   ├── artists.js         # Artist routes
│   ├── tracks.js          # Track routes
│   ├── albums.js          # Album routes
│   └── playlists.js       # Playlist routes
├── .env                   # Environment variables
├── server.js              # Main application entry point
└── package.json           # Dependencies and scripts
```

---

## Environment Setup

### Required Environment Variables (.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_music_app
JWT_SECRET=your_super_secret_jwt_key_here
```

### Dependencies (package.json)

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## Database Schema

### Core Entities

#### User Model
```javascript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  display_name: String,             // Full name for display
  username: String,                 // Unique @username handle
  email: String,                    // Unique email for login
  password_hash: String,            // Bcrypt hashed password
  is_artist: Boolean,               // Can create tracks/albums
  createdAt: Date,                  // Auto-generated timestamp
  updatedAt: Date                   // Auto-generated timestamp
}
```

#### Artist Model (extends User)
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,                // Reference to User document
  bio: String,                      // Artist biography
  genre: String,                    // Primary music genre
  social_links: [String],           // Array of social media URLs
  artist_picture: String,           // Profile picture URL
  createdAt: Date,
  updatedAt: Date
}
```

#### Track Model
```javascript
{
  _id: ObjectId,
  title: String,                    // Song title
  artist_id: ObjectId,              // Reference to Artist
  album_id: ObjectId,               // Reference to Album (optional)
  audio_file_url: String,           // Audio file storage URL
  duration: Number,                 // Track length in seconds
  cover_art_url: String,            // Album/track cover image
  release_date: Date,               // Release date
  createdAt: Date,
  updatedAt: Date
}
```

#### Album Model
```javascript
{
  _id: ObjectId,
  title: String,                    // Album title
  artist_id: ObjectId,              // Reference to Artist
  cover_art_url: String,            // Album cover image
  release_date: Date,               // Album release date
  createdAt: Date,
  updatedAt: Date
}
```

#### Playlist Model
```javascript
{
  _id: ObjectId,
  title: String,                    // Playlist name
  owner_id: ObjectId,               // Reference to User who created it
  collaborators: [ObjectId],        // Array of User IDs with edit access
  is_public: Boolean,               // Public visibility
  cover_image_url: String,          // Playlist cover image
  description: String,              // Playlist description
  createdAt: Date,
  updatedAt: Date
}
```

### Relationship Models

#### PlaylistTrack (Many-to-Many)
```javascript
{
  _id: ObjectId,
  playlist_id: ObjectId,            // Reference to Playlist
  track_id: ObjectId,               // Reference to Track
  order_index: Number,              // Position in playlist
  added_by: ObjectId,               // User who added track
  added_at: Date                    // When track was added
}
```

#### UserFollowers (User-to-User Following)
```javascript
{
  _id: ObjectId,
  follower_id: ObjectId,            // User doing the following
  followed_id: ObjectId,            // User being followed
  createdAt: Date,
  updatedAt: Date
}
```

#### ArtistFollowers (User-to-Artist Following)
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,                // User following the artist
  artist_id: ObjectId,              // Artist being followed
  createdAt: Date,
  updatedAt: Date
}
```

#### AlbumFollowers (User-to-Album Following)
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,                // User following the album
  album_id: ObjectId,               // Album being followed
  followed_at: Date                 // When user followed album
}
```

#### PlaylistFollowers (User-to-Playlist Following)
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,                // User following the playlist
  playlist_id: ObjectId,            // Playlist being followed
  createdAt: Date,
  updatedAt: Date
}
```

#### Likes (User-to-Track Likes)
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,                // User who liked the track
  track_id: ObjectId,               // Track being liked
  liked_at: Date                    // When track was liked
}
```

---

## Authentication

### JWT Token Structure
- **Algorithm:** HS256
- **Expiration:** 7 days
- **Payload:** `{ id: user._id }`

### Protected Routes
All API endpoints require authentication **except**:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /` (health check)

### Authorization Header Format
```
Authorization: Bearer <jwt_token>
```

### Middleware Implementation
The `protect` middleware validates JWT tokens and attaches user info to `req.user` for use in controllers.

---

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /api/auth/register
**Description:** Create a new user account  
**Authentication:** None required  
**Body:**
```json
{
  "display_name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```
**Response:**
```json
{
  "_id": "654321abc",
  "display_name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "is_artist": false,
  "createdAt": "2025-10-26T14:00:00.000Z",
  "updatedAt": "2025-10-26T14:00:00.000Z"
}
```

#### POST /api/auth/login
**Description:** Authenticate user and receive JWT token  
**Authentication:** None required  
**Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "654321abc",
    "display_name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "is_artist": false,
    "createdAt": "2025-10-26T14:00:00.000Z",
    "updatedAt": "2025-10-26T14:00:00.000Z"
  }
}
```

---

### User Management Routes (`/api/users`)

#### GET /api/users
**Description:** Get all users  
**Authentication:** Required  
**Response:**
```json
[
  {
    "_id": "654321abc",
    "display_name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "is_artist": false,
    "createdAt": "2025-10-26T14:00:00.000Z",
    "updatedAt": "2025-10-26T14:00:00.000Z"
  }
]
```

#### GET /api/users/:id
**Description:** Get specific user by ID  
**Authentication:** Required  
**URL Params:** `id` - User's MongoDB ObjectId  
**Response:**
```json
{
  "_id": "654321abc",
  "display_name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "is_artist": false,
  "createdAt": "2025-10-26T14:00:00.000Z",
  "updatedAt": "2025-10-26T14:00:00.000Z"
}
```

#### POST /api/users/follow/:id
**Description:** Follow another user  
**Authentication:** Required  
**URL Params:** `id` - User ID to follow  
**Body:**
```json
{
  "follower_id": "654321abc"
}
```
**Response:**
```json
{
  "_id": "789xyz123",
  "follower_id": "654321abc",
  "followed_id": "456def789",
  "createdAt": "2025-10-26T14:00:00.000Z",
  "updatedAt": "2025-10-26T14:00:00.000Z"
}
```

---

### Artist Routes (`/api/artists`)

#### GET /api/artists
**Description:** Get all artists  
**Authentication:** Required  
**Response:**
```json
[
  {
    "_id": "artist123",
    "user_id": "654321abc",
    "bio": "Independent musician from LA",
    "genre": "Electronic",
    "social_links": ["https://instagram.com/artist", "https://twitter.com/artist"],
    "artist_picture": "https://example.com/picture.jpg",
    "createdAt": "2025-10-26T14:00:00.000Z",
    "updatedAt": "2025-10-26T14:00:00.000Z"
  }
]
```

#### GET /api/artists/:id
**Description:** Get specific artist by ID  
**Authentication:** Required  
**URL Params:** `id` - Artist's MongoDB ObjectId  
**Response:** Single artist object (same structure as array item above)

#### POST /api/artists/follow/:id
**Description:** Follow an artist  
**Authentication:** Required  
**URL Params:** `id` - Artist ID to follow  
**Body:**
```json
{
  "user_id": "654321abc"
}
```
**Response:**
```json
{
  "_id": "follow123",
  "user_id": "654321abc",
  "artist_id": "artist123",
  "createdAt": "2025-10-26T14:00:00.000Z",
  "updatedAt": "2025-10-26T14:00:00.000Z"
}
```

---

### Track Routes (`/api/tracks`)

#### GET /api/tracks
**Description:** Get all tracks  
**Authentication:** Required  
**Response:**
```json
[
  {
    "_id": "track123",
    "title": "Awesome Song",
    "artist_id": "artist123",
    "album_id": "album123",
    "audio_file_url": "https://example.com/audio.mp3",
    "duration": 210,
    "cover_art_url": "https://example.com/cover.jpg",
    "release_date": "2025-10-01T00:00:00.000Z",
    "createdAt": "2025-10-26T14:00:00.000Z",
    "updatedAt": "2025-10-26T14:00:00.000Z"
  }
]
```

#### GET /api/tracks/:id
**Description:** Get specific track by ID  
**Authentication:** Required  
**URL Params:** `id` - Track's MongoDB ObjectId  
**Response:** Single track object (same structure as array item above)

#### POST /api/tracks
**Description:** Create a new track (artists only)  
**Authentication:** Required  
**Body:**
```json
{
  "title": "New Song",
  "artist_id": "artist123",
  "album_id": "album123",
  "audio_file_url": "https://example.com/new-song.mp3",
  "duration": 185,
  "cover_art_url": "https://example.com/new-cover.jpg",
  "release_date": "2025-10-26"
}
```
**Response:** Created track object

#### POST /api/tracks/like/:id
**Description:** Like/unlike a track  
**Authentication:** Required  
**URL Params:** `id` - Track ID to like  
**Body:**
```json
{
  "user_id": "654321abc"
}
```
**Response:**
```json
{
  "_id": "like123",
  "user_id": "654321abc",
  "track_id": "track123",
  "liked_at": "2025-10-26T14:00:00.000Z"
}
```

---

### Album Routes (`/api/albums`)

#### GET /api/albums
**Description:** Get all albums  
**Authentication:** Required  
**Response:**
```json
[
  {
    "_id": "album123",
    "title": "Debut Album",
    "artist_id": "artist123",
    "cover_art_url": "https://example.com/album-cover.jpg",
    "release_date": "2025-09-15T00:00:00.000Z",
    "createdAt": "2025-10-26T14:00:00.000Z",
    "updatedAt": "2025-10-26T14:00:00.000Z"
  }
]
```

#### GET /api/albums/:id
**Description:** Get specific album by ID  
**Authentication:** Required  
**URL Params:** `id` - Album's MongoDB ObjectId  
**Response:** Single album object (same structure as array item above)

#### POST /api/albums
**Description:** Create a new album (artists only)  
**Authentication:** Required  
**Body:**
```json
{
  "title": "New Album",
  "artist_id": "artist123",
  "cover_art_url": "https://example.com/new-album-cover.jpg",
  "release_date": "2025-10-26"
}
```
**Response:** Created album object

#### POST /api/albums/follow/:id
**Description:** Follow an album  
**Authentication:** Required  
**URL Params:** `id` - Album ID to follow  
**Body:**
```json
{
  "user_id": "654321abc"
}
```
**Response:**
```json
{
  "_id": "albumfollow123",
  "user_id": "654321abc",
  "album_id": "album123",
  "followed_at": "2025-10-26T14:00:00.000Z"
}
```

---

### Playlist Routes (`/api/playlists`)

#### GET /api/playlists
**Description:** Get all playlists  
**Authentication:** Required  
**Response:**
```json
[
  {
    "_id": "playlist123",
    "title": "My Favorites",
    "owner_id": "654321abc",
    "collaborators": ["friend123", "friend456"],
    "is_public": true,
    "cover_image_url": "https://example.com/playlist-cover.jpg",
    "description": "My favorite tracks of all time",
    "createdAt": "2025-10-26T14:00:00.000Z",
    "updatedAt": "2025-10-26T14:00:00.000Z"
  }
]
```

#### GET /api/playlists/:id
**Description:** Get specific playlist by ID  
**Authentication:** Required  
**URL Params:** `id` - Playlist's MongoDB ObjectId  
**Response:** Single playlist object (same structure as array item above)

#### POST /api/playlists
**Description:** Create a new playlist  
**Authentication:** Required  
**Body:**
```json
{
  "title": "Weekend Vibes",
  "owner_id": "654321abc",
  "collaborators": [],
  "is_public": false,
  "cover_image_url": "https://example.com/weekend-cover.jpg",
  "description": "Perfect for weekend relaxation"
}
```
**Response:** Created playlist object

#### POST /api/playlists/follow/:id
**Description:** Follow a playlist  
**Authentication:** Required  
**URL Params:** `id` - Playlist ID to follow  
**Body:**
```json
{
  "user_id": "654321abc"
}
```
**Response:**
```json
{
  "_id": "playlistfollow123",
  "user_id": "654321abc",
  "playlist_id": "playlist123",
  "createdAt": "2025-10-26T14:00:00.000Z",
  "updatedAt": "2025-10-26T14:00:00.000Z"
}
```

#### POST /api/playlists/track/:id
**Description:** Add a track to playlist  
**Authentication:** Required  
**URL Params:** `id` - Playlist ID  
**Body:**
```json
{
  "track_id": "track123",
  "order_index": 5,
  "added_by": "654321abc"
}
```
**Response:**
```json
{
  "_id": "playlisttrack123",
  "playlist_id": "playlist123",
  "track_id": "track123",
  "order_index": 5,
  "added_by": "654321abc",
  "added_at": "2025-10-26T14:00:00.000Z"
}
```

---

## Error Handling

### HTTP Status Codes
- `200` - OK (successful GET/PUT/DELETE)
- `201` - Created (successful POST)
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Descriptive error message"
}
```

### Common Error Examples
```json
// Missing authentication token
{
  "error": "No token provided"
}

// Invalid/expired token
{
  "error": "Invalid token"
}

// User not found during login
{
  "error": "User not found"
}

// Invalid login credentials
{
  "error": "Invalid credentials"
}

// MongoDB validation error
{
  "error": "User validation failed: email: Path `email` is required."
}
```

---

## Development Workflow

### Starting the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Testing API Endpoints

#### Using curl
```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"display_name":"Test User","username":"testuser","email":"test@test.com","password":"123456"}'

# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Access protected route
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/users
```

#### Using Postman
1. Set `Authorization` header: `Bearer <your_jwt_token>`
2. Set `Content-Type` header: `application/json`
3. Include request body as raw JSON for POST requests

---

## Deployment Notes

### Environment Variables for Production
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/production_db
JWT_SECRET=super_secure_production_secret_key_minimum_32_characters
NODE_ENV=production
```

### MongoDB Atlas Configuration
1. Replace local MongoDB with Atlas connection string
2. Whitelist deployment server IP addresses
3. Use strong database credentials

### Security Considerations
- Use HTTPS in production
- Implement rate limiting
- Add input validation/sanitization
- Use strong JWT secrets (32+ characters)
- Consider implementing refresh tokens for long-term authentication
- Add CORS whitelist for specific domains

### Additional Features to Implement
- File upload handling for audio/images
- Search functionality across tracks/albums/playlists
- User profile updates
- Password reset functionality
- Email verification
- Real-time notifications
- Admin roles and permissions
- Analytics and usage tracking

---

## Frontend Integration Notes

### API Base URL
Set your frontend API base URL to `http://localhost:5000` during development.

### React Proxy Configuration (package.json)
```json
{
  "proxy": "http://localhost:5000"
}
```

### Axios Configuration Example
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

// Add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### State Management Recommendations
- Use Context API or Redux for authentication state
- Store JWT token in localStorage or httpOnly cookies
- Implement token refresh logic
- Handle token expiration gracefully

---

**Documentation Last Updated:** October 26, 2025  
**API Version:** 1.0  
**Maintainer:** Development Team