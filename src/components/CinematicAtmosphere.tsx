import { useEffect, useRef } from 'react';
import { paintAtmosphere } from './atmosphere-field';

/** One decorative surface. Pointer events still belong entirely to the portfolio. */
export function CinematicAtmosphere({ paused = false }: { paused?: boolean }) {
  const surface = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const suspend = useRef<() => void>(() => {});
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
    suspend.current();
  }, [paused]);

  useEffect(() => {
    const element = canvas.current;
    const shell = surface.current;
    if (!element || !shell) return;
    // A small, opaque drawing buffer is enough for diffuse light. No pixel reads,
    // full-screen filters, WebGL context, video, or per-frame React updates.
    const ctx = element.getContext('2d', { alpha: false });
    if (!ctx) return; // The CSS atmosphere remains available without Canvas.
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width: 799px), (pointer: coarse)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0;
    let lastFrame = 0;
    let lastPaint = 0;
    let elapsed = 0;
    let width = 1;
    let height = 1;
    let scroll = window.scrollY;
    let targetScroll = scroll;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastMove = -Infinity;
    let hover = 0;
    let hovered: Element | null = null;
    let light = { x: .5, y: .5, scrollY: 0 };
    const origin = performance.now();

    const draw = () => {
      paintAtmosphere(ctx, {
        width: element.width, height: element.height, time: elapsed,
        scroll: scroll / height,
        pointerX: mouseX / width, pointerY: mouseY / height,
        hover, lightX: light.x, lightY: light.y + (light.scrollY - scroll) / height,
        compact: compact.matches,
      });
    };
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      // Deliberately independent of devicePixelRatio: these are soft light fields.
      const scale = Math.min(.65, (compact.matches ? 440 : 1000) / width, 900 / height);
      element.width = Math.max(1, Math.round(width * scale));
      element.height = Math.max(1, Math.round(height * scale));
      draw();
    };
    const running = () => !document.hidden && !pausedRef.current && !reduced.matches;
    const tick = (now: number) => {
      frame = 0;
      if (!running()) return;
      const step = compact.matches ? 1000 / 30 : 1000 / 60;
      const interval = now - lastFrame;
      if (!lastFrame || interval >= step) {
        // Freeze the artistic clock while hidden; a resumed page never jumps.
        // Visibility and pause transitions reset lastPaint. While visible, use
        // wall time so a throttled preview cannot slow the entire animation.
        const dt = lastPaint ? Math.max(0, (now - lastPaint) / 1000) : 1 / 60;
        lastPaint = now;
        // Carry fractional time forward: a 144 Hz display still averages 60
        // draws/s instead of being quantized down to one draw every third frame.
        lastFrame = lastFrame ? now - interval % step : now;
        elapsed += dt;
        const response = 1 - Math.exp(-dt * 5.5);
        const resting = now - lastMove > 180;
        mouseX += ((resting ? 0 : targetX) - mouseX) * response;
        mouseY += ((resting ? 0 : targetY) - mouseY) * response;
        scroll += (targetScroll - scroll) * (1 - Math.exp(-dt * 3));
        hover += ((hovered ? 1 : 0) - hover) * (1 - Math.exp(-dt * 2.6));
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
      lastPaint = 0;
      shell.dataset.running = String(running());
      shell.dataset.motion = reduced.matches ? 'still' : 'flow';
      if (reduced.matches) {
        elapsed = 0; mouseX = 0; mouseY = 0; hover = 0;
        scroll = targetScroll;
        draw();
      } else if (running()) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      targetScroll = window.scrollY;
      // Reduced-motion is a true still composition, including during scrolling.
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !fine.matches || reduced.matches) return;
      targetX = (event.clientX / width - .5) * 22;
      targetY = (event.clientY / height - .5) * 14;
      lastMove = performance.now();
    };
    const clearPointer = () => { targetX = 0; targetY = 0; hovered = null; };
    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !fine.matches || reduced.matches) return;
      const card = event.target instanceof Element ? event.target.closest('[data-work-id]') : null;
      if (card === hovered) return;
      hovered = card;
      if (card) {
        const box = card.getBoundingClientRect();
        light = { x: (box.left + box.width / 2) / width, y: (box.top + box.height * .55) / height, scrollY: window.scrollY };
      }
    };
    const onOut = (event: PointerEvent) => {
      if (!hovered || (event.relatedTarget instanceof Node && hovered.contains(event.relatedTarget))) return;
      hovered = null;
    };
    const onMode = () => { resize(); refresh(); };
    // ResizeObserver only tracks the viewport surface, never the long document.
    const observer = new ResizeObserver(resize);
    observer.observe(shell);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    document.documentElement.addEventListener('pointerleave', clearPointer);
    window.addEventListener('blur', clearPointer);
    reduced.addEventListener('change', onMode);
    compact.addEventListener('change', onMode);
    suspend.current = refresh;
    resize();
    shell.dataset.ready = 'true';
    // Entrance is CSS-only and happens once, even when a detail dialog is closed.
    shell.style.setProperty('--atmosphere-delay', `${-Math.min((performance.now() - origin) / 1000, 2)}s`);
    refresh();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.documentElement.removeEventListener('pointerleave', clearPointer);
      window.removeEventListener('blur', clearPointer);
      reduced.removeEventListener('change', onMode);
      compact.removeEventListener('change', onMode);
      suspend.current = () => {};
    };
  }, []);

  return <div ref={surface} className="cinematic-atmosphere" aria-hidden="true">
    <canvas ref={canvas} />
    <div className="atmosphere-shade" />
  </div>;
}
