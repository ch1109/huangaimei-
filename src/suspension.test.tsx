import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { PersonalIntro } from './components/PersonalIntro';

describe('首页悬挂作品卡', () => {
  it.each(['W01', 'W03', 'W11', 'W15'])('%s 的封面、标题和箭头均可翻面，返回后可以继续操作背面按钮', id => {
    const onOpen = vi.fn();
    const { container } = render(<PersonalIntro onOpen={onOpen} />);
    const card = container.querySelector<HTMLElement>(`[data-work-id="${id}"]`)!;
    const trigger = card.querySelector<HTMLButtonElement>('.suspended-front-trigger')!;
    const panel = card.querySelector<HTMLElement>('.suspended-back-panel')!;
    for (const area of ['.suspended-picture img', '.suspended-caption', '.suspended-round']) {
      fireEvent.click(trigger.querySelector(area)!);
      expect(trigger.hidden).toBe(true);
      expect(panel.hidden).toBe(false);
      fireEvent.click(within(card).getByRole('button', { name: /翻回.*封面/ }));
      expect(trigger.hidden).toBe(false);
      expect(panel.hidden).toBe(true);
      expect(document.activeElement).toBe(trigger);
    }
    fireEvent.click(trigger);
    fireEvent.click(within(card).getByRole('button', { name: '查看详情' }));
    expect(onOpen).toHaveBeenLastCalledWith(expect.objectContaining({ id }), false, `hero-detail-${id}`);
    fireEvent.click(within(card).getByRole('button', { name: /^播放/ }));
    expect(onOpen).toHaveBeenLastCalledWith(expect.objectContaining({ id }), true, `hero-play-${id}`);
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(trigger.hidden).toBe(false);
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('按实际挂点的亚像素位置连接，并在容器尺寸变化后重新测量', () => {
    let width = 1000.5;
    let viewportWidth = width;
    let scroll = 0;
    let points = [[83.375, 96.25], [365.125, 139.5], [619.625, 121.75], [918.875, 147.125]];
    let resize = () => {};
    const disconnect = vi.fn();
    const originalObserver = globalThis.ResizeObserver;
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) { resize = callback; }
      observe() {}
      disconnect = disconnect;
    });
    const bounds = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.classList.contains('suspension-stage')) return new DOMRect(121.3 - scroll, 90.6, width, 460.2);
      if (this.classList.contains('suspension-viewport')) return new DOMRect(121.3, 90.6, viewportWidth, 460.2);
      if (this.hasAttribute('data-suspension-anchor')) {
        const index = ['W01', 'W03', 'W11', 'W15'].indexOf(this.dataset.suspensionAnchor!);
        return new DOMRect(121.3 - scroll + points[index][0], 90.6 + points[index][1], 0, 0);
      }
      return new DOMRect();
    });
    const frame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { callback(0); return 1; });
    try {
      const { container, unmount } = render(<PersonalIntro onOpen={vi.fn()} />);
      const checkAttachments = () => {
        const lines = container.querySelectorAll('.suspension-drop');
        expect(lines).toHaveLength(4);
        lines.forEach((line, index) => {
          expect(Number(line.getAttribute('x2'))).toBeCloseTo(points[index][0], 6);
          // Half a pixel of overlap prevents an antialiasing seam at the card's top edge.
          expect(Number(line.getAttribute('y2'))).toBeCloseTo(points[index][1] + .5, 6);
        });
      };
      checkAttachments();
      width = 1234.75;
      points = [[157.125, 104.5], [451.75, 153.25], [743.375, 134.125], [1081.625, 162.75]];
      act(() => resize());
      checkAttachments();
      expect(container.querySelector('.suspension-rig')?.getAttribute('viewBox')).toBe('0 0 1234.75 460.2');
      viewportWidth = 280.125;
      scroll = 400.25;
      fireEvent.scroll(container.querySelector('.suspension-viewport')!);
      checkAttachments();
      const fade = container.querySelector('linearGradient')!;
      expect(Number(fade.getAttribute('x1'))).toBeCloseTo(scroll, 6);
      expect(Number(fade.getAttribute('x2'))).toBeCloseTo(scroll + viewportWidth, 6);
      unmount();
      expect(disconnect).toHaveBeenCalledOnce();
    } finally {
      bounds.mockRestore();
      frame.mockRestore();
      vi.stubGlobal('ResizeObserver', originalObserver);
    }
  });

  it('四张卡片独立翻面，键盘返回封面并恢复焦点', () => {
    const onOpen = vi.fn();
    render(<PersonalIntro onOpen={onOpen} />);
    const hero = screen.getByRole('region', { name: '精选视频作品' });
    expect(hero.querySelectorAll('article')).toHaveLength(4);
    const flower = within(hero).getByRole('button', { name: '翻看用相机捕捉花之舞：花舞瞬间的作品信息' });
    fireEvent.click(flower);
    expect(within(hero).getByRole('button', { name: '播放用相机捕捉花之舞：花舞瞬间' })).toBe(document.activeElement);
    expect(onOpen).not.toHaveBeenCalled();
    expect(within(hero).getByRole('button', { name: '翻看梦境色彩缔造者：夏加尔的超现实艺术世界的作品信息' })).toBeTruthy();
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(document.activeElement).toBe(flower);
    expect(flower.getAttribute('aria-expanded')).toBe('false');
  });

  it('触屏点击翻面、查看详情和返回都有可恢复焦点的入口', () => {
    const onOpen = vi.fn();
    render(<PersonalIntro onOpen={onOpen} />);
    fireEvent.click(screen.getByRole('button', { name: '翻看低利率＋老龄化夹击，泰盈人生2026为你筑牢人生防线的作品信息' }));
    fireEvent.click(screen.getByRole('button', { name: '查看详情' }));
    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: 'W03' }), false, 'hero-detail-W03');
    fireEvent.click(screen.getByRole('button', { name: '翻回低利率＋老龄化夹击，泰盈人生2026为你筑牢人生防线封面' }));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '翻看低利率＋老龄化夹击，泰盈人生2026为你筑牢人生防线的作品信息' }));
    expect(document.querySelector('video')).toBeNull();
  });
});
