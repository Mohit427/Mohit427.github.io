import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, lockScroll, onIntroDone, go } from '../lib/motion';
import { profile } from '../content';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#path', label: 'Path' },
  { href: '#contact', label: 'Contact' },
];

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(() => {
    const el = bar.current!;
    gsap.set(el, { yPercent: -120 });
    const off = onIntroDone(() => gsap.to(el, { yPercent: 0, duration: 1, ease: 'expo.out', delay: 0.2 }));

    // hide on scroll down, show on scroll up
    let shown = true;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const want = self.direction < 0 || self.scroll() < 120;
        el.classList.toggle('is-scrolled', self.scroll() > 40);
        if (want !== shown) {
          shown = want;
          gsap.to(el, { yPercent: want ? 0 : -120, duration: 0.6, ease: 'power3.out' });
        }
      },
    });
    gsap.to('.progress i', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    });
    return off;
  });

  // full-screen menu on small screens
  const wasOpen = useRef(false);
  useEffect(() => {
    if (!open) {
      // only release a lock this menu took, never the intro's
      if (wasOpen.current) lockScroll(false);
      return;
    }
    wasOpen.current = true;
    lockScroll(true);
    gsap.fromTo('.menu-link', { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.15 });
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <div className="progress" aria-hidden="true">
        <i />
      </div>
      <header className="nav" ref={bar}>
        <a href="#top" className="logo" onClick={(e) => go(e, close)} aria-label={`${profile.first} ${profile.last}, back to top`} data-cursor="hover">
          <span className="logo-cap">{profile.first[0]}</span>
          <span className="logo-rest">{profile.first.slice(1)}</span>
          <span className="logo-cap">&nbsp;{profile.last[0]}</span>
          <span className="logo-rest">{profile.last.slice(1)}</span>
        </a>
        <nav aria-label="Primary" className="nav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={go} className="nav-link">
              <span className="roll">
                <span data-text={l.label}>{l.label}</span>
              </span>
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <span className="status">
            <i /> Open to internships
          </span>
          <a href="#contact" onClick={go} className="nav-cta" data-magnetic="0.25">
            <span data-magnetic-inner>Let's talk</span>
          </a>
          <button className={`burger ${open ? 'is-open' : ''}`} type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((v) => !v)}>
            <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
            <i />
            <i />
          </button>
        </div>
      </header>
      <div id="menu" className={`menu ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          {LINKS.map((l, i) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, close)} className="menu-item">
              <span className="menu-link">
                <small>0{i + 1}</small>
                {l.label}
              </span>
            </a>
          ))}
        </nav>
        <div className="menu-foot">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
      </div>
    </>
  );
}
