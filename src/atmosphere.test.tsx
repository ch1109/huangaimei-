import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CinematicAtmosphere } from './components/CinematicAtmosphere';
import { paintAtmosphere } from './components/atmosphere-field';

vi.mock('./components/atmosphere-field', () => ({ paintAtmosphere: vi.fn() }));

describe('光场的生命周期与访问性', () => {
  const callbacks = new Map<number, FrameRequestCallback>();
  const queries = new Map<string, { matches: boolean; listeners: Set<() => void> }>();
  let next = 0;
  let hidden = false;
  const advance = (time: number) => act(() => {
    const pending = [...callbacks.values()]; callbacks.clear();
    pending.forEach(callback => callback(time));
  });
  const preference = (query: string, matches: boolean) => act(() => {
    const media = queries.get(query)!; media.matches = matches;
    media.listeners.forEach(listener => listener());
  });

  beforeEach(() => {
    callbacks.clear(); queries.clear(); vi.clearAllMocks(); hidden = false;
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      const id = ++next; callbacks.set(id, callback); return id;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => { callbacks.delete(id); });
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    vi.stubGlobal('matchMedia', (query: string) => {
      const state = { matches: query.includes('pointer: fine'), listeners: new Set<() => void>() };
      queries.set(query, state);
      return { get matches() { return state.matches; },
        addEventListener: (_: string, listener: () => void) => state.listeners.add(listener),
        removeEventListener: (_: string, listener: () => void) => state.listeners.delete(listener) };
    });
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('隐藏时不再绘制，恢复时艺术时钟连续，卸载后清理动画', () => {
    const view = render(<CinematicAtmosphere />);
    advance(1000); advance(1017);
    const before = vi.mocked(paintAtmosphere).mock.calls.at(-1)![1].time;
    act(() => { hidden = true; document.dispatchEvent(new Event('visibilitychange')); });
    const count = vi.mocked(paintAtmosphere).mock.calls.length;
    advance(30000);
    expect(paintAtmosphere).toHaveBeenCalledTimes(count);
    expect(callbacks.size).toBe(0);
    act(() => { hidden = false; document.dispatchEvent(new Event('visibilitychange')); });
    advance(40000);
    expect(vi.mocked(paintAtmosphere).mock.calls.at(-1)![1].time - before).toBeLessThan(.02);
    view.unmount();
    expect(callbacks.size).toBe(0);
    expect([...queries.values()].every(media => media.listeners.size === 0)).toBe(true);
  });

  it('减少动态效果只画静态一帧，滚动不触发循环，可实时恢复', () => {
    render(<CinematicAtmosphere />);
    preference('(prefers-reduced-motion: reduce)', true);
    expect(callbacks.size).toBe(0);
    const count = vi.mocked(paintAtmosphere).mock.calls.length;
    act(() => window.dispatchEvent(new Event('scroll')));
    advance(1000); advance(2000);
    expect(paintAtmosphere).toHaveBeenCalledTimes(count);
    expect(document.querySelector('.cinematic-atmosphere')?.getAttribute('data-motion')).toBe('still');
    preference('(prefers-reduced-motion: reduce)', false);
    advance(3000);
    expect(vi.mocked(paintAtmosphere).mock.calls.length).toBeGreaterThan(count);
  });

  it('预览帧率降低时保持真实时间速度', () => {
    render(<CinematicAtmosphere />);
    advance(1000);
    const before = vi.mocked(paintAtmosphere).mock.calls.at(-1)![1].time;
    advance(1500);
    expect(vi.mocked(paintAtmosphere).mock.calls.at(-1)![1].time - before).toBeCloseTo(.5);
    advance(2500);
    expect(vi.mocked(paintAtmosphere).mock.calls.at(-1)![1].time - before).toBeCloseTo(1.5);
  });

  it('播放作品时暂停，关闭后恢复同一个画布', () => {
    const view = render(<CinematicAtmosphere />);
    advance(1000);
    const canvas = document.querySelector('canvas');
    view.rerender(<CinematicAtmosphere paused />);
    const count = vi.mocked(paintAtmosphere).mock.calls.length;
    advance(2000);
    expect(paintAtmosphere).toHaveBeenCalledTimes(count);
    expect(callbacks.size).toBe(0);
    view.rerender(<CinematicAtmosphere paused={false} />);
    advance(3000);
    expect(document.querySelector('canvas')).toBe(canvas);
    expect(vi.mocked(paintAtmosphere).mock.calls.length).toBeGreaterThan(count);
  });

  it('鼠标视差保持微小幅度，停止移动后自行缓动归位', () => {
    render(<CinematicAtmosphere />);
    vi.spyOn(performance, 'now').mockReturnValue(1000);
    const event = new Event('pointermove');
    Object.assign(event, { pointerType: 'mouse', clientX: window.innerWidth, clientY: window.innerHeight });
    act(() => window.dispatchEvent(event));
    advance(1000); advance(1017); advance(1034);
    const shifted = vi.mocked(paintAtmosphere).mock.calls.at(-1)![1];
    expect(shifted.pointerX).toBeGreaterThan(0);
    expect(shifted.pointerX * window.innerWidth).toBeLessThanOrEqual(11);
    for (let time = 1200; time < 3200; time += 17) advance(time);
    const resting = vi.mocked(paintAtmosphere).mock.calls.at(-1)![1];
    expect(Math.abs(resting.pointerX)).toBeLessThan(shifted.pointerX / 100);
    expect(Math.abs(resting.pointerY)).toBeLessThan(shifted.pointerY / 100);
  });

  it('Canvas不可用时保留装饰降级且不启动渲染', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const view = render(<CinematicAtmosphere />);
    expect(view.container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(callbacks.size).toBe(0);
    expect(paintAtmosphere).not.toHaveBeenCalled();
  });
});
