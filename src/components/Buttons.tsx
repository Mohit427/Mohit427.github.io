import type { ReactNode, MouseEvent } from 'react';

export const Arrow = ({ dir = 'right' }: { dir?: 'right' | 'up-right' | 'down' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`arrow arrow--${dir}`}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

type PillProps = {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'light' | 'ghost';
  external?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  icon?: 'right' | 'up-right' | 'down';
  download?: boolean;
};

/**
 * Pill CTA: a fill layer sweeps in from the left on hover (transform, not colour),
 * text inverts, and the arrow chip nudges forward. Magnetic via the cursor.
 */
export function Pill({ href, children, variant = 'solid', external, onClick, icon = 'right', download }: PillProps) {
  return (
    <a
      className={`pill pill--${variant}`}
      href={href}
      onClick={onClick}
      data-magnetic="0.3"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(download ? { download: '' } : {})}
    >
      <span className="pill-fill" aria-hidden="true" />
      <span className="pill-text" data-magnetic-inner>
        {children}
      </span>
      <span className="pill-icon" aria-hidden="true">
        <Arrow dir={icon} />
      </span>
    </a>
  );
}
