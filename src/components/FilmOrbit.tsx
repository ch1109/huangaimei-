import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import { works } from '../data/works';
import type { OpenWork } from './HangingCard';
import { Arrow, Play } from './Icons';
import { Poster } from './Poster';
import '../orbit.css';

const films = ['W11', 'W17', 'W19', 'W15', 'W01', 'W18'].map(id => works.find(work => work.id === id)!);
const wrap = (value: number) => ((value % films.length) + films.length) % films.length;
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

/** A continuous orbit: dragging moves the same angular position used by buttons and keys. */
export function FilmOrbit({ onOpen, paused = false }: { onOpen: OpenWork; paused?: boolean }) {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const position = useRef(0);
  const animation = useRef<{ stop: () => void } | null>(null);
  const gesture = useRef({ pointer: -1, x: 0, y: 0, lastX: 0, time: 0, speed: 0, origin: 0, moved: false, vertical: false });
  const [angle, setAngle] = useState(0);
  const [selected, setSelected] = useState(0);
  const [moving, setMoving] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const current = films[selected];
  const canPreview = inView && visible && !moving && !reduced && previewEnabled && !paused && !previewFailed;

  useEffect(() => {
    const observer = new IntersectionObserver(entries => setInView(entries[0].isIntersecting), { threshold: .3 });
    if (section.current) observer.observe(section.current);
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); animation.current?.stop(); };
  }, []);
  useEffect(() => { setPreviewFailed(false); }, [selected]);
  useEffect(() => {
    const element = video.current;
    if (!element || !canPreview) return;
    element.play().catch(() => setPreviewFailed(true));
    return () => { element.pause(); };
  }, [canPreview, selected]);

  const update = (value: number) => { position.current = value; setAngle(value); };
  const settle = (destination: number) => {
    animation.current?.stop();
    const target = Math.round(destination);
    if (reduced) { update(target); setSelected(wrap(target)); setMoving(false); return; }
    setMoving(true);
    animation.current = animate(position.current, target, {
      type: 'spring', stiffness: 105, damping: 23, restDelta: .001, restSpeed: .005,
      onUpdate: update,
      onComplete: () => { update(target); setSelected(wrap(target)); setMoving(false); },
    });
  };
  const select = (index: number) => {
    const nearest = Math.round(position.current);
    let delta = wrap(index - wrap(nearest));
    if (delta > films.length / 2) delta -= films.length;
    settle(nearest + delta);
  };
  const step = (direction: number) => settle(Math.round(position.current) + direction);
  const beginDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    animation.current?.stop();
    gesture.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, time: event.timeStamp, speed: 0, origin: position.current, moved: false, vertical: false };
  };
  const drag = (event: PointerEvent<HTMLDivElement>) => {
    const state = gesture.current;
    if (state.pointer !== event.pointerId || state.vertical) return;
    const dx = event.clientX - state.x;
    const dy = event.clientY - state.y;
    if (!state.moved && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
      state.vertical = true; settle(position.current); return;
    }
    if (!state.moved && Math.abs(dx) < 7) return;
    if (!state.moved) { state.moved = true; event.currentTarget.setPointerCapture(event.pointerId); setMoving(true); }
    const distance = event.currentTarget.clientWidth * .31;
    const elapsed = Math.max(8, event.timeStamp - state.time);
    state.speed = -(event.clientX - state.lastX) / distance / elapsed;
    state.lastX = event.clientX; state.time = event.timeStamp;
    update(state.origin - dx / distance);
  };
  const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const state = gesture.current;
    if (state.pointer !== event.pointerId) return;
    state.pointer = -1;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    // A held pointer should settle locally instead of retaining an old fling velocity.
    const velocity = event.timeStamp - state.time < 100 && !cancelled ? state.speed : 0;
    if (state.moved || moving) settle(position.current + clamp(velocity * 180, 1.4));
  };
  const openCurrent = (trigger: string) => { video.current?.pause(); onOpen(current, true, trigger); };

  return <section ref={section} id="film-orbit" className="film-orbit" aria-labelledby="orbit-title">
    <div className="orbit-heading section-wrap">
      <p className="orbit-eyebrow mono">SPIN TO FIND YOUR NEXT FILM</p>
      <h2 id="orbit-title">转一转，<br /><span>遇见下一段故事。</span></h2>
      <p className="orbit-description">拖动影像转盘，让喜欢的画面停在眼前。</p>
    </div>
    <div className={`orbit-stage ${moving ? 'is-moving' : ''}`} role="group" aria-roledescription="三维作品转盘" aria-label="拖动或使用左右方向键选择作品" aria-busy={moving} tabIndex={0}
      onPointerDown={beginDrag} onPointerMove={drag} onPointerUp={event => finishDrag(event)} onPointerCancel={event => finishDrag(event, true)}
      onLostPointerCapture={event => { if (gesture.current.pointer === event.pointerId) finishDrag(event, true); }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
        if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); select(event.key === 'Home' ? 0 : films.length - 1); }
      }}>
      <img className="orbit-rail" src="/orbit/stage-rail.png" width="1984" height="768" loading="lazy" alt="" draggable={false} />
      {films.map((work, index) => {
        const radians = (index - angle) * Math.PI * 2 / films.length;
        const depth = (Math.cos(radians) + 1) / 2;
        const front = index === selected;
        const style = {
          '--orbit-x': `${Math.sin(radians) * 37}%`,
          '--orbit-y': `${(1 - depth) * -38}%`,
          '--orbit-scale': .42 + .58 * Math.pow(depth, 2),
          '--orbit-turn': `${-Math.sin(radians) * 65}deg`,
          '--orbit-depth': depth,
          zIndex: Math.round(10 + depth * 50),
        } as CSSProperties;
        return <div key={work.id} className={`orbit-frame ${front ? 'is-selected' : ''}`} style={style}>
          <button id={`orbit-film-${work.id}`} className="orbit-screen" aria-label={front ? `播放转盘作品：${work.shortTitle}` : `选中转盘作品：${work.shortTitle}`} aria-current={front ? 'true' : undefined}
            onClick={event => { if (event.detail !== 0 && gesture.current.moved) return; if (front && !moving) openCurrent(`orbit-film-${work.id}`); else select(index); }}>
            <Poster work={work} variant={work.id === 'W01' ? 'cover' : 'frame'} />
            {front && canPreview && <video key={work.id} ref={video} className="orbit-preview" src={work.preview ?? work.video} muted loop playsInline preload="none" aria-hidden="true" onError={() => setPreviewFailed(true)} onTimeUpdate={event => { if (event.currentTarget.currentTime > 5) event.currentTarget.currentTime = .2; }} />}
            <span className="orbit-screen-shine" aria-hidden="true" />
            {front && <span className="orbit-play" aria-hidden="true"><Play /></span>}
          </button>
        </div>;
      })}
    </div>
    <div className="orbit-controls section-wrap">
      <div className="orbit-drag-hint"><Arrow direction="left" /><span className="orbit-desktop-hint">拖动旋转 · 松手停靠</span><span className="orbit-mobile-hint">左右滑动 · 发现作品</span><Arrow direction="right" />{!reduced && <button className="orbit-preview-toggle" aria-pressed={!previewEnabled} onClick={() => setPreviewEnabled(enabled => !enabled)}>{previewEnabled ? '暂停预览' : '开启预览'}</button>}</div>
      <div className="orbit-selection-row">
        <button className="orbit-step" aria-label="转盘上一部作品" onClick={() => step(-1)}><Arrow direction="left" /></button>
        <div className="orbit-selection" aria-live="polite" aria-atomic="true"><h3>{current.shortTitle}</h3><p>{current.category}<span>/</span><span className="mono">{current.duration}</span></p></div>
        <button className="orbit-step" aria-label="转盘下一部作品" onClick={() => step(1)}><Arrow direction="right" /></button>
      </div>
      <button id="orbit-watch" className="orbit-watch" disabled={moving} onClick={() => openCurrent('orbit-watch')}>观看这部作品 <Arrow /></button>
      <div className="orbit-dots" role="group" aria-label="选择转盘作品">{films.map((work, index) => <button key={work.id} aria-label={`转盘切换至${work.shortTitle}`} aria-pressed={selected === index} onClick={() => select(index)}><span /></button>)}</div>
    </div>
    <div className="orbit-guide section-wrap"><div><span className="orbit-guide-number mono">01</span><p><strong>拨动转盘</strong><span>画面带着惯性轻轻旋转</span></p></div><div><span className="orbit-guide-number mono">02</span><p><strong>自动停靠</strong><span>正前方作品吸附对齐并预览</span></p></div><div><span className="orbit-guide-number mono">03</span><p><strong>点击观看</strong><span>从发现到播放，一步进入</span></p></div><p className="orbit-guide-note">每一段画面，都有自己的故事。</p></div>
  </section>;
}
