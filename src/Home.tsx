import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { type Category } from './data/works';
import { type OpenWork } from './components/HangingCard';
import { Arrow } from './components/Icons';
import { WorksSection } from './components/WorksSection';
import { PersonalIntro } from './components/PersonalIntro';
import { ScrollProgress } from './components/ScrollProgress';
import { revealInView } from './components/motion-presets';
import { CinematicAtmosphere } from './components/CinematicAtmosphere';

const resume = '/resume/huang-aimei.pdf';
const email = '825019917@qq.com';
const phone = '18260955840';
const chapters = [['works', '作品'], ['about', '关于'], ['contact', '联系']];

function ContactMethod({ label, value, href }: { label: string; value: string; href: string }) {
  const [copied, setCopied] = useState<'idle' | 'copied' | 'failed'>('idle');
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (copied !== 'copied') return;
    const timeout = window.setTimeout(() => setCopied('idle'), 2400);
    return () => window.clearTimeout(timeout);
  }, [copied]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied('copied'); }
    catch {
      setCopied('failed');
      if (linkRef.current) {
        const range = document.createRange(); range.selectNodeContents(linkRef.current);
        const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range);
      }
    }
  };

  return <div className="about-contact-method">
    <div><span className="contact-method-label">{label}</span><a ref={linkRef} href={href} className="contact-method-value">{value}</a></div>
    <div className="contact-method-actions">
      <a href={href} className="contact-method-action">{label === '邮箱' ? '发送邮件' : '拨打电话'}<Arrow /></a>
      <button onClick={copy} className="contact-method-copy" aria-label={`复制${label}`}>
        {copied === 'copied' ? '已复制' : `复制${label}`}
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{copied === 'copied' ? <path d="m5 12 4 4L19 6" /> : <><rect x="4" y="8" width="12" height="12" rx="3" /><path d="M8 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" /></>}</svg>
      </button>
    </div>
    <span className="contact-method-status" role="status">{copied === 'failed' ? `请选择${label}文字，手动复制。` : copied === 'copied' ? `${label}已复制` : ''}</span>
  </div>;
}

export function Home({ onOpen, category, setCategory, previewsPaused = false }: { onOpen: OpenWork; category: Category; setCategory: (category: Category) => void; previewsPaused?: boolean }) {
  const [section, setSection] = useState('selected');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setSection(visible.target.id);
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('#selected, #works, #archive, #about, #contact').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <div className="edition">
    <CinematicAtmosphere paused={previewsPaused} />
    <a className="skip-link" href="#works">跳到作品</a>
    <div className={`edition-header-shell${section === 'selected' ? ' is-intro' : ''}`}>
      <header className="edition-header page-width">
        <a className="edition-brand" href="/#selected" aria-label="黄爱美，返回首页">aimei<span className="brand-period">.</span></a>
        <nav aria-label="主导航">{chapters.map(([id, label]) => <a href={`#${id}`} key={id} className={section === id ? 'is-current' : ''} aria-current={section === id ? 'location' : undefined}>{label}</a>)}</nav>
      </header>
      <ScrollProgress />
    </div>
    <main>
      <PersonalIntro onOpen={onOpen} />
      <WorksSection onOpen={onOpen} category={category} setCategory={setCategory} />
      <section className="edition-about" id="about">
        <div className="page-width">
          <div className="chapter-rule"><span className="mono">02 / ABOUT & CONTACT</span></div>
          <div className="about-editorial">
            <motion.div className="about-image" {...revealInView(reduced)}><img src="/profile/huang-aimei-tree-960.webp" srcSet="/profile/huang-aimei-tree-480.webp 480w, /profile/huang-aimei-tree-960.webp 960w, /profile/huang-aimei-tree-1200.webp 1200w" sizes="(max-width:639px) 70vw, (max-width:899px) 34vw, 425px" width="1200" height="1800" style={{ objectPosition: '50% 48%' }} alt="黄爱美穿白色上衣站在树影下" loading="lazy" decoding="async" /><span className="mono">AIMEI HUANG / 黄爱美</span></motion.div>
            <motion.div className="about-story" {...revealInView(reduced, .1)}>
              <h2>Hi，我是<span>黄爱美</span></h2>
              <p className="about-lead">我毕业于桂林电子科技大学室内设计专业，先后在艺梵和加保科技从事视频剪辑工作。</p>
              <p className="about-body">做过商业口播、模板视频、艺术短片和人物故事，也会在工作之外尝试文旅、广告和 AI 视频剪辑。</p>
              <div className="about-contact" id="contact" role="region" aria-label="联系方式">
                <p className="contact-kicker mono">CONTACT / 联系方式</p>
                <ContactMethod label="邮箱" value={email} href={`mailto:${email}`} />
                <ContactMethod label="手机号" value={phone} href={`tel:${phone}`} />
                <a className="resume-download" href={resume} download="黄爱美-视频拍摄与剪辑-简历.pdf">下载我的简历 <Arrow direction="down" /></a>
              </div>
            </motion.div>
          </div>
          <div className="experience-editorial">
            <motion.div className="experience-label" {...revealInView(reduced)}><span className="mono">WORK EXPERIENCE</span><h3>工作经历</h3></motion.div>
            <div className="experience-list">
              <motion.article {...revealInView(reduced, .06)}><div className="experience-date mono">2025.07 — 2026.06</div><div><h4>加保科技深圳有限公司</h4><span className="experience-role">视频剪辑师</span><p>负责“加保视频工厂”的素材筛选、后期剪辑与画面包装，与文案、运营和技术团队协作迭代模板。</p></div><div className="experience-number"><strong>300<span>+</span></strong><small>知识科普视频与模板</small></div></motion.article>
              <motion.article {...revealInView(reduced, .12)}><div className="experience-date mono">2024.09 — 2025.06</div><div><h4>上海艺梵电子商务有限公司</h4><span className="experience-role">视频剪辑师</span><p>为“匠心之城”“艺非凡的礼物”制作人物故事、艺术赏析和生活趣味视频，负责剪辑、调色与音效。</p></div><div className="experience-number"><strong>90<span>+</span></strong><small>文化类混剪视频</small></div></motion.article>
            </div>
          </div>
          <div className="about-details">
            <motion.div className="education-line" {...revealInView(reduced)}><span className="mono">EDUCATION / 教育背景</span><div><span className="education-date mono">2020 — 2024</span>桂林电子科技大学<small>艺术与设计学院 · 室内设计</small></div></motion.div>
            <motion.div className="toolkit-line" {...revealInView(reduced)}><span className="mono">TOOLS / 工具技能</span><p>Premiere <i>/</i> 剪映 <i>/</i> Photoshop <i>/</i> Illustrator</p><span>AI 辅助工具 · ChatGPT / Midjourney / 即梦 AI</span></motion.div>
          </div>
          <footer className="edition-footer"><span>© {new Date().getFullYear()} 黄爱美</span><span className="mono">VIDEO PORTFOLIO / AIMEI HUANG</span><a href="#selected">返回顶部 <Arrow direction="up-right" /></a></footer>
        </div>
      </section>
    </main>
  </div>;
}

