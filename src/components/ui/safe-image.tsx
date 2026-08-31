"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackTitle?: string;
}

export function SafeImage({ src, alt, fallbackTitle, className, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`w-full h-full bg-[#f7f6f2] flex flex-col items-center justify-center p-4 border border-border/60 text-center ${className || ""}`}>
        <div className="w-10 h-10 rounded-full bg-soft-green text-primary-green font-serif font-bold text-lg flex items-center justify-center mb-1">
          R
        </div>
        <span className="text-[11px] font-semibold text-muted-text line-clamp-1">
          {fallbackTitle || alt || "Ruchi Foodline"}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
