import React, { useRef, useEffect } from "react";

const RainAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rainArrayRef = useRef<RainDrops[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Создание капель дождя
    const createRainDrops = () => {
      rainArrayRef.current = [];
      for (let i = 0; i < 140; i++) {
        const rainXLocation = Math.floor(Math.random() * window.innerWidth) + 1;
        const rainYLocation = Math.random() * -500;
        const randomRainHeight = randomNum(10, 2);
        const randomSpeed = randomNum(20, 0.2);
        const randomOpacity = Math.random() * 0.55;
        rainArrayRef.current.push(new RainDrops(rainXLocation, rainYLocation, randomRainHeight, randomSpeed, randomOpacity, ctx));
      }
    };

    createRainDrops();

    const animateRain = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rainArrayRef.current.forEach((rainDrop) => rainDrop.update());
      animationFrameRef.current = requestAnimationFrame(animateRain);
    };

    animateRain();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="rain" />;
};

// Вспомогательная функция для случайного числа
const randomNum = (max: number, min: number): number => {
  return Math.random() * (max - min) + min;
};

// Класс капли дождя
class RainDrops {
  x: number;
  y: number;
  endy: number;
  velocity: number;
  opacity: number;
  ctx: CanvasRenderingContext2D;

  constructor(
    x: number,
    y: number,
    endy: number,
    velocity: number,
    opacity: number,
    ctx: CanvasRenderingContext2D
  ) {
    this.x = x;
    this.y = y;
    this.endy = endy;
    this.velocity = velocity;
    this.opacity = opacity;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x, this.y - this.endy);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
    this.ctx.stroke();
  }

  update() {
    const rainEnd = window.innerHeight + 100;
    if (this.y >= rainEnd) {
      this.y = this.endy - 100;
    } else {
      this.y += this.velocity;
    }
    this.draw();
  }
}

export default RainAnimation;