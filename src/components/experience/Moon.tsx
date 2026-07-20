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
      {/* craters */}
      <div
        className="absolute inset-0 rounded-full opacity-30 mix-blend-multiply"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(120,90,40,0.5) 0 3%, transparent 4%), radial-gradient(circle at 40% 65%, rgba(120,90,40,0.4) 0 2.5%, transparent 3.5%), radial-gradient(circle at 70% 70%, rgba(120,90,40,0.35) 0 2%, transparent 3%), radial-gradient(circle at 28% 42%, rgba(120,90,40,0.3) 0 1.6%, transparent 2.6%), radial-gradient(circle at 52% 22%, rgba(120,90,40,0.28) 0 1.2%, transparent 2.2%), radial-gradient(circle at 78% 52%, rgba(120,90,40,0.22) 0 1.4%, transparent 2.4%)",
        }}
      />
      {/* soft maria patches for texture */}
      <div
        className="absolute inset-0 rounded-full opacity-20 mix-blend-multiply"
        style={{
          background:
            "radial-gradient(ellipse 30% 22% at 62% 58%, rgba(150,110,50,0.5), transparent 70%), radial-gradient(ellipse 20% 16% at 38% 30%, rgba(150,110,50,0.4), transparent 70%)",
        }}
      />
      {/* limb darkening — gives the sphere depth */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, transparent 55%, rgba(146,64,14,0.25) 85%, rgba(120,53,15,0.45) 100%)",
        }}
      />
    </div>
  );
}
