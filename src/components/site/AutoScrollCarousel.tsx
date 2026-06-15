import { type ReactNode, useEffect, useRef, useState } from "react";

export function AutoScrollCarousel({
  children,
  label,
  speed = 0.28,
  className = "",
}: {
  children: ReactNode[];
  label: string;
  speed?: number;
  className?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(
    () => () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    },
    [],
  );

  const pauseForTouch = () => {
    setPaused(true);
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
  };

  const resumeAfterTouch = () => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => setPaused(false), 1200);
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;
    let position = viewport.scrollLeft;
    const tick = () => {
      const midpoint = viewport.scrollWidth / 2;
      position += speed;
      if (midpoint > 0 && position >= midpoint) {
        position -= midpoint;
      }
      viewport.scrollLeft = position;
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [paused, speed]);

  const items = [...children, ...children];

  return (
    <div
      ref={viewportRef}
      role="region"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={pauseForTouch}
      onPointerUp={resumeAfterTouch}
      onPointerCancel={resumeAfterTouch}
      className={`scrollbar-hidden touch-pan-x overflow-x-auto overscroll-x-contain ${className}`}
    >
      <div className="flex w-max gap-4 py-2">
        {items.map((child, index) => (
          <div key={index} aria-hidden={index >= children.length || undefined}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
