import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; life: number; hue: number; size: number };

export function CursorMagic() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const parts: P[] = [];
    let mx = -9999,
      my = -9999;
    let lastEmit = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX * dpr;
      my = e.clientY * dpr;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mx = e.touches[0].clientX * dpr;
        my = e.touches[0].clientY * dpr;
      }
    };
    // little stardust burst wherever she clicks or taps
    const burst = (x: number, y: number) => {
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 60 + Math.random() * 140;
        parts.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 30,
          life: 1,
          hue: Math.random() < 0.7 ? 40 + Math.random() * 40 : 290 + Math.random() * 40,
          size: 1.5 + Math.random() * 2.5,
        });
      }
    };
    const onClick = (e: MouseEvent) => burst(e.clientX * dpr, e.clientY * dpr);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("click", onClick);

    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (t - lastEmit > 22 && mx > 0) {
        lastEmit = t;
        for (let i = 0; i < 2; i++) {
          parts.push({
            x: mx + (Math.random() - 0.5) * 20,
            y: my + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 30,
            vy: -20 - Math.random() * 40,
            life: 1,
            hue: 40 + Math.random() * 40, // warm firefly
            size: 2 + Math.random() * 2.5,
          });
        }
        // occasional pink/violet
        if (Math.random() < 0.3) {
          parts.push({
            x: mx,
            y: my,
            vx: (Math.random() - 0.5) * 20,
            vy: -10 - Math.random() * 30,
            life: 1,
            hue: 290 + Math.random() * 40,
            size: 3,
          });
        }
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx * dt * dpr;
        p.y += p.vy * dt * dpr;
        p.vy += 8 * dt * dpr;
        p.life -= dt * 0.55;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        const a = Math.max(0, p.life);
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8 * dpr);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 75%, ${a})`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size * 8 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${a})`;
        ctx.arc(p.x, p.y, p.size * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-40" />;
}
