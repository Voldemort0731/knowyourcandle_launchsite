"use client";

import { useEffect, useRef } from "react";
import CompareDemo from "@/components/compare-demo";
import InfiniteMovingCardsDemo from "@/components/infinite-moving-cards-demo";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { StepCarousel } from "@/components/step-carousel";
import { GoogleLoginButton } from "@/components/google-login-button";
import { HeaderProfile } from "@/components/header-profile";

const ticks = [
  { s: "RELIANCE", p: "2,847.50", c: "+1.24%", u: true },
  { s: "TCS", p: "3,421.80", c: "+0.87%", u: true },
  { s: "NIFTY50", p: "22,147.35", c: "-0.32%", u: false },
  { s: "BTCUSDT", p: "67,234.00", c: "+2.14%", u: true },
  { s: "HDFCBANK", p: "1,643.20", c: "-0.61%", u: false },
  { s: "ETHUSDT", p: "3,547.80", c: "+1.78%", u: true },
  { s: "INFY", p: "1,478.55", c: "+0.43%", u: true },
  { s: "BANKNIFTY", p: "47,832.10", c: "-0.18%", u: false },
  { s: "SBIN", p: "782.30", c: "+0.95%", u: true },
  { s: "LTIM", p: "5,234.40", c: "-0.74%", u: false },
];


