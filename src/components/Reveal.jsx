import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, stagger } from "../motion";

export function Reveal({ children, className, delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{
        hidden: fadeUp.hidden,
        show: {
          ...fadeUp.show,
          transition: { ...fadeUp.show.transition, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-6% 0px" }}
      variants={stagger}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
