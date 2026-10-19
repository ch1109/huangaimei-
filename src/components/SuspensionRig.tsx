import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

type Anchor = { id: string; x: number; y: number };
type Geometry = { width: number; height: number; fadeStart: number; fadeEnd: number; anchors: Anchor[] };

/** The SVG and the measured attachment points share the stage's coordinate space. */
export function SuspensionRig({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const maskId = useId();
  const gradientId = useId();
  const threadId = useId();
  const reduced = useReducedMotion();
  const [geometry, setGeometry] = useState<Geometry>({ width: 0, height: 0, fadeStart: 0, fadeEnd: 1, anchors: [] });

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const viewport = stage.parentElement!;
    let frame = 0;
    let disposed = false;
    const measure = () => {
      const bounds = stage.getBoundingClientRect();
      if (!bounds.width || !bounds.height || disposed) return;
      const visible = viewport.getBoundingClientRect();
      const fadeStart = Math.max(0, visible.left - bounds.left);
      const fadeEnd = Math.min(bounds.width, visible.right - bounds.left);
      const anchors = Array.from(stage.querySelectorAll<HTMLElement>('[data-suspension-anchor]')).map(anchor => {
        const point = anchor.getBoundingClientRect();
        return { id: anchor.dataset.suspensionAnchor!, x: point.left + point.width / 2 - bounds.left, y: point.top + point.height / 2 - bounds.top };
      });
      const next = { width: bounds.width, height: bounds.height, fadeStart, fadeEnd, anchors };
      setGeometry(previous => previous.width === next.width && previous.height === next.height &&
        previous.fadeStart === fadeStart && previous.fadeEnd === fadeEnd &&
        previous.anchors.length === anchors.length && previous.anchors.every((anchor, index) =>
          anchor.id === anchors[index].id && anchor.x === anchors[index].x && anchor.y === anchors[index].y) ? previous : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    observer?.observe(stage);
    observer?.observe(viewport);
    stage.querySelectorAll('.suspended-film').forEach(card => observer?.observe(card));
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    viewport.addEventListener('scroll', schedule, { passive: true });
    document.fonts?.ready.then(() => { if (!disposed) schedule(); });
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      viewport.removeEventListener('scroll', schedule);
    };
  }, [stageRef]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let inView = false;
    const refresh = () => { stage.dataset.suspensionRunning = String(inView && !document.hidden && !reduced); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; refresh(); });
    observer.observe(stage);
    document.addEventListener('visibilitychange', refresh);
    refresh();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', refresh); };
  }, [stageRef, reduced]);

  const { width, height, fadeStart, fadeEnd, anchors } = geometry;
  const edge = width * .012;
  const sag = width * .021;
  const control = edge + sag * 4 / 3;
  // Equally spaced Bézier controls make x = t * width, so each drop lies on the curve exactly.
  const curveY = (x: number) => edge + 4 * sag * (x / width) * (1 - x / width);

  return <div ref={stageRef} className="suspension-stage"><svg className="suspension-rig" viewBox={`0 0 ${width || 1} ${height || 1}`} preserveAspectRatio="none"
    aria-hidden="true" focusable="false" data-ready={anchors.length > 0}>
    <defs>
      <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={fadeStart} x2={fadeEnd}>
        <stop offset="0" stopColor="white" stopOpacity="0" />
        <stop offset=".08" stopColor="white" />
        <stop offset=".92" stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={threadId} gradientUnits="userSpaceOnUse" x1="0" x2={width || 1}>
        <stop offset="0" stopColor="#9a8dab" stopOpacity=".55" />
        <stop offset=".25" stopColor="#b7a8ca" stopOpacity=".8" />
        <stop offset=".55" stopColor="#b6a6cc" stopOpacity=".84" />
        <stop offset=".8" stopColor="#c0afd2" stopOpacity=".8" />
        <stop offset="1" stopColor="#9a8dab" stopOpacity=".55" />
      </linearGradient>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={width || 1} height={height || 1}>
        <rect width={width || 1} height={height || 1} fill={`url(#${gradientId})`} />
      </mask>
    </defs>
    {width > 0 && <path className="suspension-mainline" d={`M 0 ${edge} C ${width / 3} ${control}, ${width * 2 / 3} ${control}, ${width} ${edge}`}
      stroke={`url(#${threadId})`} mask={`url(#${maskId})`} vectorEffect="non-scaling-stroke" />}
    {anchors.map(({ id, x, y }, index) => <g key={id} className="suspension-link" data-suspension-link={id} style={{ animationDelay: `${.24 + index * .11}s` }}>
      <line className="suspension-drop" x1={x} x2={x} y1={curveY(x)} y2={y + .5} vectorEffect="non-scaling-stroke" />
      <circle className="suspension-node" cx={x} cy={curveY(x)} r="2.25" />
      <path className="suspension-socket" d={`M ${x - 3.5} ${y + .5} H ${x + 3.5}`} vectorEffect="non-scaling-stroke" />
    </g>)}
  </svg>{children}</div>;
}
