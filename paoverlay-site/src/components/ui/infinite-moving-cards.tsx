"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export type InfiniteMovingCardItem = {
  code: string;
  name: string;
  signal: "Bullish" | "Bearish" | "Neutral";
  group: "Single" | "Two" | "Three";
};

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: InfiniteMovingCardItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) {
      return;
    }

    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      scrollerRef.current?.appendChild(item.cloneNode(true));
    });

    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse",
    );
    containerRef.current.style.setProperty(
      "--animation-duration",
      speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s",
    );
    setStart(true);
  }, [direction, speed]);

  const signalClasses = {
    Bullish: "border-emerald-400/35 bg-emerald-500/10 text-emerald-300",
    Bearish: "border-rose-400/35 bg-rose-500/10 text-rose-300",
    Neutral: "border-amber-400/35 bg-amber-500/10 text-amber-300",
  } as const;

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_16%,white_84%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-3",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[220px] max-w-full shrink-0 rounded-md border border-white/10 bg-black p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
            key={`${item.code}-${item.name}-${idx}`}
          >
            <div className="relative z-20 flex min-h-36 flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-2xl font-semibold tracking-tight text-zinc-50">
                  {item.code}
                </span>
                <span
                  className={cn(
                    "rounded border px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em]",
                    signalClasses[item.signal],
                  )}
                >
                  {item.signal}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold leading-5 text-zinc-100">
                  {item.name}
                </h3>
                <p className="mt-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                  {item.group}-candle
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
