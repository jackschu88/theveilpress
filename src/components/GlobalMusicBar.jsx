import { useSoundtrack } from "./SoundtrackProvider";

/** Sticky control bar so music stays controllable on every page. */
export default function GlobalMusicBar() {
  const { current, playing, progress, pause, resume, playNext, seek } =
    useSoundtrack();

  if (!current) return null;

  function handleSeek(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    seek(Math.min(1, Math.max(0, x / rect.width)));
  }

  return (
    <div className="music-global-bar" role="region" aria-label="Now playing">
      <button
        type="button"
        className="music-global-toggle"
        onClick={() => (playing ? pause() : resume())}
        aria-label={playing ? `Pause ${current.title}` : `Play ${current.title}`}
      >
        {playing ? "⏸" : "▶"}
      </button>
      <div className="music-global-meta">
        <span className="music-global-label">
          {playing ? "Now playing" : "Paused"}
        </span>
        <span className="music-global-title">{current.title}</span>
      </div>
      <button
        type="button"
        className="music-global-seek"
        onClick={handleSeek}
        aria-label="Seek"
      >
        <span
          className="music-global-seek-fill"
          style={{ width: `${progress}%` }}
        />
      </button>
      <button
        type="button"
        className="music-global-next"
        onClick={playNext}
        aria-label="Next track"
      >
        ⏭
      </button>
    </div>
  );
}
