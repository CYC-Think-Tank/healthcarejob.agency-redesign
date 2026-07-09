"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// How long each still photo stays on screen before crossfading to the next.
const PHOTO_DURATION_MS = 4000;

/**
 * Full-bleed hero background slideshow. Slide 0 is the video, which plays once;
 * when it ends the slideshow crossfades through each still photo (a few seconds
 * each) and then loops back to replay the video.
 *
 * Uses a single <video> with native `autoPlay` + `preload="metadata"` so it
 * starts without waiting on (and without its download blocking) the JS bundle.
 */
export default function HeroVideo({
  videoSrc,
  poster,
  photos,
}: {
  videoSrc: string;
  poster: string;
  photos: string[];
}) {
  // Slide index: 0 = video, 1..photos.length = photos.
  const [index, setIndex] = useState(0);
  const total = photos.length + 1;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (index === 0) {
      // Video slide: restart and play; advancement happens on `ended`.
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      return;
    }
    // Photo slide: advance to the next slide after a fixed duration.
    const timer = setTimeout(() => setIndex((i) => (i + 1) % total), PHOTO_DURATION_MS);
    return () => clearTimeout(timer);
  }, [index, total]);

  const base =
    "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out";

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="metadata"
        poster={poster}
        onEnded={() => setIndex(1 % total)}
        className={`${base} ${index === 0 ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {photos.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className={`${base} ${index === i + 1 ? "opacity-100" : "opacity-0"}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
