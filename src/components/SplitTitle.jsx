import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "../motion";

export default function SplitTitle({ text, className = "", as: Tag = "h1" }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={`${className} split-title`} aria-label={text}>
      {words.map((word, wi) => (
        <span className="split-word" key={`${word}-${wi}`}>
          {word.split("").map((char, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              className="split-char"
              initial={{ opacity: 0, y: 48, rotateX: -50 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.08 + wi * 0.08 + ci * 0.028,
                ease: easeOut,
              }}
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 ? (
            <span className="split-char split-space">&nbsp;</span>
          ) : null}
        </span>
      ))}
    </Tag>
  );
}
