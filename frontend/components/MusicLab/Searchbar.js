import { useState, useRef, useCallback } from "react";

export default function SearchBar() {
  const [results, setResults] = useState([]);
  const debounceRef = useRef(null);

  const searchSpotify = useCallback((query) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const data = getTracks(query)

        if (data?.tracks?.items) {
          setResults(data.tracks.items);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Erreur lors de la recherche Spotify :", err);
        setResults([]);
      }
    }, 300);
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher une musique..."
        onChange={(e) => searchSpotify(e.target.value)} 
      />
      <ul>
        {results.map((track) => (
          <li key={track.id}>
            {track.album?.images?.[2]?.url && (
              <img
                src={track.album.images[2].url}
                alt={track.name}
                width="40"
              />
            )}
            {track.name} – {track.artists.map((a) => a.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}