#!/usr/bin/env python3
"""
Seed music database for MERN Music App
- Reads album names from folder names
- Reads track titles from file names
- Creates dummy artists with fake names
- Creates dummy users and playlists

Place in backend/ folder and run: python3 seed_music.py
"""

from pathlib import Path
from tinytag import TinyTag
from pymongo import MongoClient
from datetime import datetime, timedelta
from bson import ObjectId
import urllib.parse
import random

# ================================
# CONFIG
# ================================
MUSIC_DIR = Path("./public/Music")  # Relative to backend folder
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "mern_music_app"
BASE_URL = "http://localhost:5000/Music"  # URL prefix for audio files

# ================================
# DUMMY ARTIST NAMES
# ================================
DUMMY_ARTISTS = [
    {"name": "Luna Rivers", "genre": "R&B", "bio": "Soulful voice with smooth melodies"},
    {"name": "Max Thunder", "genre": "Hip-Hop", "bio": "Bringing raw energy to every track"},
    {"name": "Aria Stone", "genre": "Pop", "bio": "Chart-topping hits and catchy hooks"},
    {"name": "Phoenix Blake", "genre": "Trap", "bio": "Trap beats with lyrical fire"},
    {"name": "Nova Sky", "genre": "Electronic", "bio": "Pushing boundaries of electronic music"},
]

# ================================
# CONNECT TO MONGODB
# ================================
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_col = db.users
artists_col = db.artists
albums_col = db.albums
tracks_col = db.tracks
playlists_col = db.playlists
playlist_tracks_col = db.playlisttracks
likes_col = db.likes
artist_followers_col = db.artistfollowers
album_followers_col = db.albumfollowers

print("="*70)
print("MERN Music App - Music Seeder (Dummy Artists)")
print("="*70)
print(f"Scanning: {MUSIC_DIR.absolute()}\n")

if not MUSIC_DIR.exists():
    print(f"ERROR: Music folder not found at {MUSIC_DIR.absolute()}")
    print("Please move your Music folder to backend/public/Music/")
    exit(1)

# ================================
# CLEAR EXISTING DATA
# ================================
print("Clearing existing data...")
tracks_col.delete_many({})
albums_col.delete_many({})
artists_col.delete_many({})
playlists_col.delete_many({})
playlist_tracks_col.delete_many({})
likes_col.delete_many({})
artist_followers_col.delete_many({})
album_followers_col.delete_many({})
# Keep real users, only delete test users
users_col.delete_many({"email": {"$regex": "@example.com$"}})
print("✓ Cleared existing music data\n")

# ================================
# CREATE DUMMY REGULAR USERS
# ================================
print("Creating dummy users...")