const pricingFeatures = [
  "All 23 candlestick patterns",
  "15s live refresh on open markets",
  "Equities, crypto, NSE, BSE, Binance",
  "Per-pattern toggles and signal filters",
  "Adjustable detection thresholds",
  "Subscription managed from extension",
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const handlePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 79900, currency: "INR" })
      });
      const order = await res.json();
      
      if (!order.order_id) throw new Error("Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Know Your Candle",
        description: "Monthly Subscription",
        order_id: order.order_id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful! Welcome aboard.");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#00ffa3"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed", response.error);
        alert("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Error initiating payment");
    }
  };

  useEffect(() => {
    const hero = heroRef.current;
    const card = cardRef.current;
    const title = titleRef.current;
    if (!hero || !card || !title) return;
    const heroEl = hero;
    const cardEl = card;
    const titleEl = title;

    function onScroll() {
      const rect = heroEl.getBoundingClientRect();
      const total = heroEl.offsetHeight - window.innerHeight;
      const prog = Math.max(0, Math.min(1, -rect.top / (total || 1)));
      const rotateX = 20 - prog * 20;
      const ty = -(prog * 80);

      cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg)`;
      titleEl.style.transform = `translateY(${ty}px)`;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-black text-[#c8d1dc]">
      <header className="sticky top-0 z-50 flex h-[80px] items-center justify-between border-b border-white/10 bg-black px-5 md:px-12">
        <div className="flex items-center gap-3 font-canela text-[24px] font-light tracking-normal text-white">
          <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain" />
          Know Your Candle
        </div>
        <div className="flex items-center gap-5">
          <HeaderProfile />
        </div>
      </header>

      <div className="border-b border-white/10 bg-black">
        <div className="flex h-[38px] overflow-hidden">
          <div className="flex shrink-0 items-center border-r border-white/10 bg-black px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#137d57]">
            MKT
          </div>
          <div className="flex flex-1 items-center overflow-hidden">
            <div className="flex w-max animate-scroll">
              {[...ticks, ...ticks].map((tick, index) => (
                <div
                  key={`${tick.s}-${index}`}
                  className="flex h-[38px] items-center gap-3 border-r border-white/10 px-6 font-mono text-[11px] whitespace-nowrap"
                >
                  <span className="font-semibold text-white">{tick.s}</span>
                  <span className="text-[#7e8fa3]">{tick.p}</span>
                  <span
                    className={
                      tick.u
                        ? "rounded bg-[#137d57]/12 px-1.5 py-0.5 text-[#137d57]"
                        : "rounded bg-[#e05555]/10 px-1.5 py-0.5 text-[#e05555]"
                    }
                  >
                    {tick.c}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section
        ref={heroRef}
        className="relative h-[180vh] border-b border-white/10 bg-black"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-black" />
          <ShootingStars
            className="opacity-80"
            starColor="#f5f7fa"
            minSpeed={9}
            maxSpeed={18}
            minDelay={1500}
            maxDelay={4200}
          />
          <StarsBackground
            className="opacity-75"
            starDensity={0.00018}
            allStarsTwinkle
          />
        </div>
        <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden px-5 pt-20 md:px-12">
          <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-between gap-12 py-12 md:flex-row md:items-end">
            <div ref={titleRef} className="max-w-[620px] will-change-transform">
              <div className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#137d57]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#137d57]" />
                Chrome Extension / TradingView / Real-time
              </div>
              <h1 className="max-w-[760px] text-left text-[clamp(40px,5.5vw,76px)] font-light leading-[1.1] tracking-[-0.02em] text-white">
                Read the candle.
                <br />
                <em className="not-italic text-[#137d57]">Before it moves.</em>
              </h1>
              <p className="mt-5 max-w-[100%] text-[17px] font-light leading-[1.7] text-[#7e8fa3]">
                Pattern detection from live OHLC data. No vision model. No manual
                scanning. 23 patterns marked directly on your chart the moment
                they form.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={handlePayment}
                  className="rounded-[8px] bg-[#00ffa3] px-12 py-5 text-[20px] font-bold text-black shadow-[0_0_20px_rgba(0,255,163,0.3)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#00e592] hover:shadow-[0_0_35px_rgba(0,255,163,0.5)]"
                >
                  Get Started for ₹799/mo
                </button>
                <a
                  href="#patterns"
                  className="rounded-[6px] border border-white/20 bg-transparent px-12 py-5 text-[20px] font-medium text-[#c8d1dc] transition-all duration-300 hover:border-white/40 hover:bg-white/[0.03] hover:text-white"
                >
                  View live patterns
                </a>
              </div>
            </div>

            <div className="max-w-[950px] flex-1">
              <div
                ref={cardRef}
                className="w-full rounded-[20px] border-2 border-[#3a3a3a] bg-black p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_9px_20px_rgba(0,0,0,0.29),0_37px_37px_rgba(0,0,0,0.26),0_84px_50px_rgba(0,0,0,0.15)] will-change-transform"
              >
                <CompareDemo />
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-[1400px] border-t border-white/10">
            <div className="flex-1 border-r border-white/10 pt-5 text-center">
              <span className="block font-mono text-[20px] font-semibold text-white md:text-[22px]">
                23
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-[#47566a]">
                Patterns
              </span>
            </div>
            <div className="flex-1 border-r border-white/10 pt-5 text-center">
              <span className="block font-mono text-[20px] font-semibold text-white md:text-[22px]">
                15s
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-[#47566a]">
                Refresh
              </span>
            </div>
            <div className="flex-1 border-r border-white/10 pt-5 text-center">
              <span className="block font-mono text-[20px] font-semibold text-white md:text-[22px]">
                0
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-[#47566a]">
                API Keys
              </span>
            </div>
            <div className="flex-1 pt-5 text-center">
              <span className="block font-mono text-[20px] font-semibold text-white md:text-[22px]">
                NSE+
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-[#47566a]">
                Markets
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="patterns" className="relative border-b border-white/10 bg-black px-5 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#137d57]">
            Pattern library
          </p>
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-[clamp(24px,3vw,40px)] font-light tracking-[-0.01em] text-white md:text-[40px]">
                23 patterns. All live.
              </h2>
              <p className="mt-3 max-w-[520px] text-[14px] font-light leading-[1.6] text-[#7e8fa3]">
                Pure math on OHLC candles. Every detection is deterministic: same
                data, same result.
              </p>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#47566a]">
              Hover to pause
            </div>
          </div>
          <InfiniteMovingCardsDemo />
        </div>
      </section>

      <StepCarousel />

      <section id="pricing" className="relative bg-black px-5 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#137d57]">
            Pricing
          </p>
          <h2 className="text-[clamp(24px,3vw,40px)] font-light tracking-[-0.01em] text-white md:text-[40px]">
            One plan. Everything included.
          </h2>
          <p className="mt-3 max-w-[520px] text-[14px] font-light leading-[1.6] text-[#7e8fa3]">
            No tiers. Cancel from the extension or below. Billed monthly via
            Razorpay.
          </p>

          <div className="mx-auto mt-12 grid max-w-[900px] overflow-hidden rounded-md border border-white/10 bg-black md:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-white/10 bg-black p-10 md:border-b-0 md:border-r">
              <div className="flex items-start text-[52px] font-light leading-none text-white">
                ₹ 799
              </div>
              <div className="mb-8 mt-2 font-mono text-[11px] uppercase tracking-[0.05em] text-[#47566a]">
                per month - cancel any time
              </div>
              <ul className="flex flex-col gap-3">
                {pricingFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-[13.5px] font-light text-[#c8d1dc]"
                  >
                    <span className="font-mono text-[#137d57]">-</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black p-10">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#47566a]">
                Sign in to subscribe
              </div>
              <div className="mt-4">
                <GoogleLoginButton />
              </div>
              <div className="mt-4 text-center font-mono text-[11px] text-[#47566a]">
                Sign in - subscribe - install - trade
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-center gap-6 border-t border-white/10 px-5 py-10 md:px-12 text-center">
        <div className="max-w-4xl text-[13px] leading-relaxed text-white">
          Know Your Candle displays technical indicators on trading charts. We do not provide trading signals, alerts, or financial advice. We do not guarantee the accuracy, availability, or timeliness of any data shown, and we have no access to or control over your trading account, funds, or broker. Use of any third-party platform or service is at your own risk. Trading involves significant risk, including losses greater than your initial investment. We have no access to or control over your capital, funds, or trading account. Trade at your own risk.
        </div>
        <div className="flex flex-col items-center gap-4 text-[13px] text-white">
          <div>
            To read the full policies, please click to view our{" "}
            <a className="underline transition hover:text-gray-300" href="https://drive.google.com/file/d/1EhjsaUFe0YMgLTm07uYvJvk9eUkJx49x/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
            {" "}or{" "}
            <a className="underline transition hover:text-gray-300" href="https://drive.google.com/file/d/1w73VNiycXD9RYhSBoG4MNvhFRmkMo3c0/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
          </div>
          <div className="flex gap-6">
            <a
              className="font-mono text-[13px] text-white transition hover:text-gray-300"
              href="mailto:fiwbai26@gmail.com"
            >
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
