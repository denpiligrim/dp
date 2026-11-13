import { CSSProperties, useEffect, useId, useRef, useState } from 'react';
import character from '../../images/author-vector.svg?raw';
import faceReference from '../../images/author-reference.png';

// Only occupied rows become particles. One shared character and face image, no frame buffers or timers.
const rowBounds = [[2, 7], [2, 7], [2, 7], [2, 7], [2, 7], [2, 7], [1, 8], [1, 8], [1, 8], [2, 7], [2, 7], [2, 7]];
const particles = rowBounds.flatMap(([left, right], row) => Array.from({ length: right - left + 1 }, (_, index) => {
  const col = left + index;
  const seed = (row * 31 + col * 17) % 23;
  return { x: col * 40, y: row * 40, dx: (col - 4.5) * (25 + seed * 3), dy: (row - 5.5) * (15 + seed * 2), rotate: (seed - 11) * 9, delay: seed * 17 };
}));
const vectorBody = character.replace(/<svg[^>]*>/, '').replace('</svg>', '')
  .replace('href="author-reference.png"', `href="${faceReference}"`);

export default function PixelAuthor() {
  const prefix = useId().replace(/:/g, '');
  const sceneRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let inView = true;
    const sync = () => { scene.dataset.sleeping = String(!inView || document.hidden); };
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer?.observe(scene);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { observer?.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);

  return (
    <div className="pixel-author" ref={sceneRef} data-paused={paused}>
      <div className="pixel-author-top"><span><i /> author.render()</span><span>DENPILIGRIM</span></div>
      <div className="pixel-author-stage">
        <span className="pixel-author-cross pixel-author-cross-a" aria-hidden="true">+</span>
        <span className="pixel-author-cross pixel-author-cross-b" aria-hidden="true">+</span>
        <span className="pixel-author-label" aria-hidden="true">привет с другой стороны экрана :)</span>
        <div className="pixel-author-floor" aria-hidden="true" />
        <svg viewBox="-80 -30 560 570" role="img" aria-labelledby={`${prefix}-title`} className="pixel-author-vector">
          <title id={`${prefix}-title`}>DenPiligrim с ноутбуком: персонаж с лицом из авторского аватара рассыпается и собирается снова</title>
          <defs>
            <g id={`${prefix}-figure`} fill="none" dangerouslySetInnerHTML={{ __html: vectorBody.replaceAll('author-reference-head', `${prefix}-head`) }} />
            {particles.map((tile, index) => <clipPath id={`${prefix}-tile-${index}`} key={index}><rect x={tile.x - .2} y={tile.y - .2} width="40.4" height="40.4" /></clipPath>)}
          </defs>
          <g key={cycle} className="pixel-author-particles">
            {particles.map((tile, index) => (
              <g className="pixel-author-particle" key={index} style={{ '--dx': `${tile.dx}px`, '--dy': `${tile.dy}px`, '--turn': `${tile.rotate}deg`, '--delay': `${tile.delay}ms` } as CSSProperties}>
                <g clipPath={`url(#${prefix}-tile-${index})`}><use href={`#${prefix}-figure`} /></g>
              </g>
            ))}
            <use className="pixel-author-solid" href={`#${prefix}-figure`} />
          </g>
        </svg>
        <span className="pixel-author-code" aria-hidden="true"><span>const</span> me = <b>create</b>(ideas);</span>
      </div>
      <div className="pixel-author-controls">
        <span className="pixel-author-hint">Собираю сложное из простого</span>
        <button type="button" aria-label="Повторить сборку персонажа" onClick={() => { setCycle(value => value + 1); setPaused(false); }}>↻ <span>Ещё раз</span></button>
        <button type="button" aria-pressed={paused} aria-label={paused ? 'Продолжить анимацию' : 'Приостановить анимацию'} onClick={() => setPaused(value => !value)}>{paused ? '▷' : 'Ⅱ'}</button>
      </div>
    </div>
  );
}
