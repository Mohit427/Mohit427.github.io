// Procedural voxel art used as stand-ins until the generated images land in /public.
// Every piece is deterministic (seeded) so it never flickers between renders.
import { useId, useMemo } from 'react';

type Cell = { x: number; y: number; c: string; o?: number; s?: number };

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const pick = <T,>(r: () => number, arr: T[]) => arr[Math.floor(r() * arr.length)];

function Cells({ cells, size, className, vb, glow }: { cells: Cell[]; size: number; className?: string; vb: [number, number]; glow?: boolean }) {
  const id = 'g' + useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox={`0 0 ${vb[0] * size} ${vb[1] * size}`} aria-hidden="true" shapeRendering="crispEdges">
      {glow && (
        <defs>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={size * 0.6} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      <g filter={glow ? `url(#${id})` : undefined}>
        {cells.map((p, i) => {
          const s = (p.s ?? 1) * size;
          const off = (size - s) / 2;
          return <rect key={i} x={p.x * size + off} y={p.y * size + off} width={s} height={s} fill={p.c} opacity={p.o ?? 1} />;
        })}
      </g>
    </svg>
  );
}

/* ---------------- Avatar ---------------- */

const AW = 26;
const AH = 30;

function avatarCells(flame: boolean): Cell[] {
  const r = rng(flame ? 77 : 42);
  const cells: Cell[] = [];
  const body = new Set<string>();
  const skin = ['#C4936F', '#BC8A66', '#C99B78', '#B98563'];
  const hair = ['#231C2C', '#2B2236', '#1C1724'];
  const hood = ['#2E2840', '#29233A', '#332C47'];
  const shades = ['#120F19', '#1A1524'];

  for (let y = 0; y < AH; y++) {
    for (let x = 0; x < AW; x++) {
      const hx = (x + 0.5 - 13) / 6.6;
      const hy = (y + 0.5 - 11.5) / 8;
      const inHead = hx * hx + hy * hy <= 1;
      const inHair = inHead && (y < 7 || (y < 10 && (x < 8 || x > 17)));
      const inNeck = y >= 18 && y < 21 && x >= 10 && x <= 15;
      const inBody = y >= 20 && Math.abs(x + 0.5 - 13) <= 5.5 + (y - 20) * 1.55;
      let c = '';
      if (inHair) c = pick(r, hair);
      else if (inHead) {
        c = pick(r, skin);
        if (y >= 11 && y <= 12 && x >= 8 && x <= 17 && x !== 12 && x !== 13) c = pick(r, shades);
        if (y === 11 && (x === 12 || x === 13)) c = '#120F19';
        if (y >= 15 && y <= 17 && x >= 10 && x <= 15 && (y > 15 || x === 10 || x === 15)) c = pick(r, hair); // goatee + moustache
      } else if (inNeck) c = pick(r, skin);
      else if (inBody) {
        c = pick(r, hood);
        if (y >= 21 && y <= 24 && Math.abs(x + 0.5 - 13) < 4 - (y - 21) * 0.6) c = '#3B3352'; // hood collar
      }
      if (c) {
        cells.push({ x, y, c });
        body.add(`${x},${y}`);
      }
    }
  }

  if (!flame) return cells;

  // glowing eyes through the shades
  for (const [x, y] of [[9, 11], [10, 11], [15, 11], [16, 11]]) cells.push({ x, y, c: '#E9FBFF' });

  // flames hugging the silhouette and engulfing the hair
  const flameCols = ['#7C4DFF', '#9B7BFF', '#5B6CFF', '#3FC8FF', '#B9A3FF', '#62E3FF'];
  const near = (x: number, y: number) => {
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (body.has(`${x + dx},${y + dy}`)) return true;
    return false;
  };
  for (let y = 0; y < AH; y++) {
    for (let x = 0; x < AW; x++) {
      if (body.has(`${x},${y}`)) {
        // licks of flame over hair and shoulders
        const top = y < 8 || (y >= 20 && y <= 23);
        if (top && r() < 0.32) cells.push({ x, y, c: pick(r, flameCols), o: 0.85 });
        continue;
      }
      if (!near(x, y)) continue;
      const rise = y < 12 ? 0.62 : y > 19 ? 0.5 : 0.28;
      if (r() < rise) cells.push({ x, y, c: pick(r, flameCols), o: 0.55 + r() * 0.45 });
    }
  }
  // floating particles
  for (let i = 0; i < 38; i++) {
    cells.push({ x: Math.floor(r() * AW), y: Math.floor(r() * 22), c: pick(r, [...flameCols, '#FF9F5A']), o: 0.5 + r() * 0.5, s: 0.35 + r() * 0.35 });
  }
  return cells;
}

export function VoxelAvatar({ flame = false, className }: { flame?: boolean; className?: string }) {
  const cells = useMemo(() => avatarCells(flame), [flame]);
  return <Cells cells={cells} size={10} vb={[AW, AH]} className={className} glow={flame} />;
}

/* ---------------- Portal ---------------- */

export function VoxelPortal({ className }: { className?: string }) {
  const cells = useMemo(() => {
    const r = rng(9);
    const out: Cell[] = [];
    const obs = ['#2B2040', '#352850', '#211833', '#3E2F5E'];
    const energy = ['#8A5CFF', '#A985FF', '#6E3CF0', '#C3AEFF', '#7B4BFF'];
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 5; x++) {
        const frame = x === 0 || x === 4 || y === 0 || y === 6;
        out.push({ x, y, c: frame ? pick(r, obs) : pick(r, energy), o: frame ? 1 : 0.7 + r() * 0.3 });
      }
    for (let i = 0; i < 10; i++) out.push({ x: 1 + r() * 2.6, y: 1 + r() * 4.6, c: '#E8DEFF', o: 0.8, s: 0.25 });
    return out;
  }, []);
  return <Cells cells={cells} size={20} vb={[5, 7]} className={className} glow />;
}

