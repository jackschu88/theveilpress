/** Page wrapper — transition is handled by Layout AnimatePresence */
export default function AnimatedPage({ children, className = "shell" }) {
  return <div className={className}>{children}</div>;
}
