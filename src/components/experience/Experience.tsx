import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { StarField } from "@/components/experience/StarField";
import { CursorMagic } from "@/components/experience/CursorMagic";
import { Fireflies } from "@/components/experience/Fireflies";
import { HandwrittenText } from "@/components/experience/HandwrittenText";
import { Petals } from "@/components/experience/Petals";
import { Moon } from "@/components/experience/Moon";
import { NightMusic } from "@/lib/night-music";

/* ----------------------- Intro ----------------------- */
function Intro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const doneRef = useRef(false);
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };
  // 0 black, 1 star bloom, 2 "For Tiya", 3 second line, 4 signature, 5 fade out
  useEffect(() => {
    const timeline = [1600, 2600, 3800, 4200, 4600, 3600];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let acc = 0;
    timeline.forEach((ms, i) => {
      acc += ms;
      timers.push(
        setTimeout(() => {
          if (i === timeline.length - 1) finish();
          else setPhase(i + 1);
        }, acc),
      );
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: "#000" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase >= 5 ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.4, ease: "easeInOut" }}
    >
      {/* star bloom */}
      {phase >= 1 && <StarField density={380} shooting={false} />}
      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 60 }}
          animate={{ opacity: 0.9, scale: 1, y: 0 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute right-[8%] top-[10%] md:right-[12%] md:top-[14%]"
        >
          <div className="origin-top-right scale-[0.55] md:scale-100">
            <Moon size={220} />
          </div>
        </motion.div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">
        <AnimatePresence mode="wait">
          {phase === 2 && (
            <motion.h1
              key="fortiya"
              initial={{ opacity: 0, y: 20, filter: "blur(20px)", letterSpacing: "0.5em" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.05em" }}
              exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
              transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-script text-7xl text-glow md:text-9xl"
              style={{ color: "#fef3c7" }}
            >
              For Tiya
            </motion.h1>
          )}
          {phase === 3 && (
            <motion.p
              key="line2"
              initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 2.2 }}
              className="font-display max-w-2xl text-2xl italic text-white/90 md:text-4xl text-glow-soft"
            >
              From someone who couldn&rsquo;t let your day end like this.
            </motion.p>
          )}
          {phase === 4 && (
            <motion.div
              key="sig"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6 }}
              className="flex flex-col items-center gap-3"
            >
              <span className="font-display text-lg tracking-[0.3em] text-white/70">LOVE,</span>
              <motion.span
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 2.2, delay: 0.3 }}
                className="font-script text-6xl text-glow md:text-8xl"
                style={{ color: "#fde68a" }}
              >
                Chinmay
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* skip */}
      <motion.button
        onClick={finish}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 && phase < 5 ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="safe-bottom-right absolute z-20 rounded-full border border-white/15 px-4 py-2 font-display text-xs tracking-[0.25em] text-white/50 transition-colors hover:border-white/35 hover:text-white/80"
      >
        SKIP ✦
      </motion.button>

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.9) 100%)",
        }}
      />
    </motion.div>
  );
}

/* ----------------------- Letter section ----------------------- */
const LETTER = [
  "Hi Tiya ❤",
  "I know today wasn't easy.",
  "Maybe it was overwhelming.",
  "Maybe you smiled while quietly carrying too much.",
  "Maybe nobody noticed.",
  "But I did.",
  "So I wanted to build you something…",
  "Not because it fixes everything.",
  "But because you deserve moments that remind you…",
  "You matter.",
  "You are appreciated.",
  "You are stronger than your hardest days.",
  "And no matter how today felt…",
  "Tomorrow still belongs to you.",
];

