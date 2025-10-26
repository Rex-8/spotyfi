import { useEffect, useState } from "react";
import { getTracks } from "../services/api";

export default function Dashboard() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      const res = await getTracks();
      setTracks(res.data);
    };
    fetchTracks();
  }, []);

  return (
    <div>
      <h1>Tracks</h1>
      <ul>
        {tracks.map(track => (
          <li key={track._id}>
            {track.title} - {track.artist_id}
          </li>
        ))}
      </ul>
    </div>
  );
}
