const STEPS = [
  {
    num: "01",
    title: "Paste your URL",
    desc: "Copy the playlist link from YouTube or YouTube Music and paste it into the input field.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Choose your format",
    desc: "Pick MP3 for audio, MP4 for video, WAV for lossless quality, or 720p for HD video.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 003 12H1a11 11 0 0022 0h-2a10 10 0 00-1.93-7.07"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Hit download",
    desc: "Our server fetches every track and converts it to your chosen format automatically.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Save your music",
    desc: "Download the entire playlist as a ZIP file, neatly numbered and named. Done.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 sm:px-6 pb-24">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs text-brand-red font-display font-600 tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="font-display font-700 text-2xl sm:text-3xl text-white">
            Four steps. Zero friction.
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="bg-brand-card border border-brand-border rounded-2xl p-5 card-hover group"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red group-hover:bg-brand-red/20 transition-colors">
                  {step.icon}
                </div>
                <span className="font-display font-700 text-3xl text-brand-border select-none">
                  {step.num}
                </span>
              </div>

              <h3 className="font-display font-700 text-base text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-brand-soft leading-relaxed font-body font-300">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Supported formats row */}
        <div className="mt-10 border border-brand-border rounded-2xl p-5 sm:p-6 bg-brand-card">
          <p className="text-xs text-brand-muted uppercase tracking-widest font-display font-600 mb-4 text-center">
            Supported formats
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { fmt: "MP3", detail: "Audio · 192kbps", color: "text-orange-400" },
              { fmt: "MP4", detail: "Video · Best quality", color: "text-blue-400" },
              { fmt: "WAV", detail: "Audio · Lossless", color: "text-purple-400" },
              { fmt: "720p", detail: "Video · HD", color: "text-green-400" },
            ].map(({ fmt, detail, color }) => (
              <div key={fmt} className="py-3 px-4 rounded-xl bg-[#0f0f0f] border border-brand-border">
                <div className={`font-display font-700 text-lg ${color}`}>{fmt}</div>
                <div className="text-[11px] text-brand-muted mt-0.5">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
