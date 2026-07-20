import { useEffect, useRef } from "react";

type Fly = {
  x: number;
  y: number;
  a: number; // heading
  speed: number;
  glow: number; // pulse phase
  glowSpeed: number;
  size: number;
  hue: number;
};

/** Slow, wandering fireflies drifting over the whole page. */
export function Fireflies({ count = 14 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0,
      h = 0;
    const resize = () => {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const flyCount = window.innerWidth < 768 ? Math.max(6, Math.round(count * 0.6)) : count;
    const flies: Fly[] = Array.from({ length: flyCount }, () => ({
      x: Math.random() * window.innerWidth * dpr,
      y: Math.random() * window.innerHeight * dpr,
      a: Math.random() * Math.PI * 2,
      speed: (8 + Math.random() * 16) * dpr,
      glow: Math.random() * Math.PI * 2,
      glowSpeed: 0.6 + Math.random() * 1.2,
      size: 1.2 + Math.random() * 1.6,
      hue: 45 + Math.random() * 25,
    }));

    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);

      for (const f of flies) {
        f.a += (Math.random() - 0.5) * 1.6 * dt;
        f.x += Math.cos(f.a) * f.speed * dt;
        f.y += Math.sin(f.a) * f.speed * dt;
        f.glow += f.glowSpeed * dt;

        // wrap around edges
        if (f.x < -20) f.x = w + 20;
        if (f.x > w + 20) f.x = -20;
        if (f.y < -20) f.y = h + 20;
        if (f.y > h + 20) f.y = -20;

        const pulse = 0.25 + (Math.sin(f.glow) * 0.5 + 0.5) * 0.75;
        const r = f.size * dpr;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r * 10);
        grad.addColorStop(0, `hsla(${f.hue}, 100%, 78%, ${0.55 * pulse})`);
        grad.addColorStop(1, `hsla(${f.hue}, 100%, 60%, 0)`);
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(f.x, f.y, r * 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `hsla(${f.hue}, 100%, 88%, ${pulse})`;
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[6]" />;
}
