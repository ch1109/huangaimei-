import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { WorkDetail } from './components/WorkDetail';
import { works } from './data/works';

vi.mock('motion/react', async importOriginal => ({ ...await importOriginal<typeof import('motion/react')>(), useReducedMotion: () => false }));

describe('详情关闭动效', () => {
  it('立即停止播放，退出完成后只返回一次', async () => {
    const onClose = vi.fn();
    render(<WorkDetail work={works[0]} modal autoplay category="全部" onClose={onClose} onNext={vi.fn()} />);
    await waitFor(() => expect(document.querySelector('video')).not.toBeNull());
    vi.mocked(HTMLMediaElement.prototype.pause).mockClear();
    fireEvent.click(screen.getByRole('button', { name: '关闭作品详情' }));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(document.querySelector('dialog')?.classList.contains('is-closing')).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: '关闭作品详情' }));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
