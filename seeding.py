# file: seed_spotyfi_fixed.py
# Run once: python seed_spotyfi_fixed.py
# Place in your project root next to the "Music" folder

from pathlib import Path
from tinytag import TinyTag
from pymongo import MongoClient
from datetime import datetime
import hashlib

# ================================
# CONFIG
# ================================
MUSIC_DIR = Path("/home/rex-8/Documents/projects/spotyfi/Music")                      # Your music folder
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "mern_music_app"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
songs = db.songs
artists = db.artists
albums = db.albums

print("Spotyfi Music Seeder (Fixed Version)")
print(f"Scanning: {MUSIC_DIR.absolute()}\n")

if not MUSIC_DIR.exists():
    print("ERROR: 'Music' folder not found!")
    exit()

mp3_files = list(MUSIC_DIR.rglob("*.mp3"))
print(f"Found {len(mp3_files)} MP3 files\n")

added = 0
skipped = 0

for file_path in mp3_files:
    try:
        tag = TinyTag.get(str(file_path))

        # Safely extract metadata (handles int/string/float properly)
        title = (tag.title or file_path.stem).strip()
        artist_name = (tag.artist or "Unknown Artist").strip()
        album_name = (tag.album or "Unknown Album").strip()
        genre = (tag.genre or "Unknown").strip()

        # Safe year extraction
        year = None
        if tag.year:
            if isinstance(tag.year, (int, float)):
                year = int(tag.year)
            elif isinstance(tag.year, str) and tag.year.strip().isdigit():
                year = int(tag.year.strip())

        # Safe track number extraction
        track = None
        if tag.track:
            if isinstance(tag.track, (int, float)):
                track = int(tag.track)
            elif isinstance(tag.track, str) and tag.track.strip().isdigit():
                track = int(tag.track.strip())

        # Duration fallback
        duration = int(tag.duration) if tag.duration and tag.duration > 0 else 180

        # Skip if critical info missing
        if not title or title == "Unknown" or not artist_name:
            print(f"Skipped (no title/artist): {file_path.name}")
            skipped += 1
            continue

        # Duplicate prevention via file hash
        file_hash = hashlib.md5(file_path.read_bytes()).hexdigest()
        if songs.find_one({"fileHash": file_hash}):
            skipped += 1
            continue

        # === Artist ===
        artist_doc = artists.find_one({"name": artist_name})
        if not artist_doc:
            artist_doc = {
                "name": artist_name,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            result = artists.insert_one(artist_doc)
            artist_id = result.inserted_id
            print(f"Created Artist → {artist_name}")
        else:
            artist_id = artist_doc["_id"]

        # === Album ===
        album_doc = albums.find_one({
            "title": album_name,
            "artistId": artist_id
        })
        if not album_doc:
            album_doc = {
                "title": album_name,
                "artist": artist_name,
                "artistId": artist_id,
                "releaseYear": year,
                "coverArt": None,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            result = albums.insert_one(album_doc)
            album_id = result.inserted_id
            print(f"Created Album → {album_name}")
        else:
            album_id = album_doc["_id"]

        # === Song ===
        song = {
            "title": title,
            "artist": artist_name,
            "artistId": artist_id,
            "album": album_name,
            "albumId": album_id,
            "duration": duration,
            "trackNumber": track,
            "genre": genre,
            "filePath": str(file_path),
            "fileHash": file_hash,
            "playCount": 0,
            "likedBy": [],
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        songs.insert_one(song)
        added += 1
        print(f"Added → {title} - {artist_name} [{duration}s]")

    except Exception as e:
        print(f"Failed → {file_path.name} | Error: {e}")
        skipped += 1

print("\n" + "="*70)
print("SEEDING COMPLETED SUCCESSFULLY!")
print(f"   Added new songs : {added}")
print(f"   Skipped/existed : {skipped}")
print(f"   Total songs now : {songs.count_documents({})}")
print("="*70)