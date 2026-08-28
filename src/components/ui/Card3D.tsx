'use client';

import React, { useRef, useState } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glowColor?: string;
  enableGlow?: boolean;
}

export function Card3D({
  children,
  className = '',
  depth = 15,
  glowColor = 'rgba(10, 102, 194, 0.35)',
  enableGlow = true,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -depth;
    const rY = ((x - centerX) / centerX) * depth;

    setRotateX(rX);
    setRotateY(rY);
    setShinePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
      }}
      className="relative"
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.2s ease-out'
            : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease',
          transformStyle: 'preserve-3d',
        }}
        className={`relative overflow-hidden rounded-3xl ${className}`}
      >
        {/* Dynamic Specular 3D Gloss Highlight */}
        {enableGlow && isHovered && (
          <div
            style={{
              background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, ${glowColor} 0%, transparent 65%)`,
            }}
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 opacity-80 mix-blend-screen"
          />
        )}

        {/* Content with 3D Depth */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
