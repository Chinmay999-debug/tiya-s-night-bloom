import { useEffect, useState } from "react";

type Petal = {
  id: number;
  left: number;
  delay: number;
  dur: number;
  size: number;
  hue: number;
  rot: number;
  sway: number;
};

export function Petals({ count = 24 }: { count?: number }) {
  // Generated on the client only — random values during SSR cause hydration mismatches.
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        dur: 12 + Math.random() * 12,
        size: 8 + Math.random() * 14,
        hue: 340 + Math.random() * 20,
        rot: Math.random() * 360,
        sway: 60 + Math.random() * 120,
      })),
    );
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.7,
              background: `radial-gradient(ellipse at 30% 30%, hsla(${p.hue},90%,88%,0.95), hsla(${p.hue},80%,70%,0.4))`,
              borderRadius: "60% 40% 60% 40% / 60% 60% 40% 40%",
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              transform: `rotate(${p.rot}deg)`,
              filter: "drop-shadow(0 0 6px rgba(255,200,220,0.5))",
              "--sway": `${p.sway}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
