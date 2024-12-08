import { useMediaQuery, useTheme } from "@mui/material";
import React, { useRef, useEffect } from "react";

const RainAnimation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
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
        const randomSpeed = randomNum(8, 0.2);
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

  if (isMobile) return <></>;
  return <canvas ref={canvasRef} className="rain" />;
};

// Вспомогательная функция для случайного числа
const randomNum = (max: number, min: number): number => {
  return Math.random() * (max - min) + min;
};

// Класс капли дождя
// Класс капли дождя
class RainDrops {
  // Добавляем свойство для хранения текста
  x: number;
  y: number;
  endy: number;
  velocity: number;
  opacity: number;
  ctx: CanvasRenderingContext2D;
  text: string;

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

    // Генерируем случайно либо "0", либо "1"
    this.text = Math.random() > 0.5 ? "0" : "1";
  }

  draw() {
    this.ctx.font = "16px monospace"; // Устанавливаем шрифт
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // Цвет с прозрачностью
    this.ctx.fillText(this.text, this.x, this.y); // Рисуем текст
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