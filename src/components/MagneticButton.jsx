import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

function useMagnetic() {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    setOffset({ x: x * 0.22, y: y * 0.22 });
  };

  const onLeave = () => setOffset({ x: 0, y: 0 });

  return { ref, offset, onMove, onLeave, reduce };
}

export function MagneticLink({ to, className, children, ...rest }) {
  const { ref, offset, onMove, onLeave } = useMagnetic();
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 280, damping: 18, mass: 0.4 }}
      style={{ display: "inline-block" }}
    >
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    </motion.div>
  );
}

export function MagneticAnchor({ href, className, children, onClick, ...rest }) {
  const { ref, offset, onMove, onLeave } = useMagnetic();
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 280, damping: 18, mass: 0.4 }}
      style={{ display: "inline-block" }}
    >
      <a href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    </motion.div>
  );
}
