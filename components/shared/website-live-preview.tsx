'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { RiGlobalLine, RiLoader4Line, RiAlertLine } from '@remixicon/react';

interface WebsiteLivePreviewProps {
  /** URL of the demo website to embed */
  src: string;
  /** If provided, use an image with scroll effect instead of live iframe */
  thumbnailUrl?: string | null;
  alt?: string;
  /** Extra class on the outer wrapper */
  className?: string;
  /** Height of the visible container in px (default 220) */
  height?: number;
  /** Full height of the virtual iframe canvas in px (default 6000) */
  iframeHeight?: number;
  /** Controls if the live iframe should be rendered */
  active?: boolean;
}

/**
 * WebsiteLivePreview
 *
 * - If `thumbnailUrl` is set → renders an <img> that scrolls object-position
 *   from top → bottom on hover (fast, no network for the iframe).
 * - Otherwise → renders a scaled-down live iframe of `src`.
 *   On hover the iframe container animates translateY from 0 → bottom → 0,
 *   giving the "auto-scroll website" effect.
 *
 * The scale is computed dynamically from the container's actual width so the
 * iframe always fills the card regardless of screen size.
 */
export default function WebsiteLivePreview({
  src,
  thumbnailUrl,
  alt = 'Website preview',
  className = '',
  height = 220,
  iframeHeight = 6000,
  active = true,
}: WebsiteLivePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // lazy-load gate
  const [scale, setScale] = useState(0.22);

  // ── Lazy-load: only render iframe when the card is near viewport ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (isVisible) return; // already triggered

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  // ── Compute scale = containerWidth / 1440 (standard desktop) ──
  const computeScale = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    if (w > 0) setScale(w / 1440);
  }, []);

  useEffect(() => {
    computeScale();
    const ro = new ResizeObserver(computeScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [computeScale]);

  // ── IMAGE SCROLL mode (when thumbnail is available) ──
  if (thumbnailUrl) {
    return (
      <div className={`w-full overflow-hidden ${className}`} style={{ height }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl} alt={alt} className='w-full h-full object-cover object-top' />
      </div>
    );
  }

  // ── LIVE IFRAME SCROLL mode ──
  const iframeStyle: React.CSSProperties & { [key: string]: string | number } = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1440,
    height: iframeHeight,
    transformOrigin: 'top left',
    // Static transform
    transform: `scale(${scale}) translateY(0px)`,
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Loading shimmer (before IntersectionObserver fires) ── */}
      {!isVisible && active && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900/60'>
          <RiLoader4Line className='w-5 h-5 animate-pulse text-slate-400' />
        </div>
      )}

      {/* ── Live iframe ── */}
      {isVisible && active && (
        <div style={iframeStyle}>
          <iframe
            src={src}
            title={alt}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              pointerEvents: 'none',
              display: 'block',
            }}
            loading='lazy'
          />
        </div>
      )}

      {/* ── Bottom fade so the card edge looks clean ── */}
      <div
        className='absolute bottom-0 left-0 right-0 pointer-events-none z-10'
        style={{
          height: 32,
          background: 'linear-gradient(to top, rgba(15,23,42,0.5) 0%, transparent 100%)',
        }}
      />

      {/* ── Hover label ── */}
      {isHovered && isVisible && active && (
        <div className='absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 bg-black/70 text-white text-3xs font-extrabold px-2.5 py-1 rounded-full backdrop-blur-sm'>
          <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
          Live preview
        </div>
      )}

      {/* ── No src fallback ── */}
      {!src && (
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-slate-900/60'>
          <RiAlertLine className='w-7 h-7 text-slate-400' />
          <p className='text-xs text-slate-400 font-semibold'>Chưa có link demo</p>
        </div>
      )}

      {/* ── Empty src fallback: gradient ── */}
      {src && (!isVisible || !active) && (
        <div className='absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900' />
      )}

      {/* ── No thumbnail + no src: icon ── */}
      {!src && !thumbnailUrl && (
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
          <RiGlobalLine className='w-10 h-10 text-slate-600' />
        </div>
      )}
    </div>
  );
}
