import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Category, Work } from '../data/works';
import { nextWork } from '../data/works';
import { Arrow, Close } from './Icons';
import { VideoPlayer, stopAllVideos } from './VideoPlayer';
import { CaseBreakdown } from './CaseStudies';
import { Poster } from './Poster';
import { collectionForWork } from '../data/collections';
import { portfolioEase } from './motion-presets';

export function WorkDetail({ work, modal, autoplay, category, onClose, onNext }: { work?: Work; modal: boolean; autoplay: boolean; category: Category; onClose: () => void; onNext: (work: Work) => void }) {
  const dialog = useRef<HTMLDialogElement>(null); const close = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const [closing, setClosing] = useState(false);
  const dismissing = useRef(false);
  const next = work ? nextWork(work.slug, category) : undefined;
  const collection = work ? collectionForWork(work.id) : undefined;
  const productionNote = work?.projectId === 'templates' ? collection?.note : work?.productionNote;
  useLayoutEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    if (modal) { dialog.current?.showModal(); document.body.style.overflow = 'hidden'; close.current?.focus(); }
    else window.scrollTo(0, 0);
    return () => { stopAllVideos(); if (modal) { dialog.current?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); } };
  }, [modal]);
  useEffect(() => { const el = dialog.current?.querySelector('.detail-inner'); el?.scrollTo(0, 0); }, [work?.slug]);
  const dismiss = () => {
    stopAllVideos();
    if (dismissing.current) return;
    dismissing.current = true;
    if (reduced || !modal) onClose(); else setClosing(true);
  };
  const content = <motion.div className="detail-inner" data-motion="12-detail-transition" initial={reduced ? false : { opacity: 0, y: 14, scale: .99 }} animate={closing ? { opacity: 0, y: 8, scale: .995 } : { opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduced ? 0 : closing ? .18 : .32, ease: portfolioEase }} onAnimationComplete={() => { if (closing) onClose(); }} style={closing ? { pointerEvents: 'none' } : undefined}>
    <div className="detail-toolbar"><button onClick={dismiss} className="text-button"><Arrow direction="left" /> 返回作品</button>{modal && <button ref={close} className="close-button" aria-label="关闭作品详情" onClick={dismiss}><Close /></button>}</div>
    {work ? <>
      <header className="detail-heading"><span className="eyebrow">{collection?.title} <span>/</span> {work.projectType}</span><h1>{work.title}</h1><div className="detail-meta"><span>{work.kind}</span><span className="mono">{work.duration}</span>{work.organization && <span>{work.organization}</span>}</div></header>
      <VideoPlayer key={work.slug} work={work} startPlaying={autoplay} />
      {collection && <section className="detail-project-intro"><h2>作品介绍</h2><div>{(work.projectIntroduction ? [work.projectIntroduction] : collection.introduction).map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>}
      <section className="detail-responsibility"><h2>我负责的部分</h2><div>{work.responsibilities.map(r => <p key={r}>{r}</p>)}</div></section>
      {productionNote && <section className="production-note"><h2>制作说明</h2><p>{productionNote}</p></section>}
      <CaseBreakdown work={work} />
      {work.cover && <details className="cover-packaging"><summary>封面包装</summary><Poster work={work} variant="cover" /><p className="cover-credit">封面由 AI 辅助设计，播放器展示原始成片。</p></details>}
      {next && <div className="detail-bottom"><button className="next-work" onClick={() => { stopAllVideos(); onNext(next); }}><span><small>下一件作品</small>{next.shortTitle}</span><Arrow direction="right" /></button></div>}
    </> : <div className="not-found"><span className="mono">404 / WORK NOT FOUND</span><h1>没有找到这件作品</h1><button className="pill-button" onClick={dismiss}>返回作品 <Arrow /></button></div>}
  </motion.div>;
  return modal ? <dialog ref={dialog} className={`work-dialog${closing ? ' is-closing' : ''}`} aria-label={work ? `${work.title}作品详情` : '作品未找到'} onCancel={e => { e.preventDefault(); dismiss(); }} onClick={e => { if (e.target === e.currentTarget) dismiss(); }}>{content}</dialog> : <main className="detail-page">{content}</main>;
}
