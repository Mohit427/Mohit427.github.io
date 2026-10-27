import { useEffect, useRef } from 'react';
import { gsap, useGSAP, onIntroDone, reducedMotion, go } from '../lib/motion';
import { useImages } from '../hooks/useImage';
import { VoxelAvatar, VoxelEmbers } from './Voxel';
import { Pill } from './Buttons';
import { profile } from '../content';

const BASE = '/transparent-base.webp';
const FLAME = '/transparent-flame.webp';
const RIM = '/transparent-rim.webp';

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const flame = useRef<HTMLDivElement>(null);
  const base = useImages(BASE);
  const flameImg = useImages(FLAME);
  const rim = useImages(RIM);
  const loading = base === 'loading' || (base === 'ok' && (flameImg === 'loading' || rim === 'loading'));

  // Spotlight: the flame layer is masked by a soft circle that eases toward the pointer.
  useEffect(() => {
    const sec = section.current!;
    const layer = flame.current!;
    const reduce = reducedMotion();
    let tx = 0, ty = 0, sx = 0, sy = 0, idle = true, t0 = performance.now(), raf = 0;
    let radius = 0, targetRadius = 0;

    const center = () => {
      const b = layer.getBoundingClientRect();
      return [b.width / 2, b.height * 0.42] as const;
    };
    [tx, ty] = center();
    sx = tx; sy = ty;

    const toLocal = (cx: number, cy: number) => {
      const b = layer.getBoundingClientRect();
      tx = cx - b.left;
      ty = cy - b.top;
      idle = false;
    };
    const onMouse = (e: MouseEvent) => toLocal(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) toLocal(t.clientX, t.clientY);
    };
    const onEnter = () => (targetRadius = 1);
    const onLeave = () => {
      idle = true;
      t0 = performance.now();
    };

    sec.addEventListener('mousemove', onMouse, { passive: true });
    sec.addEventListener('touchstart', onTouch, { passive: true });
    sec.addEventListener('touchmove', onTouch, { passive: true });
    sec.addEventListener('pointerenter', onEnter);
    sec.addEventListener('mouseleave', onLeave);
    const off = onIntroDone(() => (targetRadius = 1));

    const tick = (now: number) => {
      if (idle) {
        // drift lazily around the face until someone moves the mouse
        const [cx, cy] = center();
        const k = (now - t0) / 1000;
        tx = cx + Math.cos(k * 0.7) * cx * 0.35;
        ty = cy + Math.sin(k * 1.1) * cy * 0.25;
      }
      const ease = reduce ? 1 : 0.1;
      sx += (tx - sx) * ease;
      sy += (ty - sy) * ease;
      radius += (targetRadius - radius) * 0.05;
      layer.style.setProperty('--x', `${sx.toFixed(1)}px`);
      layer.style.setProperty('--y', `${sy.toFixed(1)}px`);
      layer.style.setProperty('--r', radius.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      off();
      sec.removeEventListener('mousemove', onMouse);
      sec.removeEventListener('touchstart', onTouch);
      sec.removeEventListener('touchmove', onTouch);
      sec.removeEventListener('pointerenter', onEnter);
      sec.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>('.hl-word > span');
      const reveal = gsap.utils.toArray<HTMLElement>('[data-hero-reveal]');
      gsap.set(words, { yPercent: 110 });
      gsap.set(reveal, { opacity: 0, y: 24 });
      gsap.set('.avatar', { opacity: 0, scale: 0.94, yPercent: 6 });

      const off = onIntroDone(() => {
        const tl = gsap.timeline();
        tl.to('.avatar', { opacity: 1, scale: 1, yPercent: 0, duration: 1.6, ease: 'expo.out' }, 0)
          .to(words, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.035 }, 0.1)
          .to(reveal, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.35);
      });

      // scroll-out: layers drift at different speeds
      const st = { trigger: section.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('[data-hero-name]', { yPercent: -60, ease: 'none', scrollTrigger: st });
      gsap.to('.avatar-stage', { yPercent: 18, scale: 0.92, ease: 'none', scrollTrigger: st });
      gsap.to('.hero-glow', { yPercent: 30, opacity: 0.3, ease: 'none', scrollTrigger: st });
      gsap.to('.hero-bottom', { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } });
      return off;
    },
    { scope: section },
  );

  const words = profile.headline.split(' ');

  return (
    <section className="hero" id="top" ref={section} data-cursor="spot">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid-bg" aria-hidden="true" />

      <div className="hero-top" data-hero-reveal>
        <span>Portfolio ©2026</span>
        <span>{profile.role}</span>
        <span>{profile.location}</span>
      </div>

      <h1 className="hero-name bigname" data-hero-name aria-label={`${profile.first} ${profile.last}`}>
        <span className="intro-word" aria-hidden="true">{profile.first}</span>
        <span className="intro-word" aria-hidden="true">{profile.last}</span>
      </h1>

      <div className="avatar-stage">
        <div className={`avatar ${base === 'ok' ? 'is-photo' : ''}`}>
          {loading && <div className="avatar-skeleton" />}
          <div className="avatar-layer avatar-base">
            {!loading && (base === 'ok' ? <img src={BASE} alt="" /> : <VoxelAvatar />)}
          </div>
          <div className="avatar-layer avatar-flame" ref={flame}>
            {loading ? null : base !== 'ok' ? (
              <VoxelAvatar flame />
            ) : flameImg === 'ok' ? (
              <img src={FLAME} alt="" />
            ) : (
              // no flame render yet: voxel energy traces the silhouette, the face stays as-is
              <>
                {rim === 'ok' && <img src={RIM} alt="" className="avatar-rim" />}
                <VoxelEmbers className="avatar-embers" />
              </>
            )}
          </div>
        </div>
        <span className="visually-hidden">Voxel portrait of {profile.first}; moving the pointer reveals a glowing violet version.</span>
      </div>

      <div className="hero-bottom">
        <p className="headline">
          {words.map((w, i) => (
            <span className="hl-word mask" key={i}>
              <span>{w}</span>{' '}
            </span>
          ))}
        </p>
        <div className="hero-actions" data-hero-reveal>
          <Pill href={profile.resume} external icon="up-right">
            View Resume
          </Pill>
          <a href="#work" onClick={go} className="scroll-cue" data-cursor="hover">
            <span className="scroll-cue-line" aria-hidden="true" />
            Scroll to explore
          </a>
        </div>
      </div>
    </section>
  );
}
