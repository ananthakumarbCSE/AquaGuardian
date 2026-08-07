export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(6, 182, 212, 0.04) 0%, transparent 50%)",
        }}
      />

      {/* Floating Orb 1 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "400px",
          height: "400px",
          top: "10%",
          left: "15%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float-slow 20s ease-in-out infinite",
        }}
      />

      {/* Floating Orb 2 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "350px",
          height: "350px",
          top: "60%",
          right: "10%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float-slower 25s ease-in-out infinite",
        }}
      />

      {/* Floating Orb 3 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "300px",
          height: "300px",
          bottom: "20%",
          left: "40%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float-slowest 30s ease-in-out infinite",
        }}
      />

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
