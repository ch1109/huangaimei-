import { useEffect, useRef, useState } from 'react';
import type { Work } from '../data/works';
import { Play } from './Icons';
import { Poster } from './Poster';

export function stopAllVideos() { document.querySelectorAll('video').forEach(video => video.pause()); }
export function VideoPlayer({ work, startPlaying = false }: { work: Work; startPlaying?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [requested, setRequested] = useState(startPlaying);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const play = () => { stopAllVideos(); setRequested(true); setLoading(true); setBlocked(false); };
  useEffect(() => {
    const current = video.current;
    if (requested && current && !error) { setLoading(true); current.play().catch(() => { setLoading(false); setBlocked(true); }); }
    return () => { current?.pause(); };
  }, [requested, retry, error]);
  const landscape = (work.width ?? 9) > (work.height ?? 16);
  return <div className={`player-shell ${landscape ? 'wide' : 'tall'}`}>
    {work.video && requested && !error ? <video key={retry} ref={video} src={work.video} poster={work.poster} controls playsInline preload="metadata" aria-label={`${work.title}视频`} onPlay={() => { document.querySelectorAll('video').forEach(v => { if (v !== video.current) v.pause(); }); setPlaying(true); setBlocked(false); }} onPause={() => setPlaying(false)} onWaiting={() => setLoading(true)} onCanPlay={() => setLoading(false)} onPlaying={() => setLoading(false)} onError={() => { setError(true); setLoading(false); }} /> : <div className="player-poster"><Poster work={work} eager variant="frame" /></div>}
    {work.video && !requested && !error && <button className="player-start" aria-label={`开始播放${work.shortTitle}`} onClick={play}><Play /><span>播放作品</span></button>}
    {loading && !error && <span role="status" className="player-status">视频加载中…</span>}
    {blocked && !playing && !error && <button className="player-start" onClick={() => { stopAllVideos(); video.current?.play().catch(() => setBlocked(true)); }}><Play /><span>点击播放</span></button>}
    {(error || !work.video) && <div className="player-error"><p>视频暂时无法播放</p>{work.video && <button onClick={() => { setError(false); setRetry(r => r + 1); setRequested(true); }}>重试</button>}</div>}
  </div>;
}
