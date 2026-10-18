import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { type Category } from './data/works';
import { type OpenWork } from './components/HangingCard';
import { Arrow } from './components/Icons';
import { WorksSection } from './components/WorksSection';
import { PersonalIntro } from './components/PersonalIntro';
import { ScrollProgress } from './components/ScrollProgress';
import { revealInView } from './components/motion-presets';

const resume = '/resume/huang-aimei.pdf';
const email = '825019917@qq.com';
const chapters = [['works', '作品分类'], ['about', '关于我'], ['contact', '联系我']];

export function Home({ onOpen, category, setCategory }: { onOpen: OpenWork; category: Category; setCategory: (category: Category) => void; previewsPaused?: boolean }) {
  const [copied, setCopied] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [section, setSection] = useState('selected');
  const emailRef = useRef<HTMLAnchorElement>(null);
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
  useEffect(() => {
    if (copied !== 'copied') return;
    const timeout = window.setTimeout(() => setCopied('idle'), 2400);
    return () => window.clearTimeout(timeout);
  }, [copied]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setCopied('copied'); }
    catch {
      setCopied('failed');
      if (emailRef.current) {
        const range = document.createRange(); range.selectNodeContents(emailRef.current);
        const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range);
      }
    }
  };

  return <div className="edition">
    <a className="skip-link" href="#works">跳到作品</a>
    <div className="edition-header-shell">
      <header className="edition-header page-width">
        <a className="edition-brand" href="/#selected" aria-label="黄爱美，返回首页">aimei<span className="brand-period">.</span><span className="edition-brand-cn">黄爱美 / 视频拍摄与剪辑师</span></a>
        <nav aria-label="主导航">{chapters.map(([id, label], index) => <a href={`#${id}`} key={id} className={section === id ? 'is-current' : ''} aria-current={section === id ? 'location' : undefined}><span className="mono">0{index + 1}</span>{label}</a>)}</nav>
      </header>
      <ScrollProgress />
    </div>
    <main>
      <PersonalIntro onOpen={onOpen} />
      <WorksSection onOpen={onOpen} category={category} setCategory={setCategory} />
      <section className="edition-about" id="about">
        <div className="page-width">
          <div className="chapter-rule"><span className="mono">02 / ABOUT ME</span><span>关于我</span></div>
          <div className="about-editorial">
            <motion.div className="about-image" {...revealInView(reduced)}><img src="/profile/huang-aimei-portrait-960.webp" srcSet="/profile/huang-aimei-portrait-480.webp 480w, /profile/huang-aimei-portrait-960.webp 960w, /profile/huang-aimei-portrait-1440.webp 1440w" sizes="(max-width:639px) 70vw, (max-width:899px) 34vw, 425px" width="2160" height="3840" alt="黄爱美的个人照片" loading="lazy" decoding="async" /><span className="mono">AIMEI HUANG / 黄爱美</span></motion.div>
            <motion.div className="about-story" {...revealInView(reduced, .1)}>
              <span className="small-label">视频拍摄与剪辑师</span>
              <h2>你好，<br />我是<span>黄爱美。</span></h2>
              <p className="about-lead">我毕业于桂林电子科技大学室内设计专业，先后在艺梵和加保科技从事视频剪辑工作。</p>
              <p className="about-body">做过商业口播、模板视频、艺术短片和人物故事，也会在工作之外尝试文旅、广告和 AI 视频剪辑。</p>
              <div className="education-line"><span className="mono">2020 — 2024</span><div>桂林电子科技大学<small>艺术与设计学院 · 室内设计</small></div></div>
            </motion.div>
          </div>
          <div className="experience-editorial">
            <motion.div className="experience-label" {...revealInView(reduced)}><span className="mono">WORK EXPERIENCE</span><h3>工作经历</h3></motion.div>
            <div className="experience-list">
              <motion.article {...revealInView(reduced, .06)}><div className="experience-date mono">2025.07 — 2026.06</div><div><h4>加保科技深圳有限公司</h4><span className="experience-role">视频剪辑师</span><p>负责“加保视频工厂”的素材筛选、后期剪辑与画面包装，与文案、运营和技术团队协作迭代模板。</p></div><div className="experience-number"><strong>300<span>+</span></strong><small>知识科普视频与模板</small></div></motion.article>
              <motion.article {...revealInView(reduced, .12)}><div className="experience-date mono">2024.09 — 2025.06</div><div><h4>上海艺梵电子商务有限公司</h4><span className="experience-role">视频剪辑师</span><p>为“匠心之城”“艺非凡的礼物”制作人物故事、艺术赏析和生活趣味视频，负责剪辑、调色与音效。</p></div><div className="experience-number"><strong>90<span>+</span></strong><small>文化类混剪视频</small></div></motion.article>
            </div>
          </div>
          <motion.div className="toolkit-line" {...revealInView(reduced)}><span className="mono">TOOLS</span><p>Premiere <i>/</i> 剪映 <i>/</i> Photoshop <i>/</i> Illustrator</p><span>AI 辅助工具 · ChatGPT / Midjourney / 即梦 AI</span></motion.div>
        </div>
      </section>
      <section className="edition-contact" id="contact">
        <div className="page-width">
          <div className="chapter-rule"><span className="mono">03 / CONTACT</span><span><i className="status-light" />求职方向：视频拍摄与剪辑</span></div>
          <div className="contact-editorial">
            <motion.h2 {...revealInView(reduced)}>联系我，<br /><span>聊聊工作。</span></motion.h2>
            <motion.div className="contact-aside" {...revealInView(reduced, .1)}><span className="contact-star" aria-hidden="true">✳</span><p>如果有合适的拍摄、剪辑岗位，<br />欢迎通过邮箱联系我。</p><a className="resume-download" href={resume} download="黄爱美-视频拍摄与剪辑-简历.pdf">下载我的简历 <Arrow direction="down" /></a></motion.div>
          </div>
          <motion.div className="contact-email-row" {...revealInView(reduced)}><div><span className="mono">SAY HELLO</span><a ref={emailRef} href={`mailto:${email}`} className="edition-email">{email}<Arrow /></a></div><div className="copy-wrap"><button onClick={copy} className="edition-copy" aria-label="复制邮箱">{copied === 'copied' ? '已复制 ✓' : '复制邮箱'}<span aria-hidden="true">⧉</span></button><span role="status">{copied === 'failed' ? '请选择邮箱文字，手动复制。' : copied === 'copied' ? '邮箱已复制' : ''}</span></div></motion.div>
          <footer className="edition-footer"><span>© {new Date().getFullYear()} 黄爱美</span><span className="mono">VIDEO PORTFOLIO / AIMEI HUANG</span><a href="#selected">返回顶部 <Arrow direction="up-right" /></a></footer>
        </div>
      </section>
    </main>
  </div>;
}

