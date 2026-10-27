import { useRef, useState, type PointerEvent } from 'react';
import { gsap, useGSAP, reducedMotion, scrollToTarget } from '../lib/motion';
import { useImages } from '../hooks/useImage';
import { VoxelLlama, VoxelRidge } from './Voxel';
import { Arrow } from './Buttons';
import { profile } from '../content';

const SKY = '/sky.png';
const LLAMA = '/llama-nobg.png';

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const sky = useImages(SKY);
  const llama = useImages(LLAMA);
  const [copied, setCopied] = useState(false);

  // background layers only exist once we know whether /sky.png is there
  useGSAP(
    () => {
      if (sky === 'loading' || reducedMotion()) return;
      const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true };
      // each layer drifts at its own speed; the farthest moves the least
      if (sky === 'ok') gsap.fromTo('.sky-img', { yPercent: -18 }, { yPercent: 6, ease: 'none', scrollTrigger: st });
      else {
        gsap.fromTo('.sky-sun', { yPercent: 60 }, { yPercent: -30, ease: 'none', scrollTrigger: st });
        gsap.fromTo('.ridge--far', { yPercent: 30 }, { yPercent: 0, ease: 'none', scrollTrigger: st });
        gsap.fromTo('.ridge--mid', { yPercent: 55 }, { yPercent: 0, ease: 'none', scrollTrigger: st });
        gsap.fromTo('.ridge--near', { yPercent: 80 }, { yPercent: 0, ease: 'none', scrollTrigger: st });
      }
    },
    { scope: root, dependencies: [sky], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!reducedMotion()) gsap.to('.llama', { y: -6, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.cta-card', start: 'top 80%' } });
      tl.from('.cta-card', { y: 100, opacity: 0, scale: 0.96, duration: 1.3, ease: 'expo.out' })
        .from('.llama', { y: 60, opacity: 0, duration: 1, ease: 'back.out(1.6)' }, 0.35)
        .from('.cta-title .ch', { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.02 }, 0.3)
        .from('.cta-card .reveal', { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07 }, 0.5);
    },
    { scope: root },
  );

  const onMove = (e: PointerEvent) => {
    const el = card.current!;
    const b = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - b.left}px`);
    el.style.setProperty('--my', `${e.clientY - b.top}px`);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const title = "Let's build something real.";

  return (
    <section className="contact" id="contact" ref={root}>
      <div className="sky" aria-hidden="true">
        {sky === 'ok' ? (
          <img className="sky-img" src={SKY} alt="" />
        ) : (
          <>
            <div className="sky-grad" />
            <div className="sky-sun" />
            <VoxelRidge className="ridge ridge--far" seed={2} color="#D9CEF5" height={22} />
            <VoxelRidge className="ridge ridge--mid" seed={5} color="#BFAEF0" height={16} />
            <VoxelRidge className="ridge ridge--near" seed={9} color="#9B85E6" height={10} />
          </>
        )}
        <div className="sky-fade" />
      </div>

      <div className="cta-wrap">
        <div className="llama">{llama === 'ok' ? <img src={LLAMA} alt="" /> : <VoxelLlama />}</div>
        <div className="cta-card" ref={card} onPointerMove={onMove}>
          <span className="eyebrow reveal">
            <i /> Available for internships
          </span>
          <h2 className="cta-title" aria-label={title}>
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
          <p className="reveal">
            I'm looking for internships where I can ship real things, whether that's backends, AI systems or code that
            moves hardware. Email is the fastest way to reach me.
          </p>
          <div className="cta-mail reveal">
            <a href={`mailto:${profile.email}`} data-cursor="label" data-cursor-label="Write">
              {profile.email}
            </a>
            <button type="button" onClick={copy} className="copy" data-magnetic="0.3">
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
          <ul className="cta-links reveal">
            <li>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                GitHub <Arrow dir="up-right" />
              </a>
            </li>
            <li>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn <Arrow dir="up-right" />
              </a>
            </li>
            <li>
              <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                Resume <Arrow dir="up-right" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <footer className="footer">
        <span>
          © 2026 {profile.first} {profile.last}
        </span>
        <span>Designed &amp; built in {profile.location.split(',')[0]}</span>
        <button type="button" onClick={() => scrollToTarget(0)} className="to-top" data-magnetic="0.4">
          <span data-magnetic-inner>Back to top ↑</span>
        </button>
      </footer>
    </section>
  );
}
