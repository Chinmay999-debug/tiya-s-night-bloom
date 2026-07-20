import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; r: number; tw: number };

export function StarField({
  density = 260,
  shooting = true,
}: {
  density?: number;
  shooting?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = (canvas.width = window.innerWidth * dpr);
    let h = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    // fewer stars on small screens so phones stay smooth
    const starCount = window.innerWidth < 768 ? Math.round(density * 0.55) : density;
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.9 + 0.1,
      r: Math.random() * 1.6 + 0.2,
      tw: Math.random() * Math.PI * 2,
    }));

    type Shoot = { x: number; y: number; vx: number; vy: number; life: number };
    let shoot: Shoot | null = null;
    let last = performance.now();
    let raf = 0;
    let mouseX = 0,
      mouseY = 0;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      if (reduceMotion) drawStatic();
    };
    window.addEventListener("resize", onResize);

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 246, 220, ${0.4 + s.z * 0.4})`;
        ctx.arc(s.x, s.y, s.r * s.z * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      ctx.clearRect(0, 0, w, h);

      // subtle parallax offset from mouse
      const px = (mouseX / window.innerWidth - 0.5) * 30 * dpr;
      const py = (mouseY / window.innerHeight - 0.5) * 30 * dpr;

      for (const s of stars) {
        s.tw += dt * (0.6 + s.z);
        const a = 0.35 + Math.sin(s.tw) * 0.35 + s.z * 0.3;
        const x = s.x - px * s.z;
        const y = s.y - py * s.z;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 246, 220, ${a})`;
        ctx.arc(x, y, s.r * s.z * dpr, 0, Math.PI * 2);
        ctx.fill();
        if (s.z > 0.75 && Math.sin(s.tw) > 0.9) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(253, 230, 138, ${a * 0.5})`;
          ctx.arc(x, y, s.r * s.z * 2.4 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (shooting) {
        if (!shoot && Math.random() < 0.004) {
          shoot = {
            x: Math.random() * w * 0.6,
            y: Math.random() * h * 0.3,
            vx: (300 + Math.random() * 200) * dpr,
            vy: (120 + Math.random() * 100) * dpr,
            life: 1,
          };
        }
        if (shoot) {
          shoot.x += shoot.vx * dt;
          shoot.y += shoot.vy * dt;
          shoot.life -= dt * 0.6;
          const grad = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - 120, shoot.y - 50);
          grad.addColorStop(0, `rgba(255,255,255,${shoot.life})`);
          grad.addColorStop(1, `rgba(255,255,255,0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2 * dpr;
          ctx.beginPath();
          ctx.moveTo(shoot.x, shoot.y);
          ctx.lineTo(shoot.x - 140, shoot.y - 60);
          ctx.stroke();
          if (shoot.life <= 0) shoot = null;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [density, shooting]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" />;
}
