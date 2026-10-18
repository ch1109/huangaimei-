import type { ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { filterWorks, works, type Category } from '../data/works';
import { portfolioProjects, portfolioCollections } from '../data/collections';
import type { OpenWork } from './HangingCard';
import { Play, Arrow } from './Icons';
import { Poster } from './Poster';
import { portfolioEase, revealInView } from './motion-presets';

const workMetrics = [
  { value: '300+', label: '知识科普视频模板' },
  { value: '3万+', label: '模板视频累计跟拍' },
  { value: '90+', label: '艺术类混剪视频' },
  { value: '10条', label: '点赞或转发过万的作品' },
] as const;

export function archiveWorks(category: Category) { return filterWorks(category); }

export function WorksSection({ onOpen, category, setCategory }: { onOpen: OpenWork; category: Category; setCategory: (category: Category) => void }) {
  const reduced = useReducedMotion();
  const list = filterWorks(category);
  const visibleIds = new Set(list.map(work => work.id));
  const activeFilter = (value: Category) => category === value && <motion.span className="filter-active" aria-hidden="true" layoutId={reduced ? undefined : 'active-category'} transition={{ type: 'spring', stiffness: 420, damping: 36, mass: .6 }} />;
  return <section id="works" className="portfolio-library" aria-label="视频作品">
    <span id="archive" className="anchor-alias" /><span id="cases" className="anchor-alias" />
    <div className="page-width">
      <motion.dl className="library-metrics" aria-label="工作数据" {...revealInView(reduced, .06)}>
        {workMetrics.map(metric => <div className="library-metric" key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}
      </motion.dl>
      <LayoutGroup id="portfolio-categories"><div className="collection-filter" role="group" aria-label="作品分类">
        <button aria-pressed={category === '全部'} onClick={() => setCategory('全部')}><span className="filter-label">{activeFilter('全部')}全部作品</span></button>
        {portfolioProjects.map(project => <button key={project.id} aria-pressed={category === project.id} onClick={() => setCategory(project.id)}><span className="filter-label">{activeFilter(project.id)}{project.label}</span></button>)}
      </div></LayoutGroup>
      <ChapterTransition category={category} reduced={reduced}>{portfolioProjects.map(project => {
        const collections = portfolioCollections.filter(collection => collection.projectId === project.id && collection.workIds.some(id => visibleIds.has(id)));
        if (!collections.length) return null;
        return <section key={project.id} className={`project-chapter project-${project.id}`} aria-labelledby={`project-${project.id}-title`}>
          <motion.header className="project-heading" {...revealInView(reduced)}><span className="project-number serif-note">{project.number}</span><div><span className="mono">{project.english}</span><h3 id={`project-${project.id}-title`}>{project.title}</h3><p>{project.subtitle}</p></div><span className="project-count mono">{String(collections.reduce((count, collection) => count + collection.workIds.filter(id => visibleIds.has(id)).length, 0)).padStart(2, '0')} FILMS</span></motion.header>
          {collections.map(collection => <section className="collection-module" key={collection.id} aria-labelledby={`collection-${collection.id}-title`}>
            <motion.div className="collection-intro" {...revealInView(reduced, .04, 16)}><span className="collection-english mono">{collection.english}</span><h4 id={`collection-${collection.id}-title`}>{collection.title}</h4><div className="project-introduction"><span className="collection-label">项目简介</span>{collection.introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><div className="collection-responsibility"><span className="collection-label">{project.id === 'practice' ? '练习方向' : '我负责的部分'}</span><ul>{collection.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></div>{collection.note && <p className="collection-note">{collection.note}</p>}</motion.div>
            <div className="collection-films">{collection.workIds.filter(id => visibleIds.has(id)).map((id, index) => {
              const work = works.find(item => item.id === id)!;
              const trigger = `work-${work.id}`;
              return <motion.article className="collection-film" data-work-id={work.id} key={work.id} {...revealInView(reduced, .10 + (index % 2) * .08, 24)}>
                <button id={trigger} className="collection-poster" aria-label={`播放${work.title}`} onClick={() => onOpen(work, true, trigger)}><Poster work={work} variant="cover" /><span className="collection-play"><Play /><span>观看成片</span></span><span className="collection-duration mono">{work.duration}</span></button>
                <div className="collection-film-meta"><span>{work.kind}{work.projectId === 'practice' && <span className="practice-label"> · 个人练习{['W17', 'W20'].includes(work.id) ? ' / 非品牌委托' : ''}</span>}</span><span className="mono">{work.id}</span></div>
                <h5><button id={`${trigger}-title`} onClick={() => onOpen(work, false, `${trigger}-title`)}>{work.title}<Arrow /></button></h5>
                {work.projectIntroduction && <p className="film-introduction">{work.projectIntroduction}</p>}
                <p className="work-role">{work.responsibilities.join(' / ')}</p>
                <button id={`${trigger}-read`} className="collection-read" onClick={() => onOpen(work, false, `${trigger}-read`)}>作品详情 <Arrow /></button>
              </motion.article>;
            })}</div>
          </section>)}
        </section>;
      })}</ChapterTransition>
    </div>
  </section>;
}

function ChapterTransition({ category, reduced, children }: { category: Category; reduced: boolean | null; children: ReactNode }) {
  if (reduced) return <div className="project-chapters">{children}</div>;
  return <AnimatePresence initial={false} mode="wait"><motion.div className="project-chapters" key={category}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    transition={{ duration: .18, ease: portfolioEase }}>{children}</motion.div></AnimatePresence>;
}

