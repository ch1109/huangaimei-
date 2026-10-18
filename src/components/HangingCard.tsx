import { useEffect, useRef, useState } from 'react';
import { animate, motion, useDragControls, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { Work } from '../data/works';
import { Play, Arrow, Plus } from './Icons';
import { Poster } from './Poster';

export type OpenWork = (work: Work, play: boolean, triggerId: string) => void;
export function HangingCard({ work, index, onOpen, activePreview, setActivePreview }: { work: Work; index: number; onOpen: OpenWork; activePreview: string | null; setActivePreview: (id: string | null) => void }) {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const controls = useDragControls();
  const x = useMotionValue(0); const y = useMotionValue(0);
  const tilt = useSpring(0, { stiffness: 170, damping: 20 });
  const preview = useRef<HTMLVideoElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const flipButton = useRef<HTMLButtonElement>(null);
  const flippedOnce = useRef(false);
  const dragged = useRef(false);
  const origin = useRef({ x: 0, y: 0 });
  const rotation = [-4, 3, -2, 4][index];
  const id = `featured-${work.id}`;
  useEffect(() => {
    const query = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 640px)');
    const update = () => setFinePointer(query.matches); update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (flippedOnce.current) (flipped ? backButton.current : flipButton.current)?.focus();
  }, [flipped]);
  const flip = (value: boolean) => { flippedOnce.current = true; setActivePreview(null); setFlipped(value); };
  const showPreview = activePreview === work.id && finePointer && !reduced && !flipped;
  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    if (showPreview) el.play().catch(() => setActivePreview(null));
    else { el.pause(); el.currentTime = 0; }
    const stop = () => { if (document.hidden) { el.pause(); setActivePreview(null); } };
    document.addEventListener('visibilitychange', stop);
    return () => { el.pause(); document.removeEventListener('visibilitychange', stop); };
  }, [showPreview, setActivePreview]);
  const open = (play: boolean, target: string) => { setActivePreview(null); if (!dragged.current) onOpen(work, play, target); };
  return <motion.div className={`hanging-slot slot-${index}`} initial={reduced ? false : { opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : index * .09 }}>
    <div className="hanger-line" aria-hidden="true"><i /><b /></div>
    <motion.article className={`hanging-card ${flipped ? 'is-flipped' : ''}`} data-testid={`hanging-${work.id}`} style={{ x, y, rotate: tilt, '--rest-rotation': `${rotation}deg` } as never}
      drag={finePointer && !reduced} dragListener={false} dragControls={controls} dragConstraints={{ top: -24, bottom: 24, left: -24, right: 24 }} dragElastic={0.08} dragMomentum={false}
      onDragEnd={() => { animate(x, 0, { type: 'spring', stiffness: 190, damping: 18 }); animate(y, 0, { type: 'spring', stiffness: 190, damping: 18 }); tilt.set(0); }}
      onPointerDown={e => {
        dragged.current = false;
        if (!finePointer || reduced || (e.target as HTMLElement).closest('button,a')) return;
        setActivePreview(null);
        origin.current = { x: e.clientX, y: e.clientY }; controls.start(e);
      }}
      onPointerMove={e => {
        if (e.buttons && Math.hypot(e.clientX - origin.current.x, e.clientY - origin.current.y) > 6) dragged.current = true;
        if (finePointer && !reduced && !e.buttons) {
          const rect = e.currentTarget.getBoundingClientRect(); tilt.set(((e.clientX - rect.left) / rect.width - .5) * 6);
        }
      }} onPointerEnter={() => { if (finePointer && !reduced && !flipped) setActivePreview(work.id); }} onPointerLeave={() => { tilt.set(0); if (activePreview === work.id) setActivePreview(null); }}>
      <div className="card-rest">
        <motion.div className="card-flipper" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: reduced ? 0 : .42, ease: [.22, 1, .36, 1] }}>
          <div className="card-face card-front" inert={flipped} aria-hidden={flipped}>
            <div className="tag-top"><span className="mono">SELECTED / 0{index + 1}</span><span>{work.projectType === '个人练习' ? '练习' : '作品'}</span></div>
            <div className="tag-hole" aria-hidden="true" />
            <button id={id} className={`tag-picture ${work.width && work.width > (work.height ?? 0) ? 'landscape' : 'portrait'}`} onClick={() => open(false, id)} aria-label={`查看${work.shortTitle}`}>
              <Poster work={work} eager />
              {work.preview && showPreview && <video ref={preview} src={work.preview} muted loop playsInline preload="none" aria-hidden="true" className="tag-preview" />}
              <span className="tag-play"><Play /></span>
              <span className="picture-time mono">{work.duration}</span>
            </button>
            <div className="tag-copy"><div className="tag-type">{work.kind}</div><h2>{work.shortTitle}</h2><p>{work.projectType === '个人练习' ? '个人练习' : work.responsibilities.slice(0, 2).join(' / ')}</p></div>
            <div className="tag-bottom"><button ref={flipButton} className="flip-button" onClick={() => flip(true)} aria-label={`${work.shortTitle}：我负责的部分`}>我负责的部分 <Plus /></button><button id={`${id}-play`} className="round-button" onClick={() => open(true, `${id}-play`)} aria-label={`播放${work.shortTitle}`}><Play /></button></div>
          </div>
          <div className="card-face card-back" inert={!flipped} aria-hidden={!flipped}>
            <div className="tag-hole" aria-hidden="true" /><span className="mono">BEHIND THE EDIT / 0{index + 1}</span><h2>我负责的部分</h2><ul>{work.responsibilities.map(r => <li key={r}>{r}</li>)}</ul>
            {work.productionNote && <p className="back-note">{work.productionNote}</p>}
            <button id={`${id}-detail`} className="back-detail" onClick={() => open(false, `${id}-detail`)}>查看作品 <Arrow /></button>
            <button ref={backButton} className="back-return" onClick={() => flip(false)}>翻回正面 <span>↶</span></button>
          </div>
        </motion.div>
      </div>
    </motion.article>
  </motion.div>;
}
