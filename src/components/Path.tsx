import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/motion';
import { SectionLabel } from './About';
import { path } from '../content';

export function Path() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.path-line i',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.path-list', start: 'top 70%', end: 'bottom 60%', scrub: 0.4 } },
      );
      gsap.utils.toArray<HTMLElement>('.path-item').forEach((el) => {
        gsap.from(el.querySelectorAll('.path-when, .path-main > *'), {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: 'top 62%', toggleClass: 'is-lit' },
        });
      });
      gsap.from('.path-title .ch', {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.03,
        scrollTrigger: { trigger: '.path-title', start: 'top 85%' },
      });
    },
    { scope: root },
  );

  const title = 'The path so far';

  return (
    <section className="path" id="path" ref={root}>
      <div className="wrap">
        <SectionLabel n="03">Experience & education</SectionLabel>
        <h2 className="path-title" aria-label={title}>
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
        <ol className="path-list">
          <div className="path-line" aria-hidden="true">
            <i />
          </div>
          {path.map((p) => (
            <li className="path-item" key={p.title}>
              <span className="path-dot" aria-hidden="true" />
              <span className="path-when">{p.when}</span>
              <div className="path-main">
                <h3>{p.title}</h3>
                <span className="path-where">{p.where}</span>
                <p>{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
