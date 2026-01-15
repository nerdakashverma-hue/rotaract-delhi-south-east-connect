import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 8000);

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          speed: Math.random() * 0.3 + 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawStar = (star: Star, time: number) => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
      const opacity = star.opacity * twinkle;

      // Create gradient for star glow
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.size * 2
      );

      // Blue-tinted stars with some white
      const isBlue = Math.random() > 0.3;
      if (isBlue) {
        gradient.addColorStop(0, `rgba(147, 197, 253, ${opacity})`); // Light blue
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${opacity * 0.5})`); // Blue
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
      } else {
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(199, 210, 254, ${opacity * 0.5})`); // Indigo tint
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core of the star
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, "hsl(230, 35%, 8%)"); // Deep blue-black
      bgGradient.addColorStop(0.3, "hsl(240, 30%, 12%)"); // Dark indigo
      bgGradient.addColorStop(0.6, "hsl(250, 25%, 15%)"); // Purple-blue
      bgGradient.addColorStop(1, "hsl(260, 20%, 10%)"); // Dark purple
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle nebula-like clouds
      drawNebula(ctx, canvas.width, canvas.height, time);

      // Update and draw stars
      stars.forEach((star) => {
        // Slow upward drift
        star.y -= star.speed * 0.3;
        if (star.y < -10) {
          star.y = canvas.height + 10;
          star.x = Math.random() * canvas.width;
        }

        drawStar(star, time);
      });

      // Draw shooting stars occasionally
      if (Math.random() < 0.002) {
        drawShootingStar(ctx, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const drawNebula = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      // Subtle blue nebula clouds
      const nebulaGradient1 = ctx.createRadialGradient(
        width * 0.2 + Math.sin(time * 0.0005) * 50,
        height * 0.3,
        0,
        width * 0.2,
        height * 0.3,
        width * 0.3
      );
      nebulaGradient1.addColorStop(0, "rgba(59, 130, 246, 0.08)");
      nebulaGradient1.addColorStop(0.5, "rgba(99, 102, 241, 0.04)");
      nebulaGradient1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = nebulaGradient1;
      ctx.fillRect(0, 0, width, height);

      const nebulaGradient2 = ctx.createRadialGradient(
        width * 0.8 + Math.cos(time * 0.0003) * 30,
        height * 0.6,
        0,
        width * 0.8,
        height * 0.6,
        width * 0.25
      );
      nebulaGradient2.addColorStop(0, "rgba(139, 92, 246, 0.06)");
      nebulaGradient2.addColorStop(0.5, "rgba(59, 130, 246, 0.03)");
      nebulaGradient2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = nebulaGradient2;
      ctx.fillRect(0, 0, width, height);
    };

    const drawShootingStar = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const startX = Math.random() * width;
      const startY = Math.random() * height * 0.5;
      const length = Math.random() * 100 + 50;
      const angle = Math.PI / 4 + Math.random() * 0.3;

      const gradient = ctx.createLinearGradient(
        startX, startY,
        startX + Math.cos(angle) * length,
        startY + Math.sin(angle) * length
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(0.3, "rgba(147, 197, 253, 0.5)");
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)");

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
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