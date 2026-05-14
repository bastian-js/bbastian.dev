import React, { useEffect, useRef, ReactNode } from "react";

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
}

const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  strength = 0.38,
  className,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const targetPos = { x: 0, y: 0 };
    const currentPos = { x: 0, y: 0 };
    let rafId: number;
    let isNear = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.max(rect.width, rect.height) * 1.5;

      if (dist < radius) {
        const factor = (1 - dist / radius) * strength;
        targetPos.x = dx * factor;
        targetPos.y = dy * factor;
        isNear = true;
      } else {
        targetPos.x = 0;
        targetPos.y = 0;
        isNear = false;
      }
    };

    const animate = () => {
      const ease = isNear ? 0.14 : 0.08;
      currentPos.x += (targetPos.x - currentPos.x) * ease;
      currentPos.y += (targetPos.y - currentPos.y) * ease;

      const x = Math.abs(currentPos.x) < 0.01 ? 0 : currentPos.x;
      const y = Math.abs(currentPos.y) < 0.01 ? 0 : currentPos.y;
      el.style.transform = `translate(${x}px, ${y}px)`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      el.style.transform = "";
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ display: "inline-block", ...style }}>
      {children}
    </div>
  );
};

export default MagneticWrapper;
