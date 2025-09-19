import { useEffect, useState } from "react";
import { getAllSongs } from "../services/songService";

function SongList() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    getAllSongs().then(setSongs).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Danh sách bài hát</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>{song.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default SongList;
