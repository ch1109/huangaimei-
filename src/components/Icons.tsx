import type { CSSProperties } from 'react';
export function Arrow({ direction = 'up-right' }: { direction?: 'up-right' | 'right' | 'down' | 'left' }) {
  const rotations = { 'up-right': 0, right: 45, down: 135, left: 225 };
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rotations[direction]}deg)` }}><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function Play({ style }: { style?: CSSProperties }) { return <svg style={style} aria-hidden="true" width="17" height="17" viewBox="0 0 20 20" fill="currentColor"><path d="M6 3.9a1 1 0 0 1 1.5-.86l10 6.1a1 1 0 0 1 0 1.72l-10 6.1A1 1 0 0 1 6 16.1z" /></svg>; }
export function Plus() { return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20"><path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.3" /></svg>; }
export function Close() { return <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.5" /></svg>; }
