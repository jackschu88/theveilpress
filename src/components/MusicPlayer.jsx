import { useSoundtrack } from "./SoundtrackProvider";
import { trackMusicDownload } from "../lib/analytics";

/** Full tracklist UI — uses the global soundtrack so leaving this page does not stop audio. */
export default function MusicPlayer() {
  const {
    tracks,
    current,
    playing,
    progress,
    error,
    toggle,
    seek,
  } = useSoundtrack();

  function handleSeek(e) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(1, Math.max(0, x / rect.width));
    seek(pct);
  }

  return (
    <div className="music-player">
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
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const delta = e.key === "ArrowRight" ? 0.05 : -0.05;
                      seek(Math.min(1, Math.max(0, progress / 100 + delta)));
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
                onClick={(e) => {
                  e.stopPropagation();
                  trackMusicDownload(track, { source: "music_player" });
                }}
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
