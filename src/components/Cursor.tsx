import { useEffect, useRef } from 'react';
import { gsap, finePointer, reducedMotion } from '../lib/motion';

/**
 * Dot + trailing ring. Elements opt in with:
 *   data-cursor="hover"          ring grows
 *   data-cursor="label" data-cursor-label="View"   ring fills and shows a label
 *   data-magnetic                element is pulled toward the pointer
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!finePointer()) return;
    const root = document.documentElement;
    const d = dot.current!;
    const r = ring.current!;
    const lab = label.current!;
    const reduce = reducedMotion();
    gsap.set([d, r], { xPercent: -50, yPercent: -50 });

    const dx = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'power3' });
    const dy = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'power3' });
    const rx = gsap.quickTo(r, 'x', { duration: reduce ? 0.01 : 0.45, ease: 'power3' });
    const ry = gsap.quickTo(r, 'y', { duration: reduce ? 0.01 : 0.45, ease: 'power3' });

    let magnet: HTMLElement | null = null;

    const release = () => {
      if (!magnet) return;
      gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      const inner = magnet.querySelector('[data-magnetic-inner]');
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      magnet = null;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      root.classList.add('has-cursor');
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);

      const t = e.target as HTMLElement;
      const target = t.closest<HTMLElement>('[data-cursor], a, button');
      const mode = target?.dataset.cursor ?? (target ? 'hover' : '');
      r.dataset.state = mode;
      d.dataset.state = mode;
      const text = target?.dataset.cursorLabel ?? '';
      if (lab.textContent !== text) lab.textContent = text;

      const m = t.closest<HTMLElement>('[data-magnetic]');
      if (m !== magnet) release();
      if (m && !reduce) {
        magnet = m;
        const b = m.getBoundingClientRect();
        const ox = e.clientX - (b.left + b.width / 2);
        const oy = e.clientY - (b.top + b.height / 2);
        const strength = Number(m.dataset.magnetic || 0.35);
        gsap.to(m, { x: ox * strength, y: oy * strength, duration: 0.5, ease: 'power3.out' });
        const inner = m.querySelector('[data-magnetic-inner]');
        if (inner) gsap.to(inner, { x: ox * strength * 0.4, y: oy * strength * 0.4, duration: 0.5, ease: 'power3.out' });
      }
    };
    const leave = () => {
      root.classList.remove('has-cursor');
      release();
    };
    const down = () => r.classList.add('is-down');
    const up = () => r.classList.remove('is-down');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      root.classList.remove('has-cursor');
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor-ring" ref={ring}>
        <span ref={label} />
      </div>
      <div className="cursor-dot" ref={dot} />
    </div>
  );
}
