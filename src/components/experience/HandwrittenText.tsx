import { motion } from "framer-motion";

export function HandwrittenText({
  text,
  className = "",
  delay = 0,
  size = "text-6xl md:text-8xl",
  color = "#fef3c7",
}: {
  text: string;
  className?: string;
  delay?: number;
  size?: string;
  color?: string;
}) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 2.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`font-script ${size} text-glow ${className}`}
      style={{ color }}
    >
      {text}
    </motion.h2>
  );
}
