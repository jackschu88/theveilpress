/**
 * Public social profiles for The Veil Press.
 * Single source for footer, About, and any share rails.
 */
export const SOCIALS = [
  {
    id: "x",
    label: "X",
    handle: "@deepdivefile",
    href: "https://x.com/deepdivefile",
  },
  {
    id: "youtube",
    label: "YouTube",
    handle: "The Veil Press",
    href: "https://www.youtube.com/channel/UC1inbgx19VivnXyWGDWbaiw",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@theveilpress",
    href: "https://www.tiktok.com/@theveilpress",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "The Veil Press",
    href: "https://www.facebook.com/profile.php?id=61592600831684",
  },
];

export const SOCIAL_BY_ID = Object.fromEntries(SOCIALS.map((s) => [s.id, s]));

export default SOCIALS;