dummy_users = [
    {
        "display_name": "John Smith",
        "username": "johnsmith",
        "email": "john@example.com",
        "password_hash": "$2b$10$dummyhashdummyhashdummyhashdummyhashdummyhash",
        "is_artist": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "display_name": "Sarah Johnson",
        "username": "sarahjohnson",
        "email": "sarah@example.com",
        "password_hash": "$2b$10$dummyhashdummyhashdummyhashdummyhashdummyhash",
        "is_artist": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "display_name": "Mike Wilson",
        "username": "mikewilson",
        "email": "mike@example.com",
        "password_hash": "$2b$10$dummyhashdummyhashdummyhashdummyhashdummyhash",
        "is_artist": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    },
    {
        "display_name": "Emily Davis",
        "username": "emilydavis",
        "email": "emily@example.com",
        "password_hash": "$2b$10$dummyhashdummyhashdummyhashdummyhashdummyhash",
        "is_artist": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
]

regular_user_ids = []
for user in dummy_users:
    user_id = users_col.insert_one(user).inserted_id
    regular_user_ids.append(user_id)
    print(f"  ✓ Created user: {user['display_name']}")

print()

# ================================
# CREATE DUMMY ARTISTS
# ================================
print("Creating dummy artists...")

artist_ids = []
for artist_data in DUMMY_ARTISTS:
    # Create user for artist
    username = artist_data['name'].lower().replace(" ", "")
    artist_user = {
        "display_name": artist_data['name'],
        "username": username,
        "email": f"{username}@example.com",
        "password_hash": "$2b$10$dummyhashdummyhashdummyhashdummyhashdummyhash",
        "is_artist": True,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    artist_user_id = users_col.insert_one(artist_user).inserted_id
    
    # Create artist profile
    artist_profile = {
        "user_id": artist_user_id,
        "bio": artist_data['bio'],
        "genre": artist_data['genre'],
        "social_links": [
            f"https://instagram.com/{username}",
            f"https://twitter.com/{username}"
        ],
        "artist_picture": f"http://localhost:5000/images/artists/{username}.jpg",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    artist_id = artists_col.insert_one(artist_profile).inserted_id
    artist_ids.append(artist_id)
    
    print(f"  ✓ Created artist: {artist_data['name']} ({artist_data['genre']})")

print()

# ================================
# SCAN AND SEED ALBUMS & TRACKS
# ================================
print("Scanning albums and tracks...\n")

albums_created = {}
all_track_ids = []
tracks_added = 0
tracks_skipped = 0

# Get all album folders
album_folders = [f for f in MUSIC_DIR.iterdir() if f.is_dir()]

if not album_folders:
    print("ERROR: No album folders found!")
    exit(1)

# Assign albums to artists (distribute evenly)
for idx, album_folder in enumerate(album_folders):
    album_name = album_folder.name
    
    # Get list of tracks
    mp3_files = sorted(list(album_folder.glob("*.mp3")))
    if not mp3_files:
        print(f"⚠ Skipping empty album folder: {album_name}\n")
        continue
    
    print(f"📀 Processing Album: {album_name}")
    print(f"   Found {len(mp3_files)} tracks")
    
    # Assign to a dummy artist (round-robin)
    artist_id = artist_ids[idx % len(artist_ids)]
    artist_name = DUMMY_ARTISTS[idx % len(DUMMY_ARTISTS)]['name']
    
    print(f"   Assigned to artist: {artist_name}")
    
    # Generate random release date (between 2015-2024)
    days_ago = random.randint(365, 3650)  # 1-10 years
    release_date = datetime.utcnow() - timedelta(days=days_ago)
    
    # Create album document
    album_doc = {
        "title": album_name,
        "artist_id": artist_id,
        "cover_art_url": f"http://localhost:5000/images/albums/{album_folder.name.lower().replace(' ', '-')}.jpg",
        "release_date": release_date,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    album_id = albums_col.insert_one(album_doc).inserted_id
    albums_created[album_name] = album_id
    
    # Process each track
    for track_num, mp3_file in enumerate(mp3_files, start=1):
        try:
            # Read metadata for duration
            tag = TinyTag.get(str(mp3_file))
            
            # Extract title from filename
            filename = mp3_file.stem
            
            # Remove _SPOTISAVER suffix
            if "_SPOTISAVER" in filename:
                filename = filename.replace("_SPOTISAVER", "").strip()
            
            # Remove artist prefix if present (format: "Artist - Title")
            title = filename
            if " - " in filename:
                parts = filename.split(" - ", 1)
                title = parts[1].strip() if len(parts) > 1 else filename
            
            # Try ID3 tag for title as fallback
            if tag.title and tag.title.strip():
                title = tag.title.strip()
            
            # Duration with fallback
            duration = int(tag.duration) if tag.duration and tag.duration > 0 else random.randint(150, 300)
            
            # Build audio URL (properly encode spaces and special chars)
            relative_path = f"{album_folder.name}/{mp3_file.name}"
            encoded_path = urllib.parse.quote(relative_path)
            audio_url = f"{BASE_URL}/{encoded_path}"
            
            # Create track document
            track_doc = {
                "title": title,
                "artist_id": artist_id,
                "album_id": album_id,
                "audio_file_url": audio_url,
                "duration": duration,
                "cover_art_url": album_doc["cover_art_url"],
                "release_date": release_date,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            
            track_id = tracks_col.insert_one(track_doc).inserted_id
            all_track_ids.append(track_id)
            tracks_added += 1
            print(f"      ✓ Track {track_num}: {title} ({duration}s)")
            
        except Exception as e:
            print(f"      ✗ Failed: {mp3_file.name} - {e}")
            tracks_skipped += 1
    
    print()  # Empty line between albums

# ================================
# CREATE DUMMY PLAYLISTS
# ================================
print("Creating dummy playlists...\n")

playlist_data = [
    {
        "title": "Chill Vibes",
        "description": "Perfect for relaxing and unwinding",
        "is_public": True,
        "owner_id": regular_user_ids[0]
    },
    {
        "title": "Workout Mix",
        "description": "High energy tracks to keep you motivated",
        "is_public": True,
        "owner_id": regular_user_ids[1]
    },
    {
        "title": "Late Night Drives",
        "description": "Smooth tracks for nighttime cruising",
        "is_public": True,
        "owner_id": regular_user_ids[2]
    },
    {
        "title": "Party Hits",
        "description": "Get the party started with these bangers",
        "is_public": False,
        "owner_id": regular_user_ids[3]
    },
    {
        "title": "Study Session",
        "description": "Focus music for productive studying",
        "is_public": True,
        "owner_id": regular_user_ids[0]
    }
]

playlist_ids = []
for playlist_info in playlist_data:
    playlist_doc = {
        "title": playlist_info["title"],
        "owner_id": playlist_info["owner_id"],
        "collaborators": [],
        "is_public": playlist_info["is_public"],
        "cover_image_url": f"http://localhost:5000/images/playlists/{playlist_info['title'].lower().replace(' ', '-')}.jpg",
        "description": playlist_info["description"],
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    playlist_id = playlists_col.insert_one(playlist_doc).inserted_id
    playlist_ids.append(playlist_id)
    print(f"  ✓ Created playlist: {playlist_info['title']}")
    
    # Add random tracks to playlist (5-15 tracks each)
    if all_track_ids:
        num_tracks = random.randint(5, min(15, len(all_track_ids)))
        selected_tracks = random.sample(all_track_ids, num_tracks)
        
        for order_idx, track_id in enumerate(selected_tracks):
            playlist_track_doc = {
                "playlist_id": playlist_id,
                "track_id": track_id,
                "order_index": order_idx,
                "added_by": playlist_info["owner_id"],
                "added_at": datetime.utcnow()
            }
            playlist_tracks_col.insert_one(playlist_track_doc)

print()

# ================================
# CREATE DUMMY LIKES
# ================================
if all_track_ids:
    print("Creating dummy track likes...")
    num_likes = min(30, len(all_track_ids))
    for _ in range(num_likes):
        like_doc = {
            "user_id": random.choice(regular_user_ids),
            "track_id": random.choice(all_track_ids),
            "liked_at": datetime.utcnow()
        }
        try:
            likes_col.insert_one(like_doc)
        except:
            pass  # Skip if duplicate
    print(f"  ✓ Created {likes_col.count_documents({})} track likes\n")

# ================================
# CREATE DUMMY ARTIST FOLLOWERS
# ================================
print("Creating dummy artist followers...")

for artist_id in artist_ids:
    # Each artist gets 2-4 followers
    num_followers = random.randint(2, min(4, len(regular_user_ids)))
    selected_users = random.sample(regular_user_ids, num_followers)
    
    for user_id in selected_users:
        follower_doc = {
            "user_id": user_id,
            "artist_id": artist_id,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        try:
            artist_followers_col.insert_one(follower_doc)
        except:
            pass  # Skip if duplicate

print(f"  ✓ Created {artist_followers_col.count_documents({})} artist followers\n")

# ================================
# CREATE DUMMY ALBUM FOLLOWERS
# ================================
print("Creating dummy album followers...")

for album_id in albums_created.values():
    # Each album gets 1-3 followers
    num_followers = random.randint(1, min(3, len(regular_user_ids)))
    selected_users = random.sample(regular_user_ids, num_followers)
    
    for user_id in selected_users:
        follower_doc = {
            "user_id": user_id,
            "album_id": album_id,
            "followed_at": datetime.utcnow()
        }
        try:
            album_followers_col.insert_one(follower_doc)
        except:
            pass

print(f"  ✓ Created {album_followers_col.count_documents({})} album followers\n")

# ================================
# SUMMARY
# ================================
print("="*70)
print("SEEDING COMPLETED SUCCESSFULLY!")
print("="*70)
print(f"Regular users:       {len(regular_user_ids)}")
print(f"Artists (dummy):     {len(artist_ids)}")
print(f"Albums:              {len(albums_created)}")
print(f"Tracks added:        {tracks_added}")
print(f"Tracks skipped:      {tracks_skipped}")
print(f"Playlists:           {len(playlist_ids)}")
print(f"Track likes:         {likes_col.count_documents({})}")
print(f"Artist followers:    {artist_followers_col.count_documents({})}")
print(f"Album followers:     {album_followers_col.count_documents({})}")
print("="*70)
print("\nDummy Artists Created:")
for artist in DUMMY_ARTISTS:
    print(f"  - {artist['name']} ({artist['genre']})")
print("\nAlbums Found:")
for album_name in albums_created.keys():
    print(f"  - {album_name}")
print("\nVerify in MongoDB:")
print(f"  db.users.count()            -> {users_col.count_documents({})}")
print(f"  db.artists.count()          -> {artists_col.count_documents({})}")
print(f"  db.albums.count()           -> {albums_col.count_documents({})}")
print(f"  db.tracks.count()           -> {tracks_col.count_documents({})}")
print(f"  db.playlists.count()        -> {playlists_col.count_documents({})}")
print("="*70)