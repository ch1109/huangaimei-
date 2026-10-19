import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { featured, type Work } from '../data/works';
import { Arrow, Play } from './Icons';
import { Poster } from './Poster';
import { SuspensionRig } from './SuspensionRig';
import { portfolioEase } from './motion-presets';
import type { OpenWork } from './HangingCard';
import '../suspension.css';

const homePosters: Record<string, Pick<Work, 'poster' | 'width' | 'height'>> = {
  W01: { poster: '/home/W01-selected-cover.webp', width: 1254, height: 1254 },
  W03: { poster: '/home/W03-selected-cover.webp', width: 1024, height: 1024 },
  W11: { poster: '/home/W11-first-frame.webp' },
  W15: { poster: '/home/W15-first-frame.webp' },
};

function SuspendedFilm({ work, index, onOpen }: { work: Work; index: number; onOpen: OpenWork }) {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [turnPhase, setTurnPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const destination = useRef(false);
  const front = useRef<HTMLButtonElement>(null);
  const play = useRef<HTMLButtonElement>(null);
  const interacted = useRef(false);
  const restYaw = reduced ? 0 : [-6, 5, -4, 6][index];
  const restRoll = reduced ? 0 : [-1.4, 1.2, -1, 1.5][index];
  const pitch = useSpring(0, { stiffness: 110, damping: 14, mass: .8 });
  const yaw = useSpring(restYaw, { stiffness: 95, damping: 13, mass: .9 });
  const roll = useSpring(restRoll, { stiffness: 85, damping: 11, mass: 1 });
  const sheenX = useTransform(yaw, [-20, 20], ['20%', '80%']);
  const sheenY = useTransform(pitch, [-12, 12], ['25%', '75%']);
  const surfaceStyle = { rotateX: pitch, rotateY: yaw, rotateZ: roll, '--sheen-x': sheenX, '--sheen-y': sheenY };
  const frontId = index === 0 ? 'hero-film' : `hero-film-${work.id}`;
  const playId = `hero-play-${work.id}`;
  const pictureWork = { ...work, ...homePosters[work.id] };
  const rest = () => { pitch.set(0); yaw.set(restYaw); roll.set(restRoll); };
  useEffect(rest, [reduced]);
  const flip = (value: boolean) => {
    if (turnPhase !== 'idle' || value === flipped) return;
    interacted.current = true;
    destination.current = value;
    rest();
    if (reduced) setFlipped(value);
    else setTurnPhase('out');
  };
  const finishTurn = (back: boolean) => {
    if (back !== flipped) return;
    if (turnPhase === 'out') { setFlipped(destination.current); setTurnPhase('in'); }
    else if (turnPhase === 'in') setTurnPhase('idle');
  };
  const followPointer = (event: PointerEvent<HTMLElement>) => {
    if (reduced || turnPhase !== 'idle' || event.pointerType !== 'mouse') return;
    // Measure the stable article, not the tilting surface, to avoid feedback near its edges.
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-.5, Math.min(.5, (event.clientX - box.left) / box.width - .5));
    const y = Math.max(-.5, Math.min(.5, (event.clientY - box.top) / box.height - .5));
    pitch.set(-y * 16); yaw.set(restYaw + x * 28); roll.set(restRoll + x * 5);
  };
  useEffect(() => {
    if (interacted.current && turnPhase === 'idle') (flipped ? play.current : front.current)?.focus({ preventScroll: true });
  }, [flipped, turnPhase]);

  const turningOut = turnPhase === 'out';
  const turnTransition = {
    duration: reduced ? 0 : turningOut ? .26 : .58,
    ease: portfolioEase,
    ...(turnPhase === 'in' && !reduced ? { times: [0, .65, .84, 1] } : {}),
  };
  const frontTurn = flipped || turningOut ? -90 : turnPhase === 'in' && !reduced ? [-90, 7, -2, 0] : 0;
  const backTurn = !flipped || turningOut ? 90 : turnPhase === 'in' && !reduced ? [90, -7, 2, 0] : 0;

  return <motion.article className={`suspended-film suspended-film-${index}${flipped ? ' is-flipped' : ''}`} data-work-id={work.id}
    data-turn-phase={turnPhase} aria-busy={turnPhase !== 'idle'}
    initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}
    transition={{ duration: reduced ? 0 : .8, delay: reduced ? 0 : .24 + index * .11, ease: portfolioEase }}
    onPointerEnter={followPointer} onPointerMove={followPointer}
    onPointerLeave={rest}
    onKeyDown={event => { if (event.key === 'Escape' && flipped) { event.stopPropagation(); flip(false); } }}>
    <span className="suspension-anchor" data-suspension-anchor={work.id} aria-hidden="true" />
    <motion.button ref={front} id={frontId} type="button" className="suspended-flipper suspended-front-trigger"
      hidden={flipped} inert={flipped} aria-hidden={flipped} disabled={turnPhase !== 'idle'}
      aria-label={`翻看${work.title}的作品信息`} aria-expanded={turnPhase === 'out' ? destination.current : flipped}
      aria-controls={`hero-back-${work.id}`} onClick={() => flip(true)} initial={false}
      animate={{ rotateY: frontTurn }} transition={turnTransition} onAnimationComplete={() => finishTurn(false)}>
      <div className="suspended-drift" aria-hidden="true"><motion.div className="suspended-motion" style={surfaceStyle}>
        <div className="suspended-face suspended-front">
          <span className="suspended-meta"><span>{work.kind}</span><span>{work.projectType === '个人练习' ? '个人练习' : '工作作品'}</span></span>
          <span className={`suspended-picture picture-${work.id}`}><Poster work={pictureWork} eager variant="frame" /></span>
          <span className="suspended-caption" style={{ '--title-length': Array.from(work.title).length } as CSSProperties}><strong>{work.title}</strong><span>{work.organization ?? '个人练习'}</span></span>
          <span className="suspended-footer"><span>作品信息</span><span className="suspended-round"><Arrow /></span></span>
        </div>
      </motion.div></div>
    </motion.button>
    <motion.div className="suspended-flipper suspended-back-panel" hidden={!flipped} inert={!flipped || turnPhase !== 'idle'} aria-hidden={!flipped}
      initial={false} animate={{ rotateY: backTurn }} transition={turnTransition} onAnimationComplete={() => finishTurn(true)}>
      <div className="suspended-drift"><motion.div className="suspended-motion" style={surfaceStyle}>
        <div id={`hero-back-${work.id}`} className="suspended-face suspended-back">
          <div className="suspended-back-heading"><Poster work={pictureWork} variant="frame" /><div><span>{work.kind}</span><h2>{work.title}</h2></div></div>
          <div className="suspended-responsibilities"><span>负责内容</span><ul>{work.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></div>
          <div className="suspended-actions" aria-hidden="true">
            <span className="suspended-watch suspended-watch-art"><Play />播放作品</span>
          </div>
          <div className="suspended-back-footer" aria-hidden="true">
            <span className="suspended-detail">查看详情 <Arrow /></span>
            <span className="suspended-return">返回封面 <Arrow direction="left" /></span>
          </div>
        </div>
      </motion.div></div>
      {/* Keep native controls on a stable plane while the visible badge follows the pointer. */}
      <div className="suspended-back-hitplane">
        <div className="suspended-actions"><button ref={play} id={playId} className="suspended-watch" disabled={turnPhase !== 'idle'} aria-label={`播放${work.title}`} onClick={() => onOpen(work, true, playId)}><Play />播放作品</button></div>
        <div className="suspended-back-footer">
          <button id={`hero-detail-${work.id}`} className="suspended-detail" disabled={turnPhase !== 'idle'} onClick={() => onOpen(work, false, `hero-detail-${work.id}`)}>查看详情 <Arrow /></button>
          <button className="suspended-return" disabled={turnPhase !== 'idle'} aria-label={`翻回${work.title}封面`} onClick={() => flip(false)}>返回封面 <Arrow direction="left" /></button>
        </div>
      </div>
    </motion.div>
  </motion.article>;
}

export function PersonalIntro({ onOpen }: { onOpen: OpenWork }) {
  return <section className="suspension-hero" id="selected" aria-label="精选视频作品">
    <span id="intro" className="anchor-alias" />
    <div className="suspension-heading page-width">
      <div><p>黄爱美 / 视频作品集</p><h1>视频拍摄<br /><span>与剪辑。</span></h1></div>
      <a href="#works">查看全部作品 <Arrow direction="right" /></a>
    </div>
    <div className="suspension-viewport page-width"><SuspensionRig>
      {featured.map((work, index) => <SuspendedFilm key={work.id} work={work} index={index} onOpen={onOpen} />)}
    </SuspensionRig></div>
  </section>;
}

