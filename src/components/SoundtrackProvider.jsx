import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { soundtrack } from "../data/soundtrack";

const SoundtrackContext = createContext(null);

function resolveAudioUrl(src) {
  if (!src || typeof window === "undefined") return src || "";
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
}

export function useSoundtrack() {
  const ctx = useContext(SoundtrackContext);
  if (!ctx) {
    throw new Error("useSoundtrack must be used within SoundtrackProvider");
  }
  return ctx;
}

/**
 * Owns a single <audio> element for the whole app so playback survives
 * route changes and stays alive while the tab is open.
 */
export default function SoundtrackProvider({ children, tracks = soundtrack }) {
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const currentRef = useRef(null);
  const tracksRef = useRef(tracks);
  const wantPlayRef = useRef(false);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const playFromElement = useCallback((track) => {
    const audio = audioRef.current;
    if (!audio || !track?.src) {
      setError(`Could not play “${track?.title ?? "track"}”.`);
      return;
    }

    setError(null);
    wantPlayRef.current = true;

    const nextUrl = resolveAudioUrl(track.src);
    if (audio.src !== nextUrl) {
      setProgress(0);
      audio.src = track.src;
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => {
          if (wantPlayRef.current) setPlaying(true);
        })
        .catch((err) => {
          setPlaying(false);
          if (err?.name === "AbortError") return;
          setError(`Could not play “${track.title}”.`);
        });
    } else {
      setPlaying(true);
    }
  }, []);

  const playTrack = useCallback(
    (track) => {
      setCurrent(track);
      currentRef.current = track;
      playFromElement(track);
    },
    [playFromElement],
  );

  const pause = useCallback(() => {
    wantPlayRef.current = false;
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const resume = useCallback(() => {
    const track = currentRef.current;
    if (!track) return;
    playFromElement(track);
  }, [playFromElement]);

  const toggle = useCallback(
    (track) => {
      if (currentRef.current?.id === track.id) {
        if (wantPlayRef.current && !audioRef.current?.paused) {
          pause();
        } else {
          resume();
        }
        return;
      }
      playTrack(track);
    },
    [pause, playTrack, resume],
  );

  const playNext = useCallback(() => {
    const list = tracksRef.current;
    const cur = currentRef.current;
    if (!list?.length) return;
    const idx = cur ? list.findIndex((t) => t.id === cur.id) : -1;
    const next = list[(idx + 1) % list.length];
    if (next) playTrack(next);
  }, [playTrack]);

  const seek = useCallback((pct) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration || !Number.isFinite(audio.duration)) return;
    const clamped = Math.min(1, Math.max(0, pct));
    audio.currentTime = clamped * audio.duration;
    setProgress(clamped * 100);
  }, []);

  // Keep playing when the document is backgrounded (browser tab switch).
  // Some engines fire spurious pause; resume if the user still wants audio.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio || !wantPlayRef.current) return;
      if (document.visibilityState === "visible" && audio.paused) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onVisibility);
    };
  }, []);

  // Media Session: lock-screen / OS media controls + better background policy
  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: current.title,
        artist: "The Veil Press",
        album: "Songs from the resistance",
      });
      navigator.mediaSession.playbackState = playing ? "playing" : "paused";
      navigator.mediaSession.setActionHandler("play", () => resume());
      navigator.mediaSession.setActionHandler("pause", () => pause());
      navigator.mediaSession.setActionHandler("nexttrack", () => playNext());
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        const list = tracksRef.current;
        const cur = currentRef.current;
        if (!list?.length || !cur) return;
        const idx = list.findIndex((t) => t.id === cur.id);
        const prev = list[(idx - 1 + list.length) % list.length];
        if (prev) playTrack(prev);
      });
    } catch {
      // Older browsers may not support all handlers
    }
  }, [current, playing, pause, playNext, playTrack, resume]);

  const value = useMemo(
    () => ({
      tracks,
      current,
      playing,
      progress,
      error,
      toggle,
      playTrack,
      pause,
      resume,
      playNext,
      seek,
    }),
    [
      tracks,
      current,
      playing,
      progress,
      error,
      toggle,
      playTrack,
      pause,
      resume,
      playNext,
      seek,
    ],
  );

  return (
    <SoundtrackContext.Provider value={value}>
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          const audio = audioRef.current;
          if (!audio || !audio.duration || !Number.isFinite(audio.duration)) return;
          setProgress((audio.currentTime / audio.duration) * 100);
        }}
        onEnded={() => {
          // Continuous listening while the site session is open
          playNext();
        }}
        onError={() => {
          if (currentRef.current) {
            setPlaying(false);
            setError(`Could not load “${currentRef.current.title}”.`);
          }
        }}
        onPlay={() => {
          wantPlayRef.current = true;
          setPlaying(true);
        }}
        onPause={() => {
          // Keep UI in "playing" if the browser paused us while backgrounded;
          // visibilitychange will resume. Intentional pause clears wantPlayRef first.
          if (wantPlayRef.current && document.visibilityState === "hidden") {
            return;
          }
          setPlaying(false);
        }}
        preload="metadata"
        playsInline
      />
      {children}
    </SoundtrackContext.Provider>
  );
}
