"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";

export const steps = [
  {
    num: "01",
    label: "INSTALL",
    title: "Add to Chrome",
    desc: "Install from the Chrome Web Store and subscribe with Google. Takes under two minutes.",
  },
  {
    num: "02",
    label: "OPEN",
    title: "Load any chart",
    desc: "Navigate to any symbol on TradingView. The overlay activates without any configuration.",
  },
  {
    num: "03",
    label: "DETECT",
    title: "Markers render",
    desc: "Pattern markers appear on every detected candle, refreshing every 15s during market hours.",
  },
  {
    num: "04",
    label: "TUNE",
    title: "Filter the noise",
    desc: "Toggle bullish, bearish, or neutral. Adjust doji sensitivity and wick multiplier from the popup.",
  },
];

export function StepCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 4 steps -> map [0, 1] to 0, 1, 2, 3
    if (latest < 0.25) setActiveIndex(0);
    else if (latest < 0.5) setActiveIndex(1);
    else if (latest < 0.75) setActiveIndex(2);
    else setActiveIndex(3);
  });

  const activeStep = steps[activeIndex];

  return (
    <section ref={containerRef} id="how" className="h-[400vh] relative bg-black border-b border-white/10">
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center px-5 py-24 md:px-12 overflow-hidden">
        <div className="mx-auto w-full max-w-5xl">
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#137d57] text-center">
            How it works
          </p>
          <h2 className="text-[clamp(24px,3vw,40px)] font-light tracking-[-0.01em] text-white md:text-[40px] text-center mb-16">
            Open TradingView. Patterns appear.
          </h2>

          <div 
            className="relative h-[350px] w-full max-w-3xl mx-auto flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, rotateX: 15, y: 60, scale: 0.9 }}
                animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, rotateX: -15, y: -60, scale: 0.9 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                className="absolute inset-0 w-full h-full rounded-2xl border border-white/10 bg-[#090c0f] p-8 md:p-14 flex flex-col justify-center"
                style={{
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
                }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#137d57]/10 border border-[#137d57]/30 font-mono text-sm text-[#137d57]">
                    {activeStep.num}
                  </div>
                  <div className="font-mono text-xs font-semibold tracking-widest text-[#137d57]">
                    {activeStep.label}
                  </div>
                </div>
                <h3 className="mb-4 text-4xl font-normal text-white">
                  {activeStep.title}
                </h3>
                <p className="text-xl text-[#7e8fa3] font-light leading-relaxed">
                  {activeStep.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Timeline / Progress indicators */}
          <div className="mt-16 flex justify-center gap-4">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === activeIndex ? "w-16 bg-[#137d57] shadow-[0_0_10px_rgba(19,125,87,0.5)]" : "w-6 bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
