import { useEffect, useRef } from 'react';

export default function CursorSparkle() {
  const sparkleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    let animationFrame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        root.style.setProperty('--pointer-x', `${event.clientX}px`);
        root.style.setProperty('--pointer-y', `${event.clientY}px`);
        sparkleRef.current?.setAttribute('data-visible', 'true');
      });
    };

    const handlePointerLeave = () => {
      sparkleRef.current?.setAttribute('data-visible', 'false');
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      root.style.removeProperty('--pointer-x');
      root.style.removeProperty('--pointer-y');
    };
  }, []);

  return (
    <div ref={sparkleRef} aria-hidden="true" className="cursor-sparkle" data-visible="false" />
  );
}
