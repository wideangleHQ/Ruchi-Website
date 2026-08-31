"use client";

import React, { useEffect, useState, useRef } from "react";

interface CounterItemProps {
  target: number;
  suffix: string;
  label: string;
  description: string;
}

function CounterItem({ target, suffix, label, description }: CounterItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(() => setCount(target), 0);
      return () => clearTimeout(timer);
    }

    let start = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <div ref={ref} className="text-center p-6 rounded-[12px] bg-white border border-border/60 shadow-xs">
      <div className="font-serif text-4xl sm:text-5xl font-bold text-primary-green tracking-tight mb-1">
        {count}
        {suffix}
      </div>
      <div className="text-base font-semibold text-text mb-1">{label}</div>
      <p className="text-xs text-muted-text max-w-xs mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export function StatsCounter() {
  const stats = [
    {
      target: 50,
      suffix: "+",
      label: "Years of Legacy",
      description: "Mastering the art of pure spice combinations since 1976.",
    },
    {
      target: 1000,
      suffix: "+",
      label: "Happy Customers",
      description: "Savoring authentic taste across generations of Indian homes.",
    },
    {
      target: 20,
      suffix: "+",
      label: "Categories",
      description: "Bringing authentic flavour, pasta & staples into your kitchen.",
    },
  ];

  return (
    <section className="py-16 bg-[#f7f6f2] border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <CounterItem key={idx} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
