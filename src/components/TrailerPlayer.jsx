import { useEffect, useRef, useState } from "react";
import { trackVideoPlay, trackVideoUnmute } from "../lib/analytics";

/**
 * Square Mile trailer with autoplay + sound unlock.
 * Tries sound first; falls back to muted play so the picture still runs.
 */
export default function TrailerPlayer({
  src = "/videos/square-mile-trailer.mp4",
  poster = "/cover.jpg",
  ariaLabel = "Trailer for The Veil of the Square Mile",
  className = "",
  frameClassName = "",
  /** Analytics id — defaults derived from src filename */
  videoId,
}) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [needsPlay, setNeedsPlay] = useState(false);
  const trackedPlay = useRef(false);

  const resolvedId =
    videoId ||
    (typeof src === "string"
      ? src.split("/").pop()?.replace(/\.mp4$/i, "") || "trailer"
      : "trailer");

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    let cancelled = false;
    trackedPlay.current = false;

    const markPlay = (withSound) => {
      if (trackedPlay.current || cancelled) return;
      trackedPlay.current = true;
      trackVideoPlay(resolvedId, {
        muted: withSound ? "false" : "true",
        source: "trailer_player",
      });
    };

    const withSound = () => {
      el.defaultMuted = false;
      el.muted = false;
      el.volume = 1;
      el.removeAttribute("muted");
      if (!cancelled) setMuted(false);
    };

    const playMuted = async () => {
      el.defaultMuted = true;
      el.muted = true;
      try {
        await el.play();
        markPlay(false);
        if (!cancelled) {
          setMuted(true);
          setNeedsPlay(true);
        }
        return true;
      } catch {
        if (!cancelled) setNeedsPlay(true);
        return false;
      }
    };

    const playWithSound = async () => {
      withSound();
      try {
        await el.play();
        withSound();
        markPlay(true);
        if (!cancelled) setNeedsPlay(false);
        return true;
      } catch {
        await playMuted();
        return false;
      }
    };

    playWithSound();

    const onGesture = (event) => {
      if (event?.target?.closest?.(".trailer-mute")) return;
      playWithSound().then((ok) => {
        if (ok) {
          unlockEvents.forEach((type) =>
            document.removeEventListener(type, onGesture, true)
          );
        }
      });
    };
    const unlockEvents = ["pointerdown", "keydown", "click"];
    unlockEvents.forEach((type) =>
      document.addEventListener(type, onGesture, { capture: true, passive: true })
    );

    const onVolume = () => {
      if (!cancelled) setMuted(Boolean(el.muted));
    };
    const onError = () => {
      if (!cancelled) setNeedsPlay(true);
    };
    const onPlay = () => {
      markPlay(!el.muted);
    };
    el.addEventListener("volumechange", onVolume);
    el.addEventListener("error", onError);
    el.addEventListener("play", onPlay);

    return () => {
      cancelled = true;
      unlockEvents.forEach((type) =>
        document.removeEventListener(type, onGesture, true)
      );
      el.removeEventListener("volumechange", onVolume);
      el.removeEventListener("error", onError);
      el.removeEventListener("play", onPlay);
    };
  }, [src, resolvedId]);

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.muted || muted) {
      el.defaultMuted = false;
      el.muted = false;
      el.volume = 1;
      el.removeAttribute("muted");
      setMuted(false);
      trackVideoUnmute(resolvedId, { source: "trailer_mute_toggle" });
      el.play().then(() => setNeedsPlay(false)).catch(() => {});
      return;
    }
    el.muted = true;
    setMuted(true);
  };

  const handlePlayOverlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.defaultMuted = false;
    el.muted = false;
    el.volume = 1;
    el.removeAttribute("muted");
    setMuted(false);
    trackVideoUnmute(resolvedId, { source: "play_with_sound" });
    trackVideoPlay(resolvedId, { muted: "false", source: "play_with_sound" });
    el.play()
      .then(() => setNeedsPlay(false))
      .catch(() => setNeedsPlay(true));
  };

  return (
    <div className={`trailer-stage${className ? ` ${className}` : ""}`}>
      <div className={`trailer-frame${frameClassName ? ` ${frameClassName}` : ""}`}>
        <video
          ref={videoRef}
          className="trailer-video"
          src={src}
          poster={poster}
          loop
          playsInline
          preload="auto"
          controls
          aria-label={ariaLabel}
        />
        {needsPlay && (
          <button
            type="button"
            className="trailer-play-sound"
            onClick={handlePlayOverlay}
          >
            Play with sound
          </button>
        )}
        <button
          type="button"
          className={`trailer-mute${muted ? " trailer-mute-on" : ""}`}
          onClick={toggleMute}
          aria-pressed={!muted}
          aria-label={muted ? "Turn sound on" : "Mute trailer"}
        >
          {muted ? "Sound on" : "Mute"}
        </button>
      </div>
    </div>
  );
}
