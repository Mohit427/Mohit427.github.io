import { useRef, useState, type PointerEvent, type CSSProperties } from 'react';
import { gsap, ScrollTrigger, useGSAP, reducedMotion, scrollToTarget } from '../lib/motion';
import { useImages } from '../hooks/useImage';
import { VoxelBook, VoxelCloud } from './Voxel';
import { Arrow } from './Buttons';
import { SectionLabel } from './About';
import { projects, type Project } from '../content';

const BOOK = '/enchantedbook.png';
const SHOWN = 2;

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);

function Cover({ p }: { p: Project }) {
  const img = useImages(p.image);
  if (img === 'ok') return <img className="card-img" src={p.image} alt={`${p.title} screenshot`} loading="lazy" />;
  // generated cover until a screenshot is dropped into /public/projects
  return (
    <div className="card-gen" style={{ '--h': p.hue } as CSSProperties} aria-hidden="true">
      <div className="card-gen-grid" />
      <span className="card-gen-title">{p.title}</span>
    </div>
  );
}

function Card({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLElement>(null);

  // spotlight glow + gentle tilt that follows the pointer (MagicCard pattern)
  const onMove = (e: PointerEvent) => {
    const el = ref.current!;
    const b = el.getBoundingClientRect();
    const x = e.clientX - b.left;
    const y = e.clientY - b.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    if (e.pointerType === 'mouse' && !reducedMotion()) {
      gsap.to(el, { rotateY: (x / b.width - 0.5) * 6, rotateX: -(y / b.height - 0.5) * 6, duration: 0.6, ease: 'power3.out' });
    }
  };
  const onLeave = () => gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });

  return (
    <div className="card-float" data-i={i}>
      <div className="card-breathe">
      <article className="card" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="card-media" data-cursor="label" data-cursor-label={p.demo ? (p.demoLabel ? 'Get' : 'Live') : p.repo ? 'Code' : 'Soon'}>
          <Cover p={p} />
          {p.badge && <span className="card-badge">{p.badge}</span>}
          <span className="card-num">{String(i + 1).padStart(2, '0')}</span>
        </div>
        <div className="card-body">
          <span className="card-kicker">{p.kicker}</span>
          <h3>{p.title}</h3>
          <p>{p.blurb}</p>
          <ul className="card-stack">
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="card-links">
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="card-link">
                {p.demoLabel ?? 'Live demo'} <Arrow dir="up-right" />
              </a>
            )}
            {p.repo ? (
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="card-link">
                <GitHubIcon /> Repository
              </a>
            ) : (
              <span className="card-link card-link--muted">Code on request</span>
            )}
          </div>
        </div>
      </article>
      </div>
    </div>
  );
}

export function Projects() {
  const root = useRef<HTMLElement>(null);
  const more = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const busy = useRef(false);
  const book = useImages(BOOK);

  const { contextSafe } = useGSAP(
    () => {
      const reduce = reducedMotion();
      const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true };
      if (!reduce) {
        gsap.fromTo('.cloud--a', { yPercent: 60 }, { yPercent: -120, ease: 'none', scrollTrigger: st });
        gsap.fromTo('.cloud--b', { yPercent: -60 }, { yPercent: 140, ease: 'none', scrollTrigger: st });
        gsap.fromTo('.cloud--c', { yPercent: 40 }, { yPercent: -60, ease: 'none', scrollTrigger: st });
      }

      // heading: title letters rise in, book bobs
      gsap.from('.work-title .ch', {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.03,
        scrollTrigger: { trigger: '.work-head', start: 'top 80%' },
      });
      gsap.from('.work-book, .work-intro', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.work-head', start: 'top 80%' },
      });
      if (!reduce) gsap.to('.work-book', { y: -10, rotate: -3, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      // cards slide up as they enter
      gsap.utils.toArray<HTMLElement>('.work-grid--main .card-float').forEach((c, i) => {
        gsap.from(c, {
          y: 120,
          opacity: 0,
          rotate: i % 2 ? 2 : -2,
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: c, start: 'top 92%' },
        });
      });

      // every card breathes, offset by index so the grid never moves in lockstep
      if (!reduce) {
        gsap.utils.toArray<HTMLElement>('.card-breathe').forEach((c, i) => {
          gsap.to(c, {
            y: -8,
            scale: 1.006,
            duration: 3 + (i % 3) * 0.4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.45,
          });
        });
      }
    },
    { scope: root },
  );

  const toggle = contextSafe(() => {
    if (busy.current) return;
    const box = more.current!;
    const cards = box.querySelectorAll('.card-float');
    const reduce = reducedMotion();
    busy.current = true;

    if (!open) {
      setOpen(true);
      gsap.fromTo(box, { height: 0 }, {
        height: 'auto',
        duration: reduce ? 0 : 1,
        ease: 'expo.inOut',
        onComplete: () => {
          busy.current = false;
          ScrollTrigger.refresh();
        },
      });
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0, filter: 'blur(12px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: reduce ? 0 : 1, ease: 'expo.out', stagger: 0.1, delay: 0.25 },
      );
    } else {
      gsap.to(cards, { y: 40, opacity: 0, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in', stagger: { each: 0.05, from: 'end' } });
      // bring the section back into view so the collapse doesn't yank the page
      scrollToTarget('#work');
      gsap.to(box, {
        height: 0,
        duration: reduce ? 0 : 0.9,
        ease: 'expo.inOut',
        delay: 0.2,
        onComplete: () => {
          setOpen(false);
          busy.current = false;
          ScrollTrigger.refresh();
        },
      });
    }
  });

  const title = 'Featured Projects';

  return (
    <section className="work" id="work" ref={root}>
      <VoxelCloud className="cloud cloud--a" seed={3} />
      <VoxelCloud className="cloud cloud--b" seed={8} />
      <VoxelCloud className="cloud cloud--c" seed={13} />

      <div className="wrap">
        <SectionLabel n="02">Selected work</SectionLabel>
        <div className="work-head">
          <div className="work-book" aria-hidden="true">
            {book === 'ok' ? <img src={BOOK} alt="" /> : <VoxelBook />}
          </div>
          <h2 className="work-title" aria-label={title}>
            {title.split(' ').map((w, wi) => (
              <span className="mask word" key={wi} aria-hidden="true">
                {[...w].map((c, ci) => (
                  <span className="ch" key={ci}>
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="work-intro">
            Things I've built at hackathons and on my own: health records, traffic signals, contest tooling and fitness
            coaching. Most started as a problem I couldn't leave alone.
          </p>
        </div>

        <div className="work-grid work-grid--main">
          {projects.slice(0, SHOWN).map((p, i) => (
            <Card p={p} i={i} key={p.id} />
          ))}
        </div>

        <div className="work-more" ref={more} style={{ height: 0 }} aria-hidden={!open} inert={!open}>
          <div className="work-grid">
            {projects.slice(SHOWN).map((p, i) => (
              <Card p={p} i={i + SHOWN} key={p.id} />
            ))}
          </div>
        </div>

        <div className="work-toggle">
          <button type="button" className="pill pill--ghost" onClick={toggle} aria-expanded={open} data-magnetic="0.3">
            <span className="pill-fill" aria-hidden="true" />
            <span className="pill-text" data-magnetic-inner>
              {open ? 'View less' : `View ${projects.length - SHOWN} more`}
            </span>
            <span className={`pill-icon ${open ? 'is-up' : ''}`} aria-hidden="true">
              <Arrow dir="down" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
