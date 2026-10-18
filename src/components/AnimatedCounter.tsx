import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'motion/react';

/** 数字滚入视口后从 0 计数到目标值 */
export function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);
  const triggered = useRef(false);

  useEffect(() => {
    if (reduced) { setDisplay(value); return; }
    if (!ref.current) return;
    let controls: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        controls = animate(0, value, {
          duration: .8,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: v => setDisplay(Math.round(v)),
        });
      }
    }, { threshold: 0.5 });
    observer.observe(ref.current);
    return () => { observer.disconnect(); controls?.stop(); };
  }, [value, reduced]);

  return <span ref={ref} aria-label={`${value}${suffix}`}><span aria-hidden="true">{display}{suffix}</span></span>;
}