function LetterScene() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 py-40">
      <Petals count={20} />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card relative z-10 w-full max-w-2xl rounded-3xl p-7 sm:p-10 md:p-16"
      >
        <div className="font-display text-white/90">
          {LETTER.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.2, delay: 0.15 * i, ease: "easeOut" }}
              className={`my-3 text-lg leading-relaxed md:text-2xl ${
                line === "But I did." ? "text-glow-soft font-semibold text-amber-100" : ""
              }`}
            >
              {line}
            </motion.p>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 2 }}
            className="mt-10 flex flex-col items-end"
          >
            <span className="text-sm tracking-[0.3em] text-white/50">WITH LOVE,</span>
            <span
              className="font-script text-5xl text-glow md:text-6xl"
              style={{ color: "#fde68a" }}
            >
              Chinmay
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ----------------------- Constellation TIYA ----------------------- */
function ConstellationScene() {
  // Simple stroke paths spelling TIYA
  const paths = [
    // T
    "M 40 30 L 90 30 M 65 30 L 65 100",
    // I
    "M 120 30 L 160 30 M 140 30 L 140 100 M 120 100 L 160 100",
    // Y
    "M 190 30 L 215 70 L 240 30 M 215 70 L 215 100",
    // A
    "M 270 100 L 295 30 L 320 100 M 280 75 L 310 75",
  ];
  const nodes: [number, number][] = [
    [40, 30],
    [65, 30],
    [90, 30],
    [65, 65],
    [65, 100],
    [120, 30],
    [140, 30],
    [160, 30],
    [140, 65],
    [140, 100],
    [120, 100],
    [160, 100],
    [190, 30],
    [215, 70],
    [240, 30],
    [215, 100],
    [270, 100],
    [282, 66],
    [295, 30],
    [308, 66],
    [320, 100],
  ];
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-40">
      <div className="relative z-10 flex flex-col items-center gap-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6 }}
          className="font-display text-center text-lg italic text-white/70 md:text-xl"
        >
          Look up. The stars remember your name.
        </motion.p>
        <motion.svg
          viewBox="0 0 360 130"
          className="w-[92vw] max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="url(#stargrad)"
              strokeWidth={1.2}
              strokeLinecap="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1 },
              }}
              transition={{ duration: 2.4, delay: 0.6 + i * 0.6, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 0 6px #fde68a)" }}
            />
          ))}
          {/* star nodes along the strokes — keep twinkling after the letters draw */}
          {nodes.map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={1.8}
              fill="#fffbeb"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: [0, 1, 0.5, 1], scale: 1 }}
              viewport={{ once: true }}
              transition={{
                opacity: {
                  duration: 4,
                  delay: 0.4 + i * 0.08,
                  repeat: Infinity,
                  repeatType: "mirror",
                },
                scale: { duration: 0.8, delay: 0.4 + i * 0.08 },
              }}
              style={{ filter: "drop-shadow(0 0 4px #fde68a)" }}
            />
          ))}
          <defs>
            <linearGradient id="stargrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="50%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>
    </section>
  );
}

/* ----------------------- Memory Garden ----------------------- */
const FLOWER_MESSAGES = [
  "You've survived every difficult day.",
  "You deserve peaceful mornings.",
  "The world is brighter because you're here.",
  "One bad day isn't your whole story.",
  "Rest is not weakness. It's wisdom.",
  "Your softness is a superpower.",
  "You are the reason someone smiles today.",
  "Storms pass. You remain.",
];

