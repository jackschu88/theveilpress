/**
 * The Record — The Veil Press media archive.
 * ---------------------------
 * A single, ordered feed of films and episodes. Rendered as a horizontal
 * "record strip" (like a broadcast archive) on Watch and the homepage.
 *
 * Any entry here can be a film (video on this site) or an episode (podcast
 * link). Add future podcast episodes to this array and they appear in the
 * strip automatically — no markup change needed.
 *
 * @typedef {{ id: string, kind: "film" | "podcast", num: number|string,
 *   title: string, dek?: string, src?: string, poster?: string,
 *   href?: string, host?: string, duration?: string, soon?: boolean }} RecordEntry
 */

export const RECORD_NUMBER_PAD = 2;

export const archive = [
  {
    id: "square-mile-trailer",
    kind: "film",
    num: "01",
    title: "The Veil of the Square Mile",
    dek: "The official film.",
    src: "/videos/square-mile-trailer.mp4",
    poster: "/cover.jpg",
    duration: "Trailer",
  },
  {
    id: "companion-trailer",
    kind: "film",
    num: "02",
    title: "The Companion Guide",
    dek: "The map to the book.",
    src: "/videos/companion_trailer.mp4",
    poster: "/companion-cover.jpg",
    duration: "Trailer",
  },
  {
    id: "podcast-slot",
    kind: "podcast",
    num: "03",
    title: "The Record — Vol. 1",
    dek: "First episode. Coming soon.",
    href: "/watch",
    soon: true,
  },
];

export function nextRecordNumber() {
  const nums = archive
    .map((e) => parseInt(String(e.num), 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return String(max + 1).padStart(RECORD_NUMBER_PAD, "0");
}
