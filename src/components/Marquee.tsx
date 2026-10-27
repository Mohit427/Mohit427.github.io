import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '../lib/motion';
import { useImages } from '../hooks/useImage';
import { VoxelPortal } from './Voxel';

const PORTAL = '/nether-portal-nobg.png';

function Row({ items, outline }: { items: string[]; outline?: boolean }) {
  return (
    <div className={`mq-row ${outline ? 'mq-row--outline' : ''}`}>
      <div className="mq-track">
        {[0, 1].map((k) => (
          <ul key={k} aria-hidden={k === 1 || undefined}>
            {items.map((w) => (
              <li key={w}>
                {w}
                <i className="mq-sep" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Frame({ side, ok }: { side: 'l' | 'r'; ok: boolean }) {
  return (
    <div className={`mq-portal mq-portal--${side}`} aria-hidden="true">
      {ok ? <img src={PORTAL} alt="" /> : <VoxelPortal />}
    </div>
  );
}

type Props = { direction?: 'left' | 'right'; rows: [string[], string[]] };

/**
 * Two crisscrossing text rows that scroll "through" a portal at each edge.
 * Loops are GSAP tweens so scroll velocity can speed them up and flip them.
 */
export function Marquee({ direction = 'left', rows }: Props) {
  const root = useRef<HTMLElement>(null);
  const portal = useImages(PORTAL);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const tracks = gsap.utils.toArray<HTMLElement>('.mq-track', root.current);
      const base = direction === 'left' ? 1 : -1;
      const loops = tracks.map((t, i) => {
        const dir = (i === 0 ? 1 : -1) * base;
        return gsap.fromTo(
          t,
          { xPercent: dir > 0 ? 0 : -50 },
          { xPercent: dir > 0 ? -50 : 0, duration: i === 0 ? 34 : 40, ease: 'none', repeat: -1 },
        );
      });

      let flip = 1;
      const boost = { v: 1 };
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          flip = self.direction;
          const v = Math.min(Math.abs(self.getVelocity()) / 260, 5);
          gsap.to(boost, {
            v: 1 + v,
            duration: 0.2,
            overwrite: true,
            onUpdate: () => loops.forEach((l) => l.timeScale(boost.v * flip)),
            onComplete: () => gsap.to(boost, { v: 1, duration: 1.2, ease: 'power2.out', onUpdate: () => loops.forEach((l) => l.timeScale(boost.v * flip)) }),
          });
        },
      });

      // the band tilts in as it enters
      gsap.fromTo(
        '.mq-band',
        { rotate: direction === 'left' ? -4 : 4 },
        { rotate: direction === 'left' ? -1.5 : 1.5, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section className={`marquee ${direction === 'right' ? 'is--reversed-marquee' : ''}`} ref={root} aria-label="Things I work with">
      <div className="mq-band">
        <Frame side="l" ok={portal === 'ok'} />
        <Row items={rows[0]} />
        <Row items={rows[1]} outline />
        <Frame side="r" ok={portal === 'ok'} />
      </div>
    </section>
  );
}