function Flower({
  x,
  y,
  hue,
  msg,
  sway,
  open,
  onToggle,
}: {
  x: number;
  y: number;
  hue: number;
  msg: string;
  sway: number;
  open: boolean;
  onToggle: () => void;
}) {
  // anchor the message card so it never runs off a phone screen
  const cardAlign = x < 20 ? "left-0" : x > 55 ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <div
        className="flower-sway"
        style={{ animationDelay: `${sway}s`, transformOrigin: "50% 100%" }}
      >
        {/* stem + leaf */}
        <svg
          viewBox="-10 0 20 60"
          className="pointer-events-none absolute left-1/2 top-7 h-14 w-5 -translate-x-1/2"
          aria-hidden
        >
          <path
            d="M 0 0 C 3 20, -3 40, 0 60"
            fill="none"
            stroke="hsla(140, 40%, 45%, 0.75)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 0 28 C -8 24, -10 16, -4 14 C -1 18, 0 22, 0 28 Z"
            fill="hsla(140, 45%, 50%, 0.6)"
          />
        </svg>
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="relative block h-10 w-10 cursor-pointer"
          aria-label="Open a flower message"
          style={{ filter: `drop-shadow(0 0 12px hsla(${hue},90%,75%,0.8))` }}
        >
          <svg viewBox="-20 -20 40 40" className="h-full w-full">
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse
                key={r}
                cx="0"
                cy="-8"
                rx="6"
                ry="9"
                transform={`rotate(${r})`}
                fill={`hsl(${hue}, 85%, 80%)`}
                opacity={0.9}
              />
            ))}
            <circle r="4" fill="#fde68a" />
          </svg>
        </motion.button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`glass-card absolute z-30 mt-4 w-56 max-w-[72vw] rounded-2xl px-4 py-3 text-center font-display text-sm italic text-amber-50 ${cardAlign}`}
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MemoryGarden() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const flowers = useMemo(
    () =>
      FLOWER_MESSAGES.map((msg, i) => ({
        msg,
        x: 8 + ((i * 11 + (i % 2) * 4) % 74),
        y: 25 + ((i * 37) % 55),
        hue: [340, 320, 200, 45, 280, 30, 190, 350][i % 8],
        sway: (i % 5) * 0.7,
      })),
    [],
  );

  return (
    <section className="relative min-h-[110vh] px-6 py-40">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="font-display text-sm tracking-[0.3em] text-white/60">A LITTLE MEADOW</p>
        <h3 className="mt-3 font-display text-4xl italic text-white md:text-6xl text-glow-soft">
          Pick a flower. Read what it whispers.
        </h3>
      </motion.div>

      <div className="relative mx-auto mt-20 h-[560px] max-w-5xl">
        {/* moonlit ground */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
          style={{
            background:
              "radial-gradient(ellipse 90% 100% at 50% 100%, rgba(74, 222, 128, 0.10), transparent 70%), radial-gradient(ellipse 60% 70% at 50% 100%, rgba(253, 230, 138, 0.08), transparent 70%)",
            filter: "blur(6px)",
          }}
        />
        {flowers.map((f, i) => (
          <Flower
            key={i}
            {...f}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}

/* ----------------------- Shooting Star / Wish ----------------------- */
function WishScene() {
  const [wished, setWished] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; a: number }[]>([]);

  const makeWish = () => {
    if (wished) return;
    setWished(true);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const arr = Array.from({ length: 160 }, () => ({
      x: cx,
      y: cy,
      a: Math.random() * Math.PI * 2,
    }));
    setParticles(arr);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-40">
      <div className="relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6 }}
          className="font-display text-sm tracking-[0.3em] text-white/60"
        >
          A STAR JUST FOR YOU
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.2 }}
          className="mt-4 font-display text-4xl italic text-white text-glow-soft md:text-6xl"
        >
          Catch it, and make one wish.
        </motion.h3>

        <motion.button
          onClick={makeWish}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-card mt-12 rounded-full px-8 py-4 font-display text-amber-100"
        >
          {wished ? "Wish sent to the sky ✨" : "Reach for the star"}
        </motion.button>

        <AnimatePresence>
          {wished && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, delay: 2.2 }}
              className="mt-10 flex flex-col items-center gap-3"
            >
              <span
                className="font-script text-4xl text-glow md:text-6xl"
                style={{ color: "#fef3c7" }}
              >
                It&rsquo;s already on its way.
              </span>
              <span className="font-hand text-xl text-white/60">shooting stars never miss</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* the wish itself, streaking across the whole sky */}
      <AnimatePresence>
        {wished && (
          <motion.div
            initial={{ x: "-20vw", y: "10vh", opacity: 0 }}
            animate={{ x: "115vw", y: "-35vh", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.2, delay: 0.5, ease: "easeIn" }}
            className="pointer-events-none fixed left-0 top-1/2 z-30"
          >
            <div
              className="h-[3px] w-48 rounded-full"
              style={{
                background: "linear-gradient(to left, #fffbeb, rgba(253,230,138,0.6), transparent)",
                boxShadow: "0 0 16px #fde68a, 0 0 40px rgba(253,230,138,0.5)",
                transform: "rotate(-16deg)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* burst */}
      <div className="pointer-events-none fixed inset-0 z-30">
        {particles.map((p, i) => (
          <motion.span
            key={i}
            initial={{ x: p.x, y: p.y, opacity: 1, scale: 0.4 }}
            animate={{
              x: p.x + Math.cos(p.a) * (200 + Math.random() * 300),
              y: p.y + Math.sin(p.a) * (200 + Math.random() * 300),
              opacity: 0,
              scale: 1.4,
            }}
            transition={{ duration: 3.2 + Math.random(), ease: "easeOut" }}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ background: "#fef3c7", boxShadow: "0 0 12px #fde68a" }}
          />
        ))}
      </div>
    </section>
  );
}

/* ----------------------- Butterfly ----------------------- */
function ButterflyScene() {
  const [state, setState] = useState<"idle" | "landed" | "gone">("idle");
  const [hearts, setHearts] = useState<{ x: number; y: number; id: number }[]>([]);

  const onClick = () => {
    if (state !== "idle") return;
    setState("landed");
    const arr = Array.from({ length: 14 }, (_, i) => ({
      x: (Math.random() - 0.5) * 200,
      y: -Math.random() * 300,
      id: i,
    }));
    setHearts(arr);
    setTimeout(() => setState("gone"), 3200);
  };

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-32">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
        className="absolute top-24 px-6 text-center font-display italic text-white/70"
      >
        {state === "gone"
          ? "It left a little love behind."
          : "Careful… something delicate is coming. (tap it, gently)"}
      </motion.p>

      <div className="relative h-64 w-64">
        <AnimatePresence>
          {state !== "gone" && (
            <motion.button
              onClick={onClick}
              initial={{ x: -400, y: 100, rotate: -10, opacity: 0 }}
              animate={
                state === "idle"
                  ? { x: [-200, 0, 20, 0], y: [80, 0, -10, 0], rotate: [-8, 4, -4, 0], opacity: 1 }
                  : { x: 0, y: 0, rotate: 0, scale: 1.2, opacity: 1 }
              }
              exit={{ x: 400, y: -300, rotate: 30, opacity: 0 }}
              transition={
                state === "idle"
                  ? { duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                  : { duration: 1.6, ease: "easeOut" }
              }
              className="absolute inset-0 cursor-pointer"
              aria-label="Butterfly"
            >
              <Butterfly />
            </motion.button>
          )}
        </AnimatePresence>

        {hearts.map((h) => (
          <motion.span
            key={h.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
            animate={{ x: h.x, y: h.y, opacity: 0, scale: 1.2 }}
            transition={{ duration: 2.4, delay: h.id * 0.05, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 text-2xl"
          >
            ❤
          </motion.span>
        ))}
      </div>
    </section>
  );
}

function Butterfly() {
  return (
    <svg
      viewBox="-60 -40 120 80"
      className="h-full w-full"
      style={{ filter: "drop-shadow(0 0 12px rgba(244,114,182,0.7))" }}
    >
      <defs>
        <radialGradient id="bfw" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="60%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
      </defs>
      <motion.g
        animate={{ scaleX: [1, 0.35, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "0px 0px" }}
      >
        <path d="M0 0 C -20 -30, -55 -30, -50 0 C -55 30, -20 25, 0 0 Z" fill="url(#bfw)" />
        <path d="M0 0 C 20 -30, 55 -30, 50 0 C 55 30, 20 25, 0 0 Z" fill="url(#bfw)" />
      </motion.g>
      <ellipse cx="0" cy="0" rx="2.4" ry="14" fill="#1f1147" />
      <circle cx="0" cy="-14" r="3" fill="#1f1147" />
    </svg>
  );
}

/* ----------------------- Moon Scene ----------------------- */
function MoonScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.1]);
  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-40"
    >
      <motion.div style={{ y, scale }} className="relative flex flex-col items-center">
        <div className="scale-[0.7] sm:scale-100">
          <Moon size={360} />
        </div>
        {/* water reflection */}
        <div
          className="mt-8 h-40 w-[520px] max-w-[90vw] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(254,243,199,0.35), transparent 70%)",
            filter: "blur(8px)",
          }}
        />
        <div className="mt-4 flex flex-col gap-1 opacity-70">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ scaleX: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              className="h-px w-[480px] max-w-[85vw] bg-gradient-to-r from-transparent via-amber-100 to-transparent"
            />
          ))}
        </div>
      </motion.div>

      <motion.blockquote
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute bottom-32 left-1/2 max-w-xl -translate-x-1/2 px-6 text-center font-display text-xl italic text-white/85 text-glow-soft md:text-3xl"
      >
        &ldquo;Even the moon shines brightest after darkness.&rdquo;
      </motion.blockquote>
    </section>
  );
}