/* ---------------- Pixel maps ---------------- */

function fromMap(rows: string[], palette: Record<string, string[]>, seed: number): Cell[] {
  const r = rng(seed);
  const out: Cell[] = [];
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const p = palette[ch];
      if (p) out.push({ x, y, c: pick(r, p) });
    }),
  );
  return out;
}

const BOOK = [
  '..............',
  '.s..........s.',
  '...pppp.pppp..',
  '..pggggpggggp.',
  '..pglgggglggp.',
  '..pggggpggggp.',
  '..pgglgpglggp.',
  '..pggggpggggp.',
  '..ccccccccccc.',
  '.ccccccccccccc',
  '.wwwwwwwwwwwww',
  '.wbwwwwwwwwbww',
  '.wwwwwwwwwwwww',
];

export function VoxelBook({ className }: { className?: string }) {
  const cells = useMemo(
    () =>
      fromMap(
        BOOK,
        {
          p: ['#EDE6FF', '#F6F1FF'],
          g: ['#C9B4FF', '#B79CFF', '#D8C9FF'],
          l: ['#7C4DFF'],
          c: ['#6B3CF5', '#7C4DFF', '#5A2FE0'],
          w: ['#8A5A3C', '#7A4E33', '#94643F'],
          b: ['#3FC8FF'],
          s: ['#B79CFF'],
        },
        5,
      ),
    [],
  );
  return <Cells cells={cells} size={10} vb={[14, 13]} className={className} glow />;
}

const LLAMA = [
  '..ee........ee..',
  '..ee........ee..',
  '..wwwwwwwwwwww..',
  '..wwwwwwwwwwww..',
  '..wkkwwwwwwkkw..',
  '..wwwwwwwwwwww..',
  '...wwssssssww...',
  '...wwsnssnsww...',
  '...wwssssssww...',
  '....wwwwwwww....',
  '....wwwwwwww....',
  '....wwwwwwww....',
  '..wwwwwwwwwwww..',
  '.wwwwvvuuvvwwww.',
  '.wwwvuvvvvuvwww.',
  '.wwwwvvuuvvwwww.',
  '.wwwwwwwwwwwwww.',
  '.ww.ww....ww.ww.',
  '.ww.ww....ww.ww.',
  '.gg.gg....gg.gg.',
];

export function VoxelLlama({ className }: { className?: string }) {
  const cells = useMemo(
    () =>
      fromMap(
        LLAMA,
        {
          e: ['#E3D6C2', '#DCCDB6'],
          w: ['#F4ECDF', '#EFE5D5', '#F8F2E8', '#E9DECB'],
          k: ['#2A2233'],
          s: ['#D7C6AC', '#CFBC9F'],
          n: ['#5E4E40'],
          v: ['#7C4DFF', '#6B3CF5'],
          u: ['#3FC8FF', '#62E3FF'],
          g: ['#8C7B68'],
        },
        11,
      ),
    [],
  );
  return <Cells cells={cells} size={10} vb={[16, 20]} className={className} />;
}

