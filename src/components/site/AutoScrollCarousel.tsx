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
  const resumeTimerRef = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(
    () => () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0 },
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

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
    if (
      !viewport ||
      !isVisible ||
      paused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let midpoint = viewport.scrollWidth / 2;
    const updateMidpoint = () => {
      if (viewport) midpoint = viewport.scrollWidth / 2;
    };
    window.addEventListener("resize", updateMidpoint, { passive: true });

    let frame = 0;
    let position = viewport.scrollLeft;
    const tick = () => {
      position += speed;
      if (midpoint > 0 && position >= midpoint) {
        position -= midpoint;
      }
      viewport.scrollLeft = position;
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateMidpoint);
    };
  }, [children.length, isVisible, paused, speed]);

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
