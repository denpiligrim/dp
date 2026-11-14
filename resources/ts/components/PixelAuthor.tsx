import { CSSProperties, useEffect, useId, useRef, useState } from 'react';
import portrait from '../../data/author-pixels.json';

const SIZE = 480;
const DIAMETER = 360;
const CELL = DIAMETER / portrait.length;
const SQUARE = CELL * 0.94;
const INFLUENCE = 52;

// The photo is sampled ahead of time: the browser renders actual vector squares,
// without loading a bitmap or reading a canvas across the Vite origin.
const pixels = portrait.flatMap((row, y) => (row.match(/.{2}/g) || []).flatMap((tone, x) => {
  const px = (SIZE - DIAMETER) / 2 + (x + 0.5) * CELL;
  const py = (SIZE - DIAMETER) / 2 + (y + 0.5) * CELL;
  if (Math.hypot(px - SIZE / 2, py - SIZE / 2) > DIAMETER / 2 - CELL / 2) return [];
  const seed = ((x + 1) * 73856093 ^ (y + 1) * 19349663) >>> 0;
  const gray = parseInt(tone, 16);
  return [{
    x: px, y: py, gray,
    phase: (seed % 628) / 100,
    scatter: ((seed % 101) / 100 - 0.5) * 0.9,
    duration: 3.2 + (seed % 300) / 100,
    delay: -(seed % 700) / 100,
    pulse: seed % 3 === 0,
  }];
}));

export default function PixelAuthor() {
  const stageRef = useRef<HTMLDivElement>(null);
  const pixelRefs = useRef<(SVGGElement | null)[]>([]);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const titleId = useId();
  const hintId = useId();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = { x: 0, y: 0, active: false };
    const positions = pixels.map(() => ({ x: 0, y: 0, transform: '' }));
    let frame = 0;
    let previousTime = 0;
    let inView = true;

    const tick = (time: number) => {
      frame = 0;
      const elapsed = previousTime ? time - previousTime : 1000 / 60;
      previousTime = time;
      // Time-based easing keeps the same response on fast and slow displays.
      const follow = 1 - Math.exp(-elapsed / (pointer.active ? 100 : 160));
      let moving = false;

      pixels.forEach((pixel, index) => {
        const position = positions[index];
        let targetX = 0;
        let targetY = 0;
        if (pointer.active) {
          const dx = pixel.x - pointer.x;
          const dy = pixel.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < INFLUENCE) {
            const force = (1 - distance / INFLUENCE) ** 1.5 * 50;
            const angle = distance > 0.01 ? Math.atan2(dy, dx) : pixel.phase;
            targetX = (Math.cos(angle) - Math.sin(angle) * pixel.scatter) * force;
            targetY = (Math.sin(angle) + Math.cos(angle) * pixel.scatter) * force;
          }
        }
        position.x += (targetX - position.x) * follow;
        position.y += (targetY - position.y) * follow;

        const settled = Math.abs(targetX - position.x) + Math.abs(targetY - position.y) < 0.02;
        if (settled) {
          position.x = targetX;
          position.y = targetY;
        } else {
          moving = true;
        }
        const transform = position.x || position.y ? `translate(${position.x.toFixed(2)} ${position.y.toFixed(2)})` : '';
        if (transform !== position.transform) {
          const element = pixelRefs.current[index];
          if (transform) element?.setAttribute('transform', transform);
          else element?.removeAttribute('transform');
          position.transform = transform;
        }
      });

      if (moving) frame = requestAnimationFrame(tick);
      else previousTime = 0;
    };

    const wake = () => {
      if (!frame && !paused && inView && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (paused || event.pointerType === 'touch') return;
      const bounds = stage.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointer.x = (event.clientX - bounds.left) * SIZE / bounds.width;
      pointer.y = (event.clientY - bounds.top) * SIZE / bounds.height;
      pointer.active = true;
      wake();
    };
    const leave = () => {
      pointer.active = false;
      wake();
    };
    const sync = () => {
      stage.dataset.sleeping = String(!inView || document.hidden);
      if (!inView || document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
        pointer.active = false;
      } else {
        wake();
      }
    };
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer?.observe(stage);
    stage.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerleave', leave);
    stage.addEventListener('pointercancel', leave);
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', leave);
      stage.removeEventListener('pointercancel', leave);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', sync);
      pixelRefs.current.forEach(element => element?.removeAttribute('transform'));
    };
  }, [paused]);

  return (
    <div className="pixel-author" data-paused={paused}>
      <div className="pixel-author-stage" ref={stageRef}>
        <div className="pixel-author-frame" aria-hidden="true" />
        <svg className="pixel-author-portrait" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-labelledby={titleId} aria-describedby={hintId}>
          <title id={titleId}>Черно-белый портрет DenPiligrim из отдельных квадратных пикселей</title>
          {pixels.map((pixel, index) => (
            <g key={index} ref={element => { pixelRefs.current[index] = element; }} className="pixel-author-pixel">
              <rect
                className={`pixel-author-square${pixel.pulse ? ' pixel-author-square-pulse' : ''}`}
                x={pixel.x - SQUARE / 2} y={pixel.y - SQUARE / 2}
                width={SQUARE} height={SQUARE}
                fill={`rgb(${pixel.gray}, ${pixel.gray}, ${pixel.gray})`}
                style={{ '--pulse-duration': `${pixel.duration}s`, '--pulse-delay': `${pixel.delay}s` } as CSSProperties}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
