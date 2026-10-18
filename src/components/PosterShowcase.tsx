import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { filterWorks, works, type Category } from '../data/works';
import { Arrow } from './Icons';
import { Poster } from './Poster';

const collections = [
  { category: '商业内容', id: 'W01', label: 'COMMERCIAL', color: 'commercial' },
  { category: '艺术与故事', id: 'W11', label: 'ART & STORIES', color: 'art' },
  { category: '个人练习', id: 'W18', label: 'EXPLORATIONS', color: 'practice' },
] as const;

export function PosterShowcase({ onSelect, category }: { onSelect: (category: Category) => void; category: Category }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(() => !!reduced || window.matchMedia('(max-width: 639px)').matches);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 639px)').matches);
  const pinned = useRef(true);
  const toggle = useRef<HTMLButtonElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 150, damping: 20, mass: .85 };
  const close = () => { pinned.current = false; setOpen(false); };
  useEffect(() => {
    if (compact || reduced || !scene.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setOpen(true); observer.disconnect(); }
    }, { threshold: .35 });
    observer.observe(scene.current);
    return () => observer.disconnect();
  }, [compact, reduced]);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)');
    const update = () => setCompact(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return <section className="folder-showcase" aria-label="作品分类快捷入口">
    <div className="folder-heading"><span className="mono">COLLECTED WITH CURIOSITY</span><h3>每一类，<br />都有不同的表达。</h3><p>把不同的画面，收进同一个文件夹。<br />选一张卡片，打开一类作品。</p><button className="folder-view-all" onClick={() => onSelect('全部')}>浏览全部作品 <Arrow direction="right" /></button></div>
    <div ref={scene} className={`folder-scene${open ? ' is-open' : ''}`} data-motion="08-folder-open" onPointerEnter={event => { if (event.pointerType === 'mouse') setOpen(true); }} onPointerLeave={event => { if (event.pointerType === 'mouse' && !pinned.current && !event.currentTarget.contains(document.activeElement)) setOpen(false); }} onFocusCapture={event => { if ((event.target as Element) !== toggle.current) setOpen(true); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget) && !pinned.current) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); toggle.current?.focus(); close(); } }}>
      <span className="folder-watermark" aria-hidden="true">Portfolio</span>
      <div id="folder-collections" className="folder-collections" role="group" aria-label="作品文件夹分类">
        {collections.map((item, index) => {
          const work = works.find(work => work.id === item.id)!;
          const side = index - 1;
          const selected = category === item.category;
          return <motion.button key={item.category} className={`folder-card folder-card-${item.color}`} initial={false} data-motion="09-folder-selection"
            animate={{ x: open ? `${side * (compact ? 82 : 100)}%` : `${side * 34}%`, y: open ? `${(side ? 18 : 0) - (selected ? 12 : 0)}%` : (side ? '53%' : '45%'), rotate: side * (open ? (compact ? 14 : 16) : 12), scale: open ? (category !== '全部' && !selected ? .95 : 1) : .9 }} transition={spring}
            onClick={() => onSelect(item.category)} aria-pressed={category === item.category} aria-label={`筛选${item.category}，${filterWorks(item.category).length}部作品`}>
            <Poster work={work} variant="cover" />
            <span className="folder-category-tag">{item.category}<small className="mono">{String(filterWorks(item.category).length).padStart(2, '0')}</small></span>
            <span className="folder-card-caption"><span className="mono">{item.label}</span><Arrow /></span>
          </motion.button>;
        })}
      </div>
      <motion.button ref={toggle} className="folder-front" initial={false} animate={{ y: open ? 12 : 0, rotate: open ? -2 : 0 }} transition={spring}
        aria-label={open ? '收起作品文件夹' : '展开作品文件夹'} aria-expanded={open} aria-controls="folder-collections"
        onClick={() => { pinned.current = !open; setOpen(!open); }}>
        <img src="/showcase/folder-front.png" width="1561" height="1008" loading="lazy" alt="" />
        <span className="folder-open-arrow"><Arrow direction={open ? 'down' : 'right'} /></span>
      </motion.button>
    </div>
    <div className="folder-footer"><p aria-live="polite">{open ? '选择卡片筛选作品' : '点击文件夹，展开分类'}</p><span className="mono">3 个分类 · {works.length} 部作品</span></div>
  </section>;
}
