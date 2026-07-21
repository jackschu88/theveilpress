import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { easeOut } from "../motion";

const KEY = "veilpress-intro-seen";

export default function VeilIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduce) return undefined;
    try {
      if (sessionStorage.getItem(KEY)) return undefined;
    } catch {
      /* ignore */
    }
    setShow(true);
    const t = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
    }, 3400);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="veil-intro"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: "blur(8px)",
            transition: { duration: 0.85, ease: easeOut },
          }}
          aria-hidden
        >
          <motion.div
            className="veil-curtain left"
            initial={{ x: 0 }}
            animate={{ x: "-108%" }}
            transition={{ duration: 1.5, delay: 1.05, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="veil-curtain right"
            initial={{ x: 0 }}
            animate={{ x: "108%" }}
            transition={{ duration: 1.5, delay: 1.05, ease: [0.76, 0, 0.24, 1] }}
          />

          <div className="veil-intro-center">
            <motion.p
              className="veil-intro-brand"
              initial={{ opacity: 0, y: 18, letterSpacing: "0.55em", filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.22em", filter: "blur(0px)" }}
              transition={{ duration: 1.05, ease: easeOut }}
            >
              THE VEIL PRESS
            </motion.p>
            <motion.div
              className="veil-intro-rule"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4, ease: easeOut }}
            />
            <motion.p
              className="veil-intro-sub"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.75 }}
            >
              The fog removed
            </motion.p>
          </div>

          <motion.div
            className="veil-light"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: [0, 0.7, 0.25], scale: [0.85, 1.05, 1] }}
            transition={{ duration: 2.6, ease: easeOut }}
          />

          <div className="veil-rays" aria-hidden />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