/* ----------------------- Heart Constellation Final ----------------------- */
function HeartConstellation() {
  // heart parametric points
  const pts = useMemo(() => {
    const arr: { x: number; y: number }[] = [];
    for (let i = 0; i < 90; i++) {
      const t = (i / 90) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      // round so SSR (Bun) and the browser produce identical markup — raw
      // Math.sin/cos differ in the last float digit across engines
      arr.push({ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) });
    }
    return arr;
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-40">
      <div className="relative flex flex-col items-center gap-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6 }}
          className="font-display text-sm tracking-[0.3em] text-white/60"
        >
          THE STARS ARE GATHERING…
        </motion.p>

        <svg
          viewBox="-24 -24 48 44"
          className="pulse-heart h-[260px] w-[260px] md:h-[340px] md:w-[340px]"
        >
          {pts.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={0.5}
              fill="#fecaca"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.03 }}
              style={{ filter: "drop-shadow(0 0 2px #f87171)" }}
            />
          ))}
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 2, delay: 1.2 }}
          className="glass-card max-w-2xl rounded-3xl p-8 text-center font-display text-white/90 md:p-12"
        >
          <p className="mb-4 text-sm tracking-[0.3em] text-white/60">DEAR TIYA,</p>
          {[
            "If today felt heavy…",
            "I hope this little world reminded you…",
            "Someone wanted to make you smile.",
            "Someone wanted you to know…",
            "You're never just another ordinary person.",
            "You are deeply appreciated.",
            "You are incredibly important.",
            "And somewhere,",
            "Someone believes tomorrow will be kinder to you.",
          ].map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 * i }}
              className="my-2 text-lg leading-relaxed md:text-xl"
            >
              {line}
            </motion.p>
          ))}
          <div className="mt-6 flex flex-col items-end">
            <span className="text-xs tracking-[0.3em] text-white/50">WITH ALL MY HEART,</span>
            <span
              className="font-script text-4xl text-glow md:text-5xl"
              style={{ color: "#fde68a" }}
            >
              Chinmay ❤
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------- Ending ----------------------- */
function Ending({ onReplay }: { onReplay: () => void }) {
  const lines = [
    "Sleep peacefully.",
    "You are loved.",
    "The stars will keep shining for you tonight.",
  ];
  return (
    <section className="relative flex min-h-[110vh] flex-col items-center justify-center gap-14 px-6 py-40">
      {lines.map((l, i) => (
        <HandwrittenText
          key={i}
          text={l}
          delay={i * 0.6}
          size="text-4xl md:text-6xl"
          color={i === 2 ? "#fef3c7" : "#fde68a"}
        />
      ))}
      <motion.button
        onClick={onReplay}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 2.4 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="glass-card mt-4 rounded-full px-6 py-3 font-display text-sm tracking-[0.2em] text-white/70"
      >
        ↺ RELIVE IT
      </motion.button>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 3, delay: 3 }}
        className="mt-6 text-xs tracking-[0.4em] text-white/40"
      >
        MADE WITH LOVE, BY CHINMAY, FOR TIYA
      </motion.div>
    </section>
  );
}

