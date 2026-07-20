export function Moon({ size = 320, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full moon-glow"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #fffbeb 0%, #fef3c7 40%, #fde68a 70%, #f59e0b 100%)",
        }}
      />
      {/* subtle craters */}
      <div className="absolute inset-0 rounded-full opacity-30 mix-blend-multiply"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(120,90,40,0.5) 0 3%, transparent 4%), radial-gradient(circle at 40% 65%, rgba(120,90,40,0.4) 0 2.5%, transparent 3.5%), radial-gradient(circle at 70% 70%, rgba(120,90,40,0.35) 0 2%, transparent 3%)",
        }}
      />
    </div>
  );
}
