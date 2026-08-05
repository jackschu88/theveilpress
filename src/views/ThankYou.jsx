import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal } from "../components/Reveal";
import { MagneticLink } from "../components/MagneticButton";
import { easeOut } from "../motion";

export default function ThankYou() {
  return (
    <AnimatedPage>
      <section className="hero" style={{ textAlign: "center", paddingTop: "4rem" }}>
        <Reveal>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            Limited Founders Edition
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
          >
            Welcome to the resistance.
          </motion.h1>

          <motion.div
            className="title-rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: easeOut }}
            style={{ margin: "1.5rem auto" }}
          />

          <motion.p
            className="lede thankyou-lede"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: easeOut }}
          >
            You now carry the map. Read it. Understand it. Then go tell someone
            else.
          </motion.p>

          <motion.p
            className="muted thankyou-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: easeOut }}
          >
            This is not the end of the pre-order. It is the beginning of your part
            in the journey. The books will ship on release. Digital items will
            arrive per the campaign timeline. You will be notified.
          </motion.p>

          <motion.div
            className="actions"
            style={{ justifyContent: "center", marginTop: "2.5rem" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: easeOut }}
          >
            <MagneticLink className="btn btn-primary btn-shimmer" to="/">
              Return home
            </MagneticLink>
            <MagneticLink className="btn" to="/library/founders">
              Other presale options
            </MagneticLink>
          </motion.div>
        </Reveal>
      </section>
    </AnimatedPage>
  );
}
