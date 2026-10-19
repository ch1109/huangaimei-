import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { featured, type Work } from '../data/works';
import { Arrow, Play } from './Icons';
import { Poster } from './Poster';
import { portfolioEase } from './motion-presets';
import type { OpenWork } from './HangingCard';
import '../suspension.css';

const openingFrames: Record<string, string> = {
  W11: '/home/W11-first-frame.webp',
  W15: '/home/W15-first-frame.webp',
};

function SuspendedFilm({ work, index, onOpen }: { work: Work; index: number; onOpen: OpenWork }) {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const front = useRef<HTMLButtonElement>(null);
  const play = useRef<HTMLButtonElement>(null);
  const interacted = useRef(false);
  const pitch = useSpring(0, { stiffness: 180, damping: 24 });
  const yaw = useSpring(0, { stiffness: 160, damping: 22 });
  const roll = useSpring(0, { stiffness: 140, damping: 18 });
  const sheenX = useTransform(yaw, [-4.5, 4.5], ['15%', '85%']);
  const sheenY = useTransform(pitch, [-2.5, 2.5], ['25%', '75%']);
  const frontId = index === 0 ? 'hero-film' : `hero-film-${work.id}`;
  const playId = `hero-play-${work.id}`;
  const pictureWork = openingFrames[work.id] ? { ...work, poster: openingFrames[work.id] } : work;
  const flip = (value: boolean) => { interacted.current = true; setFlipped(value); };
  useEffect(() => {
    if (interacted.current) (flipped ? play.current : front.current)?.focus({ preventScroll: true });
  }, [flipped]);

  return <motion.article className={`suspended-film suspended-film-${index}${flipped ? ' is-flipped' : ''}`} data-work-id={work.id}
    initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}
    transition={{ duration: reduced ? 0 : .6, delay: reduced ? 0 : index * .09, ease: portfolioEase }}
    onKeyDown={event => { if (event.key === 'Escape' && flipped) { event.stopPropagation(); flip(false); } }}>
    <motion.div className="suspended-motion" style={{ rotateX: pitch, rotateY: yaw, rotateZ: roll }}
      onPointerMove={event => {
        if (reduced || event.pointerType !== 'mouse') return;
        const box = event.currentTarget.getBoundingClientRect();
        const x = Math.max(-.5, Math.min(.5, (event.clientX - box.left) / box.width - .5));
        const y = Math.max(-.5, Math.min(.5, (event.clientY - box.top) / box.height - .5));
        pitch.set(-y * 5); yaw.set(x * 9); roll.set(x * 3);
      }}
      onPointerLeave={() => { pitch.set(0); yaw.set(0); roll.set(0); }}>
      <motion.div className="suspended-flipper" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: reduced ? 0 : .65, ease: portfolioEase }}>
        <button ref={front} id={frontId} className="suspended-face suspended-front" inert={flipped} aria-hidden={flipped}
          aria-label={`翻看${work.shortTitle}的作品信息`} aria-expanded={flipped} aria-controls={`hero-back-${work.id}`} onClick={() => flip(true)}>
          <span className="suspended-meta"><span>{work.kind}</span><span>{work.projectType === '个人练习' ? '个人练习' : '工作作品'}</span></span>
          <span className={`suspended-picture picture-${work.id}`}><Poster work={pictureWork} eager variant="frame" /></span>
          <span className="suspended-caption"><strong>{work.shortTitle}</strong><span>{work.organization ?? '个人练习'}</span></span>
          <span className="suspended-footer"><span>作品信息</span><span className="suspended-round"><Arrow /></span></span>
        </button>
        <motion.div id={`hero-back-${work.id}`} className="suspended-face suspended-back" inert={!flipped} aria-hidden={!flipped} style={{ backgroundPositionX: sheenX, backgroundPositionY: sheenY }}>
          <div className="suspended-back-heading"><Poster work={pictureWork} variant="frame" /><div><span>{work.kind}</span><h2>{work.shortTitle}</h2></div></div>
          <div className="suspended-responsibilities"><span>负责内容</span><ul>{work.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></div>
          <div className="suspended-actions">
            <button ref={play} id={playId} className="suspended-watch" aria-label={`播放${work.shortTitle}`} onClick={() => onOpen(work, true, playId)}><Play />播放作品</button>
          </div>
          <div className="suspended-back-footer">
            <button id={`hero-detail-${work.id}`} className="suspended-detail" onClick={() => onOpen(work, false, `hero-detail-${work.id}`)}>查看详情 <Arrow /></button>
            <button className="suspended-return" aria-label={`翻回${work.shortTitle}封面`} onClick={() => flip(false)}>返回封面 <Arrow direction="left" /></button>
          </div>
        </motion.div>
      </motion.div>
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
    <div className="suspension-viewport page-width"><div className="suspension-stage">
      <img className="suspension-rig" src="/home/suspension-rig.png" width="2172" height="724" alt="" aria-hidden="true" />
      {featured.map((work, index) => <SuspendedFilm key={work.id} work={work} index={index} onOpen={onOpen} />)}
    </div></div>
  </section>;
}

