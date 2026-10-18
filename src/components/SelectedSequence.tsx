import { motion, useReducedMotion } from 'motion/react';
import { works } from '../data/works';
import type { OpenWork } from './HangingCard';
import { Poster } from './Poster';
import { Arrow, Play } from './Icons';

const chapters = [
  { id: 'W01', number: '02', english: 'CLARITY', category: '商业口播 / 拍摄与剪辑', heading: <>先让信息，<br /><span>被清楚看见。</span></>, description: '从人物实拍到关键词字幕，让复杂的信息有清晰的层级，也让每一次画面切换，都服务于表达。', note: '清晰，是沟通的第一步。' },
  { id: 'W15', number: '03', english: 'STORY', category: '人物故事 / 素材剪辑', heading: <>再让故事，<br /><span>慢慢靠近。</span></>, description: '在绘画与人物影像之间寻找连接。用素材的选择、镜头的组接和音乐的起伏，把一段人生讲给你听。', note: '节奏，让素材成为故事。' },
];

export function SelectedSequence({ onOpen }: { onOpen: OpenWork }) {
  const reduced = useReducedMotion();
  const reveal = { initial: reduced ? false as const : { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .1 }, transition: { duration: .9, ease: [.22, 1, .36, 1] as const } };
  const travel = works.find(work => work.id === 'W18')!;
  return <section className="selected-sequence" id="works">
    <span id="cases" className="anchor-alias" />
    <div className="page-width">
      <div className="chapter-rule"><span className="mono">01 / SELECTED WORKS</span><span>由情绪入场，向更多表达展开</span></div>
      <motion.div className="sequence-intro" {...reveal}><h2>剪辑的答案，<br />藏在<span>不同的画面里。</span></h2><div><span className="serif-note">A sense of rhythm.<br />A way of seeing.</span><p>商业内容、人物故事、个人探索。<br />题材在变，对画面的认真始终如一。</p></div></motion.div>
      <div className="sequence-films">{chapters.map(chapter => {
        const work = works.find(item => item.id === chapter.id)!;
        const trigger = `selected-${work.id}`;
        return <motion.article key={work.id} className={`sequence-film sequence-${work.id}`} data-work-id={work.id} {...reveal}>
          <div className="sequence-art">
            <div className="sequence-art-top mono"><span>FILM {chapter.number.padStart(3, '0')}</span><span>{work.duration}</span></div>
            <button id={trigger} className="sequence-frame" aria-label={`播放${work.title}`} onClick={() => onOpen(work, true, trigger)}><Poster work={work} variant="frame" /><span className="sequence-play"><Play /><span>播放成片</span></span></button>
            <div className="sequence-art-bottom"><span className="mono">{chapter.english}</span><span>{chapter.note}</span></div>
          </div>
          <div className="sequence-copy"><span className="sequence-label"><span className="mono">{chapter.number} /</span>{chapter.category}</span><h3>{chapter.heading}</h3><p className="sequence-description">{chapter.description}</p><div className="sequence-work-info"><h4>{work.title}</h4><p>{work.responsibilities.join(' · ')}</p></div><button className="sequence-link" id={`${trigger}-read`} onClick={() => onOpen(work, false, `${trigger}-read`)}>进入作品与拆解 <Arrow /></button></div>
        </motion.article>;
      })}</div>
      <motion.article className="sequence-travel" data-work-id={travel.id} {...reveal}>
        <div className="travel-heading"><span className="sequence-label"><span className="mono">04 /</span>个人探索 / 文旅练习</span><h3>把好奇心，<span>留给远方。</span></h3><span className="serif-note">Beyond the everyday.</span></div>
        <button id="selected-W18" className="travel-frame" aria-label={`播放${travel.title}`} onClick={() => onOpen(travel, true, 'selected-W18')}><Poster work={travel} variant="frame" /><span className="travel-shade" /><span className="travel-play"><Play /><span className="mono">PLAY FILM</span></span><span className="travel-caption"><strong>{travel.title}</strong><span>个人文旅作品 <i>/</i> <span className="mono">{travel.duration}</span></span></span><span className="travel-frame-number mono">FILM 004</span><span className="travel-arrow"><Arrow /></span></button>
        <div className="travel-footnote"><p>从熟悉的日常出发，记录一座城市的时间与气息。</p><span>个人练习</span></div>
      </motion.article>
      <div className="sequence-outro"><span className="mono">KEEP EXPLORING</span><p>以上是四种表达，<br /><span>下面还有更多。</span></p><a href="#archive" aria-label="继续浏览其余作品"><Arrow direction="down" /></a></div>
    </div>
  </section>;
}

