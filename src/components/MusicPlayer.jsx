import { useRef, useState } from "react";

export default function MusicPlayer({ tracks = [] }) {
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  function toggle(track) {
    if (current?.id === track.id) {
      if (playing) {
        audioRef.current?.pause();
        setPlaying(false);
      } else {
        audioRef.current?.play();
        setPlaying(true);
      }
      return;
    }
    setCurrent(track);
    setPlaying(true);
    setProgress(0);
    // Need a small delay so the new src loads
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = track.src;
        audioRef.current.load();
        audioRef.current.play().catch(() => setPlaying(false));
      }
    }, 50);
  }

  function handleTimeUpdate() {
    if (!audioRef.current || !audioRef.current.duration) return;
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  }

  function handleEnded() {
    setPlaying(false);
    setProgress(0);
  }

  function handleSeek(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = pct * audioRef.current.duration;
      setProgress(pct * 100);
    }
  }

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="none"
      />

      <div className="music-tracklist">
        {tracks.map((track) => {
          const isActive = current?.id === track.id;
          return (
            <button
              key={track.id}
              type="button"
              className={`music-track${isActive ? " music-track-active" : ""}`}
              onClick={() => toggle(track)}
            >
              <span className="music-track-icon">
                {isActive && playing ? "⏸" : "▶"}
              </span>
              <span className="music-track-title">{track.title}</span>
              {isActive && (
                <span className="music-track-bar" onClick={handleSeek}>
                  <span className="music-track-fill" style={{ width: `${progress}%` }} />
                </span>
              )}
              <span className="music-track-dl">
                <a
                  href={track.src}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="music-dl-link"
                >
                  Add to playlist
                </a>
              </span>
            </button>
          );
        })}
      </div>

      {current && playing && (
        <p className="music-now">Now playing: {current.title}</p>
      )}
    </div>
  );
}
