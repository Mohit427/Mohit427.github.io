import { useRef } from 'react';
import { gsap, useGSAP, reducedMotion } from '../lib/motion';
import { about, toolkit, certifications } from '../content';

export function SectionLabel({ n, children }: { n: string; children: string }) {
  return (
    <div className="section-label" data-reveal>
      <span>({n})</span>
      <span>{children}</span>
    </div>
  );
}

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = reducedMotion();
      const words = gsap.utils.toArray<HTMLElement>('.st-word');

      // statement fills word by word while the block is pinned
      if (!reduce) {
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.about-pin',
              start: 'top top',
              end: '+=110%',
              scrub: 0.5,
              pin: true,
              anticipatePin: 1,
            },
          },
        );
        gsap.to('.about-orb', {
          yPercent: -60,
          rotate: 40,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }

      // counters
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count);
        const dec = Number(el.dataset.dec || 0);
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: reduce ? 0 : 1.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: () => (el.textContent = o.v.toFixed(dec)),
        });
      });

      gsap.from('.stat', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.stats', start: 'top 85%' },
      });
      gsap.from('.tk-row', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: '.toolkit', start: 'top 85%' },
      });
    },
    { scope: root },
  );

  return (
    <section className="about" id="about" ref={root}>
      <div className="about-orb" aria-hidden="true" />
      <div className="about-pin">
        <div className="wrap">
          <SectionLabel n="01">About</SectionLabel>
          <p className="about-statement">
            {about.statement.split(' ').map((w, i) => (
              <span className="st-word" key={i}>
                {w}{' '}
              </span>
            ))}
          </p>
          <dl className="facts">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="wrap">
        <ul className="stats">
          {about.stats.map((s) => (
            <li className="stat" key={s.label}>
              <b>
                <span data-count={s.value} data-dec={s.decimals}>
                  {s.value.toFixed(s.decimals)}
                </span>
                <sup>{s.suffix}</sup>
              </b>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>

        <div className="toolkit">
          <h3 className="toolkit-title">Toolkit</h3>
          <ul>
            {toolkit.map((t) => (
              <li className="tk-row" key={t.group}>
                <span className="tk-group">{t.group}</span>
                <span className="tk-items">
                  {t.items.map((i) => (
                    <span className="chip" key={i}>
                      {i}
                    </span>
                  ))}
                </span>
              </li>
            ))}
            <li className="tk-row">
              <span className="tk-group">Certified</span>
              <span className="tk-items">
                {certifications.map((c) => (
                  <span className="chip chip--violet" key={c}>
                    {c}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