export function VoxelCloud({ className, seed = 3 }: { className?: string; seed?: number }) {
  const cells = useMemo(() => {
    const r = rng(seed);
    const out: Cell[] = [];
    for (let y = 0; y < 5; y++)
      for (let x = 0; x < 14; x++) {
        const dx = (x - 6.5) / 7;
        const dy = (y - 3) / (y < 3 ? 3 : 2);
        const bump = Math.sin(x * 1.3 + seed) * 0.25;
        if (dx * dx + dy * dy < 1 + bump) out.push({ x, y, c: y > 3 ? '#E4DCF7' : pick(r, ['#FFFFFF', '#FBF9FF', '#F3EEFF']) });
      }
    return out;
  }, [seed]);
  return <Cells cells={cells} size={12} vb={[14, 5]} className={className} />;
}

/* ---------------- Landscape (contact background) ---------------- */

export function VoxelRidge({ seed, color, height, className }: { seed: number; color: string; height: number; className?: string }) {
  const cells = useMemo(() => {
    const r = rng(seed);
    const out: Cell[] = [];
    const W = 64;
    let h = height * 0.5;
    for (let x = 0; x < W; x++) {
      const peak = Math.sin((x / W) * Math.PI * 2 + seed) * height * 0.28 + Math.sin(x * 0.37 + seed * 3) * height * 0.12;
      h += (height * 0.55 + peak - h) * 0.35 + (r() - 0.5) * 1.6;
      const top = Math.max(1, Math.round(h));
      for (let y = height - top; y < height; y++) out.push({ x, y, c: color, o: y === height - top ? 0.92 : 1 });
    }
    return out;
  }, [seed, color, height]);
  return (
    <svg className={className} viewBox={`0 0 ${64 * 10} ${height * 10}`} preserveAspectRatio="none" aria-hidden="true" shapeRendering="crispEdges">
      {cells.map((p, i) => (
        <rect key={i} x={p.x * 10} y={p.y * 10} width={10.5} height={10.5} fill={p.c} opacity={p.o} />
      ))}
    </svg>
  );
}

/* ---------------- Embers (overlay for the photo portrait) ---------------- */

/**
 * Glowing voxel embers drawn in the portrait's own coordinate space (900 x 1377),
 * so they line up with the photo under object-fit: contain + bottom anchoring.
 */
export function VoxelEmbers({ className }: { className?: string }) {
  const id = 'e' + useId().replace(/:/g, '');
  const embers = useMemo(() => {
    const r = rng(23);
    const cols = ['#7C4DFF', '#9B7BFF', '#5B6CFF', '#3FC8FF', '#62E3FF', '#C9B8FF', '#FF9F5A'];
    const out: { x: number; y: number; s: number; c: string; d: number; t: number }[] = [];
    for (let i = 0; i < 90; i++) {
      // upper arc around the hair and temples, plus the shoulder line; never over the face
      const shoulders = i > 66;
      let x: number, y: number;
      if (shoulders) {
        const side = r() < 0.5 ? -1 : 1;
        x = 450 + side * (300 + r() * 160);
        y = 900 - r() * 160;
      } else {
        const a = -Math.PI - 0.35 + r() * (Math.PI + 0.7); // from the left temple, over the top, to the right temple
        const rx = 340 + r() * 120;
        const ry = 380 + r() * 110;
        x = 450 + Math.cos(a) * rx;
        y = 470 + Math.sin(a) * ry - Math.max(0, -Math.sin(a)) * 60;
      }
      out.push({
        x,
        y,
        s: 10 + r() * 22,
        c: cols[Math.floor(r() * cols.length)],
        d: -r() * 4,
        t: 2.6 + r() * 2.4,
      });
    }
    return out;
  }, []);
  return (
    <svg className={className} viewBox="0 0 900 1377" preserveAspectRatio="xMidYMax meet" aria-hidden="true" shapeRendering="crispEdges">
      <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id})`}>
        {embers.map((e, i) => (
          <rect
            key={i}
            className="ember"
            x={e.x}
            y={e.y}
            width={e.s}
            height={e.s}
            fill={e.c}
            style={{ animationDelay: `${e.d}s`, animationDuration: `${e.t}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
