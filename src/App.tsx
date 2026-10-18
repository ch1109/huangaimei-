import { useLayoutEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation, useNavigate, useNavigationType, type Location } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { Home } from './Home';
import { WorkDetail } from './components/WorkDetail';
import { works, type Category, type Work } from './data/works';
import { stopAllVideos } from './components/VideoPlayer';

interface DetailState { background?: Location; autoplay?: boolean; category?: Category; triggerId?: string; scrollY?: number }
export function App() {
  const location = useLocation(); const navigate = useNavigate();
  const navigationType = useNavigationType();
  const state = location.state as DetailState | null;
  const [category,setCategory] = useState<Category>('全部');
  const modal = !!state?.background && location.pathname.startsWith('/works/');
  const slug = location.pathname.split('/')[2];
  const current = works.find(w => w.slug === slug);
  const restore = useRef<{triggerId?: string; scrollY?: number} | null>(null);
  const previousPath = useRef<string | null>(null);
  const open = (work: Work, play: boolean, triggerId: string) => {
    stopAllVideos(); restore.current = { triggerId, scrollY: window.scrollY };
    const detailCategory = work.collectionId;
    navigate(`/works/${work.slug}`, { state: { background: location, autoplay: play, category: detailCategory, triggerId, scrollY: window.scrollY } satisfies DetailState });
  };
  const close = () => {
    stopAllVideos();
    if (modal) { restore.current = { triggerId: state?.triggerId, scrollY: state?.scrollY }; navigate(-1); }
    else navigate('/#works');
  };
  useLayoutEffect(() => {
    let scrollFrame: number | undefined;
    const resolveInitialFragment = previousPath.current === null || previousPath.current !== '/';
    previousPath.current = location.pathname;
    document.title = location.pathname === '/' ? '黄爱美｜视频拍摄与剪辑作品集' : current ? `${current.title}｜黄爱美作品集` : '没有找到这件作品｜黄爱美';
    const description = location.pathname === '/' ? '黄爱美的视频拍摄与剪辑作品集，收录商业口播、模板视频、艺术短片、人物故事和个人练习。' : current ? `${current.title}。我负责：${current.responsibilities.join('、')}。` : '没有找到这件作品。';
    document.querySelector('meta[name="description"]')?.setAttribute('content',description);
    if (location.pathname === '/' && restore.current) {
      const target = restore.current;
      scrollFrame = requestAnimationFrame(() => { restore.current = null; window.scrollTo({ top: target.scrollY ?? 0, behavior: 'instant' }); document.getElementById(target.triggerId ?? '')?.focus({ preventScroll: true }); });
    } else if (location.pathname === '/' && location.hash && !modal && resolveInitialFragment) {
      // Native anchors own same-page scrolling. Resolve a fragment only when the
      // homepage first mounts, so a second scroll cannot interrupt that motion.
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    }
    return () => { if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame); };
  }, [location, current, modal]);
  // A forward navigation restores the work but never replays the old click intent.
  const autoplay = !!state?.autoplay && navigationType === 'PUSH';
  const next = (work: Work) => navigate(`/works/${work.slug}`, { replace: true, state: modal ? { ...state, autoplay: false } : null });
  return <MotionConfig reducedMotion="user"><Routes location={modal ? state!.background : location}><Route path="/" element={<Home onOpen={open} category={category} setCategory={setCategory} previewsPaused={modal} />} /><Route path="/works/:slug" element={<WorkDetail work={current} modal={false} autoplay={false} category="全部" onClose={close} onNext={next} />} /><Route path="*" element={<WorkDetail modal={false} autoplay={false} category="全部" onClose={close} onNext={next} />} /></Routes>{modal && <WorkDetail work={current} modal autoplay={autoplay} category={state?.category ?? '全部'} onClose={close} onNext={next} />}</MotionConfig>;
}
