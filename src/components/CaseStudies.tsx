import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { caseWorks, type Work } from '../data/works';
import type { OpenWork } from './HangingCard';
import { Arrow, Play } from './Icons';

export function CaseBreakdown({ work }: { work: Work }) {
  if (!work.caseStudy) return null;
  return <section className="case-breakdown" aria-label={`${work.shortTitle}成片拆解`}>
    <div className="breakdown-heading"><h2>成片拆解</h2><p>{work.caseStudy.summary}</p></div>
    <div className="case-moments">{work.caseStudy.moments.map(moment => <figure key={moment.seconds}>
      <div className="moment-frame"><img src={moment.image} width="480" height="854" alt={moment.alt} loading="lazy" /><span className="mono">{moment.time}</span></div>
      <figcaption><h3>{moment.title}</h3><p>{moment.description}</p></figcaption>
    </figure>)}</div>
  </section>;
}
function CaseCard({ work, index, onOpen }: { work: Work; index: number; onOpen: OpenWork }) {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const study = work.caseStudy!;
  const moment = study.moments[selected];
  const image = <motion.img key={moment.image} className="case-current-frame" src={moment.image} alt={moment.alt} width="480" height="854" loading="lazy" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .24 }} />;
  return <article className={`featured-case case-${index + 1}`}>
    <div className="case-art"><span className="case-large-number mono" aria-hidden="true">0{index + 1}</span>
      <div className="case-visual" data-motion="07-case-slices">
        {reduced ? image : <AnimatePresence initial={false}>{image}</AnimatePresence>}
        <button id={`case-${work.id}`} className="case-play" onClick={() => onOpen(work, true, `case-${work.id}`)} aria-label={`播放精选案例${work.shortTitle}`}><Play /><span>播放完整作品</span></button>
        <span className="case-frame-time mono">FRAME / {moment.time}</span>
      </div>
      <span className="case-art-caption mono">{index === 0 ? 'CLARITY IN EVERY CUT.' : 'A STORY, FRAME BY FRAME.'}</span>
    </div>
    <div className="case-copy"><p className="case-focus"><span className="mono">CASE 0{index+1}</span> / {study.focus}</p><h3>{index === 0 ? '让信息，\n清楚地被看见。' : '让故事，\n在画面里发生。'}</h3><p className="case-work-name">{work.title} <span className="mono">{work.duration}</span></p><p className="case-summary">{study.summary}</p>
      <div className="case-roles"><span>本人负责</span><p>{work.responsibilities.join(' / ')}</p></div>
      <div className="case-tabs" role="group" aria-label={`${work.shortTitle}片段选择`}>{study.moments.map((item, i) => <button key={item.time} aria-pressed={i === selected} onClick={() => setSelected(i)} aria-controls={`case-note-${work.id}`}><span className="mono">{item.time}</span>{item.title}<Arrow direction="right" /></button>)}</div>
      <div id={`case-note-${work.id}`} className="case-note" aria-live="polite"><motion.p key={moment.time} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .24 }}>{moment.description}</motion.p></div>
      <button id={`case-read-${work.id}`} className="case-read text-button" onClick={() => onOpen(work, false, `case-read-${work.id}`)}>查看两处片段拆解 <Arrow direction="right" /></button>
    </div>
  </article>;
}
export function CaseStudies({ onOpen }: { onOpen: OpenWork }) {
  return <section id="cases" className="cases-section section-wrap">
    <div className="section-heading"><div><span className="section-index mono">01 / A CLOSER LOOK</span><h2>不止是成片，<br /><span>也看每一次组接。</span></h2></div><span className="section-note">两支作品，两个切入点。<br />从清晰的信息，到有情绪的叙事。</span></div>
    {caseWorks.map((work, index) => <CaseCard work={work} index={index} key={work.id} onOpen={onOpen} />)}
  </section>;
}
