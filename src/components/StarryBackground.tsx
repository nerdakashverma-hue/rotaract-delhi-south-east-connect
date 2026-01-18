import { useEffect, useRef } from "react";

interface FloatingOrb {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  hue: number;
}

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let orbs: FloatingOrb[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initOrbs();
    };

    const initOrbs = () => {
      orbs = [];
      const orbCount = Math.floor((canvas.width * canvas.height) / 50000);

      for (let i = 0; i < Math.max(orbCount, 8); i++) {
        orbs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 150 + 80,
          opacity: Math.random() * 0.08 + 0.03,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          hue: 340 + (Math.random() - 0.5) * 20, // Pink hues
        });
      }
    };

    const drawOrb = (orb: FloatingOrb) => {
      const gradient = ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, orb.size
      );

      gradient.addColorStop(0, `hsla(${orb.hue}, 65%, 55%, ${orb.opacity})`);
      gradient.addColorStop(0.5, `hsla(${orb.hue}, 50%, 65%, ${orb.opacity * 0.5})`);
      gradient.addColorStop(1, `hsla(${orb.hue}, 40%, 75%, 0)`);

      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      // Clean white background
      ctx.fillStyle = "hsl(340, 30%, 98%)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw orbs
      orbs.forEach((orb) => {
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        // Wrap around edges
        if (orb.x < -orb.size) orb.x = canvas.width + orb.size;
        if (orb.x > canvas.width + orb.size) orb.x = -orb.size;
        if (orb.y < -orb.size) orb.y = canvas.height + orb.size;
        if (orb.y > canvas.height + orb.size) orb.y = -orb.size;

        drawOrb(orb);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
