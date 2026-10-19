import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { App } from './App';
import { filterWorks, displayWorks, works, featured, nextWork } from './data/works';
import { archiveWorks } from './components/WorksSection';
import { VideoPlayer } from './components/VideoPlayer';
import { portfolioCollections, portfolioProjects, individualIntroductions } from './data/collections';

beforeEach(() => vi.clearAllMocks());
const renderApp = (path = '/') => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);

describe('作品内容', () => {
  it('20 个稳定地址、正确分类和真实播放素材', () => {
    expect(works).toHaveLength(20);
    expect(new Set(works.map(w => w.slug)).size).toBe(20);
    expect(filterWorks('商业内容')).toHaveLength(10);
    expect(filterWorks('艺术与故事')).toHaveLength(6);
    expect(filterWorks('个人练习')).toHaveLength(4);
    expect(featured.map(w => w.id)).toEqual(['W11','W01','W15','W18']);
    expect(works.every(w => w.poster && w.video && w.responsibilities.length)).toBe(true);
  });
  it('下一件按来源分类循环', () => {
    expect(nextWork('nature-ai-study','个人练习').id).toBe('W17');
    expect(nextWork('flowers-in-motion','艺术与故事').id).toBe('W12');
    expect(displayWorks('商业内容')).toEqual(filterWorks('商业内容'));
  });
  it('四个飞书章节、六个项目模块完整覆盖20部作品', () => {
    expect(portfolioProjects).toHaveLength(4);
    expect(portfolioCollections).toHaveLength(6);
    const ids = portfolioCollections.flatMap(collection => [...collection.workIds]);
    expect(ids).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
    expect(new Set(ids)).toEqual(new Set(works.map(work => work.id)));
    expect(archiveWorks('全部')).toHaveLength(20);
    expect((['official', 'templates', 'yifan', 'practice'] as const).map(id => filterWorks(id).length)).toEqual([2, 8, 6, 4]);
    expect(nextWork('insurance-growth').id).toBe('W01');
    expect(nextWork('single-mother', 'general-templates').id).toBe('W09');
    expect(nextWork('car-visual-study', 'personal-practice').id).toBe('W19');
  });
});

describe('飞书分类与完整项目简介', () => {
  it('完整作品区20部作品各出现一次，保留原文章节与模块顺序', () => {
    renderApp();
    const ids = [...document.querySelectorAll('.project-chapters [data-work-id]')].map(el => el.getAttribute('data-work-id'));
    expect(ids).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
    expect(ids.slice(0, 4)).toEqual(['W01', 'W02', 'W03', 'W04']);
    expect(ids.slice(-4)).toEqual(['W17', 'W19', 'W18', 'W20']);
    expect(new Set(ids)).toEqual(new Set(works.map(work => work.id)));
    expect(document.querySelectorAll('.collection-module')).toHaveLength(6);
    expect(document.querySelector('.folder-showcase, .film-orbit')).toBeNull();
    expect(document.querySelector('video')).toBeNull();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });
  it('开场使用原片，作品区保留封面、完整标题、职责和四部个人练习简介', () => {
    renderApp();
    expect(document.querySelector<HTMLImageElement>('#hero-film img')?.getAttribute('src')).toBe('/home/W11-first-frame.webp');
    expect(document.querySelector<HTMLImageElement>('#hero-film-W15 img')?.getAttribute('src')).toBe('/home/W15-first-frame.webp');
    expect(document.querySelectorAll('.collection-films .designed-cover')).toHaveLength(20);
    expect(document.querySelectorAll('.collection-film .work-role')).toHaveLength(20);
    expect(document.querySelectorAll('.collection-film .practice-label')).toHaveLength(4);
    for (const introduction of Object.values(individualIntroductions)) expect(screen.getByText(introduction)).toBeTruthy();
    for (const collection of portfolioCollections) {
      const module = screen.getByRole('region', { name: collection.title });
      for (const paragraph of collection.introduction) expect(within(module).getByText(paragraph)).toBeTruthy();
      if (collection.note) expect(within(module).getByText(collection.note)).toBeTruthy();
    }
  });
  it('按原文四大章节筛选，保留对应项目简介及全部相关作品', () => {
    renderApp();
    const group = screen.getByRole('group', { name: '作品分类' });
    expect(within(group).getAllByRole('button').map(button => button.textContent)).toEqual(['全部作品', ...portfolioProjects.map(project => project.label)]);
    fireEvent.click(within(group).getByRole('button', { name: '保司定制与通用模板视频剪辑' }));
    expect(document.querySelectorAll('.collection-film')).toHaveLength(8);
    expect(document.querySelectorAll('.collection-module')).toHaveLength(2);
    expect(document.querySelector('#work-W03')).not.toBeNull();
    fireEvent.click(within(group).getByRole('button', { name: '个人创作练习' }));
    expect(document.querySelectorAll('.collection-film')).toHaveLength(4);
    expect(document.querySelector('#work-W18')).not.toBeNull();
    fireEvent.click(within(group).getByRole('button', { name: '全部作品' }));
    expect(document.querySelectorAll('.collection-film')).toHaveLength(20);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });
  it('页面所有内部锚点都有唯一目标', () => {
    renderApp();
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link => {
      expect(document.getElementById(link.hash.slice(1))).not.toBeNull();
    });
  });
});

