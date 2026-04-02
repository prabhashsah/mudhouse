"use client";

import { useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=800";

interface SafeImageProps {
  src: string | undefined | null;
  alt: string;
  className?: string;
  /** Renders image to fill its parent (parent must be `position: relative`) */
  fill?: boolean;
  fallback?: string;
}

/**
 * A plain <img> wrapper that:
 * 1. Falls back to a placeholder if the src fails to load
 * 2. Fills parent if `fill` is true (mimicking next/image fill behavior)
 */
export default function SafeImage({ src, alt, className = "", fill = false, fallback = FALLBACK_IMAGE }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);
  const [errored, setErrored] = useState(false);

  const handleError = () => {
    if (!errored) {
      setErrored(true);
      setImgSrc(fallback);
    }
  };

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
