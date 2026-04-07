import { useEffect, useRef } from "react";

const WAVEFORM_BARS = 28;

export default function Hero() {
  const barsRef = useRef([]);

  useEffect(() => {
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      bar.style.animationDelay = `${(i * 0.08) % 1.2}s`;
      bar.style.animationDuration = `${0.8 + Math.random() * 0.8}s`;
    });
  }, []);

  return (
    <section className="relative pt-32 pb-10 px-4 sm:px-6 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Red ambient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-brand-red/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-brand-border bg-brand-card rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse-slow" />
          <span className="text-xs font-body text-brand-soft tracking-wide">
            YouTube · YouTube Music supported
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-800 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
          <span className="text-gradient">Download any</span>
          <br />
          <span className="text-white">YouTube playlist</span>
          <br />
          <span className="text-brand-red">in seconds.</span>
        </h1>

        <p className="text-brand-soft text-base sm:text-lg max-w-xl mx-auto mb-12 leading-relaxed font-body font-300">
          Paste a playlist URL, pick your format, hit download.
          <br className="hidden sm:block" />
          No ads. Just music.
        </p>

        {/* Animated waveform */}
        <div className="flex items-end justify-center gap-[3px] h-12 mb-10 opacity-40">
          {Array.from({ length: WAVEFORM_BARS }).map((_, i) => (
            <div
              key={i}
              ref={(el) => (barsRef.current[i] = el)}
              className="w-[3px] rounded-full bg-brand-red animate-bar origin-bottom"
              style={{ height: `${20 + Math.sin(i * 0.6) * 14 + Math.random() * 10}px` }}
            />
          ))}
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center">
          {[
            { val: "MP3", sub: "192kbps audio" },
            { val: "MP4", sub: "HD video" },
            { val: "FREE", sub: "Always" },
          ].map(({ val, sub }) => (
            <div key={val} className="flex flex-col items-center">
              <span className="font-display font-700 text-xl sm:text-2xl text-white">{val}</span>
              <span className="text-xs text-brand-muted mt-0.5">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