/* ----------------------- Root ----------------------- */
export function Experience() {
  const [introDone, setIntroDone] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const musicRef = useRef<NightMusic | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  const toggleSound = () => {
    if (!musicRef.current) musicRef.current = new NightMusic();
    if (soundOn) {
      musicRef.current.stop();
      setSoundOn(false);
    } else {
      musicRef.current.start();
      setSoundOn(true);
    }
  };
  useEffect(() => () => musicRef.current?.stop(), []);

  const replay = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setIntroDone(false);
  };

  return (
    <main className="aurora-bg relative min-h-screen overflow-x-hidden text-white">
      <StarField density={220} />
      {/* slow-breathing aurora */}
      <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
        <div
          className="aurora-blob"
          style={{
            left: "-10%",
            top: "-15%",
            background: "radial-gradient(circle, rgba(125,211,252,0.14), transparent 60%)",
            animationDuration: "26s",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            right: "-15%",
            top: "10%",
            background: "radial-gradient(circle, rgba(192,132,252,0.16), transparent 60%)",
            animationDuration: "34s",
            animationDelay: "-8s",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            left: "20%",
            bottom: "-25%",
            background: "radial-gradient(circle, rgba(253,230,138,0.10), transparent 60%)",
            animationDuration: "40s",
            animationDelay: "-16s",
          }}
        />
      </div>
      <Fireflies count={14} />
      <CursorMagic />
      <div className="grain z-[45]" />
      {/* Big moon in the far background */}
      <div className="pointer-events-none fixed right-[6vw] top-[8vh] z-0 origin-top-right scale-[0.65] drift-slow opacity-90 md:scale-100">
        <Moon size={180} />
      </div>
      {/* Floating fog */}
      <div
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(1200px 400px at 50% 100%, rgba(192,132,252,0.15), transparent 60%), radial-gradient(1000px 300px at 20% 80%, rgba(125,211,252,0.12), transparent 60%)",
        }}
      />

      <AnimatePresence>{!introDone && <Intro onDone={() => setIntroDone(true)} />}</AnimatePresence>

      {/* golden scroll thread */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left"
        style={{
          scaleX: progress,
          background: "linear-gradient(to right, #fde68a, #fef3c7, #c084fc)",
          boxShadow: "0 0 10px rgba(253,230,138,0.6)",
        }}
      />

      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        aria-pressed={soundOn}
        className="glass-card safe-top-left fixed z-[60] rounded-full px-4 py-2 text-xs tracking-widest text-white/80 transition-colors hover:text-amber-100"
      >
        {soundOn ? (
          "♪ HUSH"
        ) : (
          <>
            <span className="sm:hidden">♪ LULLABY</span>
            <span className="hidden sm:inline">♪ PLAY THE NIGHT&rsquo;S LULLABY</span>
          </>
        )}
      </button>

      <div className="relative z-10">
        {/* Scene 1: opening welcome after intro */}
        <section className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 20 }}
            transition={{ duration: 2, delay: 0.4 }}
            className="font-display text-sm tracking-[0.4em] text-white/60"
          >
            A LITTLE WORLD, MADE FOR YOU
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
            animate={{ opacity: introDone ? 1 : 0, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 2.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display max-w-4xl text-5xl italic leading-tight text-glow-soft md:text-8xl"
          >
            Tonight, the sky wanted to tell you something.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: introDone ? 0.7 : 0 }}
            transition={{ duration: 2, delay: 2.4 }}
            className="font-hand text-2xl text-amber-100/80"
          >
            scroll gently ↓
          </motion.p>
        </section>

        <LetterScene />
        <ConstellationScene />
        <MemoryGarden />
        <WishScene />
        <ButterflyScene />
        <MoonScene />
        <HeartConstellation />
        <Ending onReplay={replay} />
      </div>
    </main>
  );
}
