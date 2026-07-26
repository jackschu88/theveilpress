import { useRef, useState } from "react";

function resolveAudioUrl(src) {
  if (!src || typeof window === "undefined") return src || "";
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
}

export default function MusicPlayer({ tracks = [] }) {
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  function playTrack(track) {
    const audio = audioRef.current;
    if (!audio || !track?.src) {
      setError(`Could not play “${track?.title ?? "track"}”.`);
      return;
    }

    setError(null);
    setProgress(0);
    setCurrent(track);

    const nextUrl = resolveAudioUrl(track.src);
    // Play inside the click handler so the browser still has a user gesture.
    // (Deferred play() in useEffect is often blocked as autoplay.)
    if (audio.src !== nextUrl) {
      audio.src = track.src;
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => setPlaying(true))
        .catch((err) => {
          setPlaying(false);
          if (err?.name === "AbortError") return;
          setError(`Could not play “${track.title}”.`);
        });
    } else {
      setPlaying(true);
    }
  }

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
          .catch((err) => {
            setPlaying(false);
            if (err?.name === "AbortError") return;
            setError(`Could not play “${track.title}”.`);
          });
      }
      return;
    }
    playTrack(track);
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
        preload="metadata"
        playsInline
      />

      <div className="music-tracklist">
        {tracks.map((track) => {
          const isActive = current?.id === track.id;
          return (
            <div
              key={track.id}
              className={`music-track${isActive ? " music-track-active" : ""}`}
            >
              <button
                type="button"
                className="music-track-main"
                onClick={() => toggle(track)}
                aria-pressed={isActive && playing}
                aria-label={
                  isActive && playing
                    ? `Pause ${track.title}`
                    : `Play ${track.title}`
                }
              >
                <span className="music-track-icon" aria-hidden="true">
                  {isActive && playing ? "⏸" : "▶"}
                </span>
                <span className="music-track-title">{track.title}</span>
              </button>
              {isActive && (
                <span
                  className="music-track-bar"
                  onClick={handleSeek}
                  role="slider"
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    const audio = audioRef.current;
                    if (!audio?.duration) return;
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const delta = e.key === "ArrowRight" ? 0.05 : -0.05;
                      const next = Math.min(
                        1,
                        Math.max(0, audio.currentTime / audio.duration + delta),
                      );
                      audio.currentTime = next * audio.duration;
                      setProgress(next * 100);
                    }
                  }}
                >
                  <span
                    className="music-track-fill"
                    style={{ width: `${progress}%` }}
                  />
                </span>
              )}
              <a
                href={track.src}
                download
                className="music-dl-link"
                onClick={(e) => e.stopPropagation()}
              >
                Add to playlist
              </a>
            </div>
          );
        })}
      </div>

      {current && playing && (
        <p className="music-now">Now playing: {current.title}</p>
      )}
      {error && (
        <p
          className="music-now"
          role="alert"
          style={{ color: "var(--gold, #c9a227)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
