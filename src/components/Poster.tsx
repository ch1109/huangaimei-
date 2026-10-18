import { useState } from 'react';
import type { Work } from '../data/works';
export function Poster({ work, eager = false, variant = 'cover' }: { work: Work; eager?: boolean; variant?: 'cover' | 'frame' }) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const cover = variant === 'cover' && work.cover && !failedSources.includes(work.cover) ? work.cover : undefined;
  const source = cover ?? work.poster;
  return source && !failedSources.includes(source) ? <img src={source} width={cover ? 1440 : work.width} height={cover ? 960 : work.height} className={cover ? 'designed-cover' : undefined} alt={`${work.title}作品${cover ? '封面' : '画面'}`} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager && work.id === 'W11' ? 'high' : undefined} onError={() => setFailedSources(previous => [...previous, source])} /> : <div className="poster-fallback"><span>{work.kind}</span><span>{work.shortTitle}</span></div>;
}
