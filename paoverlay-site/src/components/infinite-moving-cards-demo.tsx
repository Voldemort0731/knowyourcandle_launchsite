"use client";

import {
  InfiniteMovingCardItem,
  InfiniteMovingCards,
} from "@/components/ui/infinite-moving-cards";

const patterns: InfiniteMovingCardItem[] = [
  { code: "HAM", name: "Hammer", signal: "Bullish", group: "Single" },
  { code: "HM", name: "Hanging Man", signal: "Bearish", group: "Single" },
  { code: "SS", name: "Shooting Star", signal: "Bearish", group: "Single" },
  { code: "IH", name: "Inv. Hammer", signal: "Bullish", group: "Single" },
  { code: "DOJ", name: "Doji", signal: "Neutral", group: "Single" },
  { code: "GD", name: "Gravestone Doji", signal: "Bearish", group: "Single" },
  { code: "DD", name: "Dragonfly Doji", signal: "Bullish", group: "Single" },
  { code: "LLD", name: "Long-legged Doji", signal: "Neutral", group: "Single" },
  { code: "MBZ", name: "Bull Marubozu", signal: "Bullish", group: "Single" },
  { code: "MBZ-", name: "Bear Marubozu", signal: "Bearish", group: "Single" },
  { code: "ST", name: "Spinning Top", signal: "Neutral", group: "Single" },
  { code: "BE", name: "Bull Engulfing", signal: "Bullish", group: "Two" },
  { code: "BE-", name: "Bear Engulfing", signal: "Bearish", group: "Two" },
  { code: "BH", name: "Bull Harami", signal: "Bullish", group: "Two" },
  { code: "BH-", name: "Bear Harami", signal: "Bearish", group: "Two" },
  { code: "TT", name: "Tweezer Tops", signal: "Bearish", group: "Two" },
  { code: "TB", name: "Tweezer Bottoms", signal: "Bullish", group: "Two" },
  { code: "PL", name: "Piercing Line", signal: "Bullish", group: "Two" },
  { code: "DCC", name: "Dark Cloud Cover", signal: "Bearish", group: "Two" },
  { code: "MS", name: "Morning Star", signal: "Bullish", group: "Three" },
  { code: "ES", name: "Evening Star", signal: "Bearish", group: "Three" },
  { code: "3WS", name: "3 White Soldiers", signal: "Bullish", group: "Three" },
  { code: "3BC", name: "3 Black Crows", signal: "Bearish", group: "Three" },
];

export default function InfiniteMovingCardsDemo() {
  const firstRow = patterns.slice(0, 12);
  const secondRow = patterns.slice(12);

  return (
    <div className="relative overflow-hidden border border-white/10 bg-black py-4 [mask-image:linear-gradient(to_right,transparent,white_8%,white_92%,transparent)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="relative z-10 flex flex-col gap-1">
        <InfiniteMovingCards items={firstRow} direction="left" speed="slow" />
        <InfiniteMovingCards items={secondRow} direction="right" speed="slow" />
      </div>
    </div>
  );
}
