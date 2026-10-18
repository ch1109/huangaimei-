import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { Arrow, Play } from './Icons';
import { works } from '../data/works';
import { Poster } from './Poster';
import { portfolioEase } from './motion-presets';
import type { OpenWork } from './HangingCard';

export function PersonalIntro({ onOpen }: { onOpen: OpenWork }) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLElement>(null);
  const work = works.find(item => item.id === 'W11')!;
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start start', 'end start'] });
  const imageProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: .5 });
  const imageY = useTransform(imageProgress, [0, 1], ['0%', '5%']);
  const enter = (delay: number) => ({ initial: reduced ? false as const : { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : .72, delay: reduced ? 0 : delay, ease: portfolioEase } });
  return <section ref={stage} className="edition-hero" id="selected" aria-label="开场作品：花舞瞬间" data-work-id={work.id}>
    <span id="intro" className="anchor-alias" />
    <div className="hero-composition page-width">
      <motion.div className="hero-visual" initial={reduced ? false : { opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : .95, ease: portfolioEase }}>
        <button id="hero-film" className="hero-film" aria-label="播放花舞瞬间" onClick={() => onOpen(work, true, 'hero-film')}>
          <motion.div className="hero-image" style={reduced ? undefined : { y: imageY }}><Poster work={work} eager variant="frame" /></motion.div>
          <span className="hero-image-shade" />
          <span className="hero-film-index mono">FEATURED FILM / {work.duration}</span>
          <span className="hero-play"><Play /><span className="mono">PLAY FILM</span></span>
          <span className="hero-film-caption"><strong>{work.title}</strong><span>{work.kind} <i>/</i> <span className="mono">{work.duration}</span></span></span>
          <span className="hero-film-arrow"><Arrow /></span>
        </button>
      </motion.div>
      <div className="hero-type">
        <motion.p className="hero-eyebrow mono" {...enter(.05)}><span />AIMEI HUANG — VIDEO PORTFOLIO 2026</motion.p>
        <h1>{['视频拍摄', '与剪辑。'].map((line, index) => <span className="hero-line" key={line}><motion.span initial={reduced ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: reduced ? 0 : .85, delay: reduced ? 0 : .12 + index * .12, ease: portfolioEase }}>{line}</motion.span></span>)}</h1>
        <motion.p className="hero-handwriting" {...enter(.24)}>Video shooting & editing.</motion.p>
        <motion.div className="hero-introduction" {...enter(.32)}><p>你好，我是黄爱美。<br />这里收录了我的工作作品和个人练习。</p><a href="#works" className="hero-explore">查看全部作品 <Arrow direction="down" /></a></motion.div>
      </div>
    </div>
    <div className="hero-bottom page-width"><a href="#works"><span className="scroll-tick" /><span className="mono">VIEW ALL WORKS</span></a><span className="hero-disciplines">拍摄 <i>/</i> 剪辑 <i>/</i> 视觉包装</span><span className="mono">{works.length} VIDEO WORKS</span></div>
  </section>;
}

