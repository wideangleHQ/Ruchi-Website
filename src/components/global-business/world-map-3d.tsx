"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import suppliedCountriesImg from "@/assets/Images/Global Buisness/Suplied Countries.png";

interface WorldMap3DProps {
  className?: string;
  priority?: boolean;
  maxTiltX?: number;
  maxTiltY?: number;
  maxMoveX?: number;
  maxMoveY?: number;
  perspective?: number;
}

/**
 * WorldMap3D — Reusable 3D interactive world map component.
 *
 * Features:
 * - Fluid 60/120fps requestAnimationFrame damped linear interpolation (LERP)
 * - Controlled perspective tilt around X & Y axes (±4–6° X, ±6–9° Y)
 * - Subtle lateral and vertical translation follow (8–16px)
 * - Gentle floating breathing oscillation when stationary or idle
 * - Smooth natural return-to-neutral upon pointer exit
 * - Preserves original transparency, green-and-gold lighting, and aspect ratio
 * - Full accessibility compliance with `prefers-reduced-motion: reduce`
 * - Clean presentation without artificial shadows or glare/shine overlays
 */
export function WorldMap3D({
  className = "",
  priority = false,
  maxTiltX = 5,
  maxTiltY = 7.5,
  maxMoveX = 14,
  maxMoveY = 10,
  perspective = 1200,
}: WorldMap3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Accessibility check: disable continuous motion if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const DAMPING = 0.085; // Liquid-smooth damping factor

    let isRunning = true;
    let rafId = 0;
    let time = 0;

    let targetX = 0;
    let targetY = 0;
    let isHovered = false;

    let currentX = 0;
    let currentY = 0;
    let currentZ = 0;
    let targetZ = 0;

    const renderLoop = () => {
      if (!isRunning) return;

      time += 0.016;

      // When not hovering, apply organic floating breathing oscillation
      let effectiveTargetX = targetX;
      let effectiveTargetY = targetY;

      if (!isHovered) {
        effectiveTargetX = Math.sin(time * 0.75) * 0.12;
        effectiveTargetY = Math.cos(time * 0.6) * 0.14;
      }

      // Smooth damped interpolation (LERP)
      currentX += (effectiveTargetX - currentX) * DAMPING;
      currentY += (effectiveTargetY - currentY) * DAMPING;
      currentZ += (targetZ - currentZ) * DAMPING;

      // 3D rotations & translations
      const rotateX = -currentY * maxTiltX;
      const rotateY = currentX * maxTiltY;
      const moveX = currentX * maxMoveX;
      const moveY = currentY * maxMoveY;

      // Apply 3D perspective transform with depth
      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg) translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, ${currentZ.toFixed(1)}px)`;

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const spanX = rect.width * 0.55;
      const spanY = rect.height * 0.55;

      const rawX = (e.clientX - centerX) / spanX;
      const rawY = (e.clientY - centerY) / spanY;

      targetX = Math.max(-1, Math.min(1, rawX));
      targetY = Math.max(-1, Math.min(1, rawY));
    };

    const handlePointerEnter = () => {
      isHovered = true;
      targetZ = 16; // Elevate slightly on Z-axis towards camera
    };

    const handlePointerLeave = () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
      targetZ = 0;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerenter", handlePointerEnter);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerenter", handlePointerEnter);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [maxTiltX, maxTiltY, maxMoveX, maxMoveY, perspective]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full cursor-grab active:cursor-grabbing select-none [perspective:1200px] ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      {/* 3D Transform Card Wrapper */}
      <div
        ref={cardRef}
        className="relative w-full aspect-[2/1] will-change-transform [transform-style:preserve-3d]"
      >
        <Image
          src={suppliedCountriesImg}
          alt="3D Global Countries Map highlighting RUCHI Foodline's international export markets"
          fill
          priority={priority}
          sizes="(min-width: 1280px) 720px, (min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
