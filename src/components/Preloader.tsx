import { useRef, useState } from 'react';
import { gsap, useGSAP, reducedMotion, lockScroll, markIntroDone } from '../lib/motion';
import { profile } from '../content';

/**
 * Intro: "MK" sits alone while a counter runs, then each initial unfurls into the full
 * name ("M" -> "MOHIT", "K" -> "KUMAR"), and the whole name glides into the hero heading.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current!;
      const hero = document.querySelector<HTMLElement>('[data-hero-name]');
      window.scrollTo(0, 0);

      const finish = () => {
        hero?.classList.add('is-ready');
        lockScroll(false);
        markIntroDone();
        setGone(true);
      };

      if (reducedMotion()) {
        finish();
        return;
      }
      lockScroll(true);

      const name = el.querySelector<HTMLElement>('.intro-name')!;
      const rests = gsap.utils.toArray<HTMLElement>('.intro-rest', el);
      const restChars = gsap.utils.toArray<HTMLElement>('.intro-rest .ch', el);
      const caps = gsap.utils.toArray<HTMLElement>('.intro-cap', el);
      const count = el.querySelector<HTMLElement>('.intro-count b')!;
      // collapse to "MK"; real widths are measured once the display font has loaded
      gsap.set(rests, { width: 0 });
      gsap.set(restChars, { yPercent: 110 });
      gsap.set(caps, { yPercent: 110 });

      const counter = { v: 0 };
      const loaded = Promise.all([document.fonts?.ready, new Promise((r) => setTimeout(r, 1900))]);

      const tl = gsap.timeline();
      tl.to(caps, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.15)
        .to('.intro-meta > *', { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out' }, 0.3)
        .to(counter, {
          v: 92,
          duration: 1.7,
          ease: 'power2.inOut',
          onUpdate: () => (count.textContent = String(Math.round(counter.v)).padStart(3, '0')),
        }, 0.2);

      let cancelled = false;
      loaded.then(() => {
        if (cancelled) return; // StrictMode re-runs this effect; only the live run hands off
        const widths = rests.map((r) => {
          r.style.width = 'auto';
          const w = r.getBoundingClientRect().width;
          r.style.width = '0px';
          return w;
        });
        const out = gsap.timeline({ onComplete: finish });
        out
          .to(counter, {
            v: 100,
            duration: 0.35,
            ease: 'power1.out',
            onUpdate: () => (count.textContent = String(Math.round(counter.v)).padStart(3, '0')),
          })
          // the monogram unfurls into the full name
          .to(rests, { width: (i) => widths[i], duration: 1.1, ease: 'expo.inOut', clearProps: 'width' }, '+=0.1')
          .to(restChars, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.035 }, '<0.25')
          .to('.intro-meta', { opacity: 0, duration: 0.4 }, '<')
          .add(() => {
            // glide into the hero heading's exact spot (FLIP)
            if (!hero) return;
            name.classList.add('is-landing');
            const from = name.getBoundingClientRect();
            const to = hero.getBoundingClientRect();
            gsap.to(name, {
              x: to.left - from.left,
              y: to.top - from.top,
              scale: to.width / from.width,
              transformOrigin: '0 0',
              duration: 1.2,
              ease: 'expo.inOut',
            });
          }, '+=0.15')
          .to('.intro-bg', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'expo.inOut' }, '<')
          .add(() => {}, '+=1.2');
      });
      return () => {
        cancelled = true;
      };
    },
    { scope: root },
  );

  if (gone) return null;

  const word = (cap: string, rest: string) => (
    <span className="intro-word">
      <span className="mask"><span className="intro-cap">{cap}</span></span>
      <span className="intro-rest mask">
        {[...rest].map((c, i) => (
          <span className="ch" key={i}>{c}</span>
        ))}
      </span>
    </span>
  );

  return (
    <div className="intro" ref={root} aria-hidden="true">
      <div className="intro-bg">
        <div className="intro-glow" />
        <div className="intro-meta">
          <span>Portfolio ©2026</span>
          <span>{profile.location}</span>
        </div>
        <div className="intro-count">
          <b>000</b>
          <span>/100</span>
        </div>
      </div>
      <div className="intro-name bigname">
        {word(profile.first[0], profile.first.slice(1))}
        {word(profile.last[0], profile.last.slice(1))}
      </div>
    </div>
  );
}
