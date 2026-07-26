import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({ tracks = [] }) {
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Load / play when the selected track changes (avoids setTimeout race).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;

    setError(null);
    setProgress(0);
    audio.src = current.src;
    audio.load();

    let cancelled = false;
    audio
      .play()
      .then(() => {
        if (!cancelled) setPlaying(true);
      })
      .catch((err) => {
        if (!cancelled) {
          setPlaying(false);
          // Autoplay blocked until user gesture is rare here (click already happened).
          if (err?.name !== "AbortError") {
            setError(`Could not play “${current.title}”.`);
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [current]);

  function toggle(track) {
    const audio = audioRef.current;
    if (current?.id === track.id) {
      if (playing) {
        audio?.pause();
        setPlaying(false);
      } else {
        setError(null);
        audio
          ?.play()
          .then(() => setPlaying(true))
          .catch(() => {
            setPlaying(false);
            setError(`Could not play “${track.title}”.`);
          });
      }
      return;
    }
    setCurrent(track);
    setPlaying(true);
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !audio.duration || !Number.isFinite(audio.duration)) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  }

  function handleEnded() {
    setPlaying(false);
    setProgress(0);
  }

  function handleError() {
    if (current) {
      setPlaying(false);
      setError(`Could not load “${current.title}”.`);
    }
  }

  function handleSeek(e) {
    e.stopPropagation();
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(1, Math.max(0, x / rect.width));
    if (audio && audio.duration && Number.isFinite(audio.duration)) {
      audio.currentTime = pct * audio.duration;
      setProgress(pct * 100);
    }
  }

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        preload="none"
        playsInline
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
                <span
                  className="music-track-bar"
                  onClick={handleSeek}
                  role="slider"
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                >
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
      {error && (
        <p className="music-now" role="alert" style={{ color: "var(--gold, #c9a227)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
