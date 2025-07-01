"use client";

const bubbles = [
  // x, y, size, color, blur, animation duration
  { x: "10%", y: "20%", size: 220, color: "#3a8fff", blur: 40, duration: 18, opacity: 0.5 },
  { x: "70%", y: "15%", size: 180, color: "#00eaff", blur: 32, duration: 22, opacity: 0.45 },
  { x: "30%", y: "70%", size: 260, color: "#00eaff", blur: 48, duration: 25, opacity: 0.4 },
  { x: "80%", y: "60%", size: 140, color: "#3a8fff", blur: 28, duration: 20, opacity: 0.35 },
  { x: "50%", y: "40%", size: 300, color: "#1e1aff", blur: 60, duration: 30, opacity: 0.3 },
  { x: "20%", y: "80%", size: 120, color: "#00ffc6", blur: 24, duration: 16, opacity: 0.35 },
];

const NeonBubblesBackground = () => (
  <div className="neon-bubbles-bg">
    {bubbles.map((b, i) => (
      <div
        key={i}
        className="neon-bubble"
        style={{
          left: b.x,
          top: b.y,
          width: b.size,
          height: b.size,
          background: `radial-gradient(circle at 60% 40%, ${b.color} 0%, transparent 70%)`,
          filter: `blur(${b.blur}px)`,
          opacity: b.opacity,
          animation: `bubbleFloat${i} ${b.duration}s ease-in-out infinite alternate`,
        }}
      />
    ))}
    <style jsx>{`
      .neon-bubbles-bg {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
      }
      .neon-bubble {
        position: absolute;
        border-radius: 50%;
        will-change: transform, opacity;
        transition: opacity 0.5s;
      }
      ${bubbles
        .map(
          (b, i) => `@keyframes bubbleFloat${i} {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-30px) scale(1.08); }
          }`
        )
        .join("\n")}
      @media (max-width: 768px) {
        .neon-bubble {
          width: 60vw !important;
          height: 60vw !important;
        }
      }
    `}</style>
  </div>
);

export default NeonBubblesBackground; 