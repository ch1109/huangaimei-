import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { PersonalIntro } from './components/PersonalIntro';

describe('首页悬挂作品卡', () => {
  it('四张卡片独立翻面，键盘返回封面并恢复焦点', () => {
    const onOpen = vi.fn();
    render(<PersonalIntro onOpen={onOpen} />);
    const hero = screen.getByRole('region', { name: '精选视频作品' });
    expect(hero.querySelectorAll('article')).toHaveLength(4);
    const flower = within(hero).getByRole('button', { name: '翻看花舞瞬间的作品信息' });
    fireEvent.click(flower);
    expect(within(hero).getByRole('button', { name: '播放花舞瞬间' })).toBe(document.activeElement);
    expect(onOpen).not.toHaveBeenCalled();
    expect(within(hero).getByRole('button', { name: '翻看夏加尔的作品信息' })).toBeTruthy();
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(document.activeElement).toBe(flower);
    expect(flower.getAttribute('aria-expanded')).toBe('false');
  });

  it('触屏点击翻面、查看详情和返回都有可恢复焦点的入口', () => {
    const onOpen = vi.fn();
    render(<PersonalIntro onOpen={onOpen} />);
    fireEvent.click(screen.getByRole('button', { name: '翻看金堂十二时辰的作品信息' }));
    fireEvent.click(screen.getByRole('button', { name: '查看详情' }));
    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: 'W18' }), false, 'hero-detail-W18');
    fireEvent.click(screen.getByRole('button', { name: '翻回金堂十二时辰封面' }));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '翻看金堂十二时辰的作品信息' }));
    expect(document.querySelector('video')).toBeNull();
  });
});