describe('浏览与详情', () => {
  it('直接链接定位一次，后续同页锚点不被额外滚动打断', () => {
    function ChangeChapter() {
      const navigate = useNavigate();
      return <button onClick={() => navigate('/#about')}>切换章节</button>;
    }
    render(<MemoryRouter initialEntries={['/#works']}><App /><ChangeChapter /></MemoryRouter>);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant' });
    vi.mocked(Element.prototype.scrollIntoView).mockClear();
    fireEvent.click(screen.getByRole('button', { name: '切换章节' }));
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
  it('首屏先翻面再播放，关闭后恢复播放入口焦点', async () => {
    renderApp();
    const trigger = document.getElementById('hero-film')!;
    fireEvent.click(trigger);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    const play = within(screen.getByRole('region', { name: '精选视频作品' })).getByRole('button', { name: '播放花舞瞬间' });
    fireEvent.click(play);
    await waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalled());
    expect(screen.getByRole('dialog').textContent).toContain('花舞瞬间');
    fireEvent.click(screen.getByRole('button', { name: '关闭作品详情' }));
    await waitFor(() => expect(document.activeElement).toBe(play));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });
  it('精选作品的拆解集中在详情中，阅读入口不会自动播放', () => {
    renderApp();
    fireEvent.click(document.getElementById('work-W01-read')!);
    expect(screen.getByRole('region', { name: '为什么非要找你？成片拆解' })).toBeTruthy();
    expect(document.querySelector('video')).toBeNull();
    expect(document.querySelector('details.cover-packaging')?.hasAttribute('open')).toBe(false);
    expect(document.querySelector('.player-poster img')?.getAttribute('src')).toBe('/media/W01.webp');
  });
  it('开场按艺术模块继续播放，关闭后保留作品区分类', async () => {
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: '个人创作练习' }));
    fireEvent.click(document.getElementById('hero-film')!);
    fireEvent.click(screen.getByRole('button', { name: '播放花舞瞬间' }));
    expect(screen.getByRole('button', { name: /下一件作品/ }).textContent).toContain('神奇的蛋糕');
    fireEvent.click(screen.getByRole('button', { name: '关闭作品详情' }));
    await waitFor(() => expect(document.querySelector('dialog')).toBeNull());
    expect(document.querySelectorAll('.collection-film')).toHaveLength(4);
    expect(screen.getByRole('button', { name: '个人创作练习' }).getAttribute('aria-pressed')).toBe('true');
  });
  it('索引分类后开关详情保留分类及触发焦点', async () => {
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: '个人创作练习' }));
    const trigger = screen.getByRole('button', { name: '春日与蝴蝶' });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog').textContent).toContain('春日与蝴蝶');
    expect(document.querySelector('.player-shell video')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '关闭作品详情' }));
    await waitFor(() => expect(document.querySelector('dialog')).toBeNull());
    expect(screen.getByRole('button', { name: '个人创作练习' }).getAttribute('aria-pressed')).toBe('true');
    expect(document.querySelectorAll('.collection-film')).toHaveLength(4);
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
  it('播放、下一件与关闭正确停止旧视频', async () => {
    renderApp();
    fireEvent.click(document.getElementById('work-W15-read')!);
    fireEvent.click(screen.getByRole('button', { name: /开始播放/ }));
    await waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalled());
    expect(document.querySelectorAll('.player-shell video')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: /下一件作品/ }));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(document.querySelector('.player-shell video')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /开始播放/ }));
    await waitFor(() => expect(document.querySelector('.player-shell video')).not.toBeNull());
    vi.mocked(HTMLMediaElement.prototype.pause).mockClear();
    fireEvent.click(screen.getByRole('button', { name: '关闭作品详情' }));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });
  it('人物故事详情保留原始两处片段拆解', () => {
    renderApp('/works/marc-chagall');
    const breakdown = screen.getByRole('region', { name: '夏加尔成片拆解' });
    expect(within(breakdown).getByText('00:45')).toBeTruthy();
    expect(within(breakdown).getByText('01:30')).toBeTruthy();
    expect(breakdown.querySelectorAll('img')).toHaveLength(2);
  });
  it('非精选作品没有空案例或幕后占位', () => {
    renderApp('/works/insurance-growth');
    expect(screen.queryByText('成片拆解')).toBeNull();
  });
  it('直接访问详情可读，默认不自动播放', () => {
    renderApp('/works/marc-chagall');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('夏加尔：人物故事');
    expect(document.querySelector('dialog')).toBeNull();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });
  it('无效作品地址有返回入口', () => {
    renderApp('/works/unknown');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('没有找到这件作品');
    expect(screen.getAllByRole('button', { name: /返回作品/ }).length).toBe(2);
  });
});

describe('播放异常', () => {
  it('加载失败显示重试并可重新加载视频', async () => {
    render(<VideoPlayer work={works[0]} />);
    fireEvent.click(screen.getByRole('button', { name: /开始播放/ }));
    fireEvent.error(document.querySelector('video')!);
    expect(screen.getByText('视频暂时无法播放')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '重试' }));
    await waitFor(() => expect(document.querySelector('video')).not.toBeNull());
  });
  it('浏览器拒绝自动播放时保留手动入口', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('NotAllowedError'));
    render(<VideoPlayer work={works[0]} startPlaying />);
    await waitFor(() => expect(screen.getByRole('button', { name: '点击播放' })).toBeTruthy());
  });
});

describe('求职联系', () => {
  it('邮箱复制成功有明确反馈', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockResolvedValue(undefined) } });
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: '复制邮箱' }));
    await waitFor(() => expect(screen.getByText('邮箱已复制')).toBeTruthy());
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('825019917@qq.com');
  });
  it('复制受阻时支持手动选择，简历有唯一下载入口', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('blocked')) } });
    renderApp();
    fireEvent.click(screen.getByRole('button', { name: '复制邮箱' }));
    await waitFor(() => expect(screen.getByText('请选择邮箱文字，手动复制。')).toBeTruthy());
    expect(screen.getByRole('link', { name: '下载我的简历' }).getAttribute('href')).toBe('/resume/huang-aimei.pdf');
    expect(document.querySelectorAll('a[download]')).toHaveLength(1);
  });
});

