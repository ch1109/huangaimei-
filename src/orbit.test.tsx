import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FilmOrbit } from './components/FilmOrbit';

const mount = () => {
  const onOpen = vi.fn();
  render(<MemoryRouter><FilmOrbit onOpen={onOpen} /></MemoryRouter>);
  return onOpen;
};
describe('影像转盘', () => {
  it('按钮和键盘使用同一选择状态，首尾循环，不在选片时打开详情', () => {
    const onOpen = mount();
    const carousel = screen.getByRole('group', { name: '拖动或使用左右方向键选择作品' });
    fireEvent.click(screen.getByRole('button', { name: '转盘上一部作品' }));
    expect(screen.getByRole('button', { name: '转盘切换至金堂十二时辰' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: '转盘切换至花舞瞬间' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.keyDown(carousel, { key: 'End' });
    fireEvent.click(screen.getByRole('button', { name: '转盘下一部作品' }));
    expect(within(carousel).getByRole('button', { name: '播放转盘作品：花舞瞬间' })).toBeTruthy();
    expect(onOpen).not.toHaveBeenCalled();
    expect(document.querySelector('video')).toBeNull();
  });
  it('侧面作品先停靠，再点击同一作品播放，并提供可恢复焦点的入口', () => {
    const onOpen = mount();
    fireEvent.click(screen.getByRole('button', { name: '选中转盘作品：汽车广告视觉短片' }));
    expect(onOpen).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '转盘切换至汽车广告视觉短片' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '播放转盘作品：汽车广告视觉短片' }));
    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: 'W17' }), true, 'orbit-film-W17');
    fireEvent.click(screen.getByRole('button', { name: '观看这部作品' }));
    expect(onOpen).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'W17' }), true, 'orbit-watch');
  });
});
