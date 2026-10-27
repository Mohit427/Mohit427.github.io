import { useEffect, useState } from 'react';

export type ImageState = 'loading' | 'ok' | 'missing';

/** Preloads one or more images; resolves to 'ok' only if every one loads. */
export function useImages(...srcs: string[]): ImageState {
  const key = srcs.join('|');
  const [state, setState] = useState<ImageState>('loading');

  useEffect(() => {
    let alive = true;
    setState('loading');
    Promise.all(
      key.split('|').map(
        (src) =>
          new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img.naturalWidth > 0);
            img.onerror = () => resolve(false);
            img.src = src;
          }),
      ),
    ).then((results) => {
      if (alive) setState(results.every(Boolean) ? 'ok' : 'missing');
    });
    return () => {
      alive = false;
    };
  }, [key]);

  return state;
}
