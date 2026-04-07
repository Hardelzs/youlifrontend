import { useState, useRef, useEffect } from "react";
import music from "../assets/music.png";
import mp4 from "../assets/mp4.png";
import wav from "../assets/wav.png";
import p from "../assets/p.png";

const API = import.meta.env.VITE_API_URL 

const FORMATS = [
  { id: "mp3", label: "MP3", sub: "192kbps", icon: music },
  { id: "mp4", label: "MP4", sub: "Best quality", icon: mp4 },
  { id: "wav", label: "WAV", sub: "Lossless", icon: wav }, 
  { id: "720p", label: "720p", sub: "HD video", icon: p },
];

function StatusDot({ status }) {
  if (status === "done") return <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />;
  if (status === "downloading") return <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse-slow flex-shrink-0" />;
  return <span className="w-2 h-2 rounded-full bg-brand-border flex-shrink-0" />;
}

function formatDuration(secs) {
  if (!secs) return "";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function DownloadSection() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp3");
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [error, setError] = useState("");
  const [jobId, setJobId] = useState(null);
  const inputRef = useRef(null);
  const pollRef = useRef(null);

  const isValidUrl = (u) =>
    /youtube\.com\/playlist\?list=|music\.youtube\.com\/playlist\?list=|youtube\.com\/watch\?.*list=/.test(u);

  const handleFetchInfo = async () => {
    if (!url.trim()) { setError("Please paste a YouTube playlist URL."); inputRef.current?.focus(); return; }
    if (!isValidUrl(url)) { setError("That doesn't look like a valid YouTube playlist URL."); inputRef.current?.focus(); return; }
    setError(""); setPhase("fetching-info"); setPlaylistInfo(null); setTracks([]); setProgress(0);
    try {
      const res = await fetch(`${API}/info?url=${encodeURIComponent(url)}`);
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || "Failed to fetch playlist info."); }
      const data = await res.json();
      setPlaylistInfo(data);
      setTracks(data.tracks.map((t) => ({ ...t, status: "pending" })));
      setPhase("confirming");
    } catch (e) { setError(e.message); setPhase("idle"); }
  };

  const handleStartDownload = async () => {
    setPhase("starting"); setProgress(0);
    try {
      const res = await fetch(`${API}/start?url=${encodeURIComponent(url)}&fmt=${format}`, { method: "POST" });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || "Failed to start download."); }
      const { job_id } = await res.json();
      setJobId(job_id); setPhase("downloading");
      pollRef.current = setInterval(async () => {
        try {
          const r = await fetch(`${API}/status/${job_id}`);
          if (!r.ok) return;
          const job = await r.json();
          setProgress(job.progress || 0);
          if (job.done > 0) {
            setTracks((prev) => prev.map((t, i) => ({
              ...t,
              status: i < job.done ? "done" : i === job.done ? "downloading" : "pending",
            })));
          }
          if (job.status === "done") {
            clearInterval(pollRef.current); setPhase("done"); setProgress(100);
            setTracks((prev) => prev.map((t) => ({ ...t, status: "done" })));
          }
          if (job.status === "error") { clearInterval(pollRef.current); setError(job.error || "Something went wrong."); setPhase("error"); }
        } catch {}
      }, 1500);
    } catch (e) { setError(e.message); setPhase("confirming"); }
  };

  const handleSaveZip = () => {
  if (!jobId) return;
  const link = document.createElement("a");
  link.href = `${API}/file/${jobId}`;
  link.download = "playlist.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const handleReset = async () => {
    clearInterval(pollRef.current);
    if (jobId) fetch(`${API}/job/${jobId}`, { method: "DELETE" }).catch(() => {});
    setPhase("idle"); setProgress(0); setTracks([]); setUrl(""); setError(""); setJobId(null); setPlaylistInfo(null);
  };

  useEffect(() => () => clearInterval(pollRef.current), []);
  const doneTracks = tracks.filter((t) => t.status === "done").length;

  return (
    <section className="px-4 sm:px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${phase === "downloading" ? "bg-brand-red animate-pulse-slow" : phase === "done" ? "bg-green-500" : "bg-brand-red"}`} />
              <span className="font-display font-600 text-sm text-white tracking-wide">Download Playlist</span>
            </div>
            {phase !== "idle" && (
              <button onClick={handleReset} className="text-xs text-brand-muted hover:text-white transition-colors">← Start over</button>
            )}
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <label className="text-xs text-brand-soft font-body mb-2 block">Playlist URL</label>
              <div className={`flex items-center gap-2 bg-[#0f0f0f] border rounded-xl px-4 py-3 transition-all duration-200 ${error ? "border-red-500/60" : phase === "idle" ? "border-brand-border focus-within:border-brand-red/50" : "border-brand-border opacity-60"}`}>
                <svg className="w-4 h-4 text-brand-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                <input ref={inputRef} type="text" value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && phase === "idle" && handleFetchInfo()}
                  placeholder="https://www.youtube.com/playlist?list=..."
                  disabled={phase !== "idle"}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-brand-muted outline-none disabled:opacity-50 font-mono" />
                {url && phase === "idle" && (
                  <button onClick={() => { setUrl(""); setError(""); }} className="text-brand-muted hover:text-white transition-colors">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
              {error && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-fade-up">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  {error}
                </p>
              )}
            </div>

            {(phase === "idle" || phase === "confirming") && (
              <div>
                <label className="text-xs text-brand-soft font-body mb-2 block">Format</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FORMATS.map((f) => (
                    <button key={f.id} onClick={() => setFormat(f.id)}
                      className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-center transition-all duration-150 ${format === f.id ? "border-brand-red/60 bg-brand-red/10 text-white" : "border-brand-border bg-[#0f0f0f] text-brand-soft hover:text-white"}`}>
                        <span><img src={f.icon} alt="" className="w-10 h-10"/></span>
                      <span className="font-display font-700 text-sm">{f.label}</span>
                      <span className="text-[10px] text-brand-muted">{f.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {phase === "confirming" && playlistInfo && (
              <div className="animate-fade-up bg-[#0f0f0f] border border-brand-border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-display font-600 text-white truncate">{playlistInfo.title}</p>
                  <p className="text-xs text-brand-muted mt-0.5">{playlistInfo.track_count} tracks{playlistInfo.uploader ? ` · ${playlistInfo.uploader}` : ""}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-brand-red"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                </div>
              </div>
            )}

            {(phase === "downloading" || phase === "done" || phase === "starting") && (
              <div className="animate-fade-up space-y-2">
                <div className="flex justify-between text-xs text-brand-soft">
                  <span>{phase === "starting" ? "Starting..." : phase === "done" ? "All done!" : `${doneTracks} of ${tracks.length} tracks`}</span>
                  <span className="font-mono">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {phase === "fetching-info" && (
              <div className="animate-fade-up flex items-center gap-3 py-2">
                <div className="flex gap-1">
                  {[0,1,2].map((i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-red animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
                <span className="text-sm text-brand-soft">Fetching playlist info...</span>
              </div>
            )}

            <div className="flex gap-3">
              {phase === "idle" && (
                <button onClick={handleFetchInfo} className="flex-1 flex items-center justify-center gap-2 bg-brand-red hover:bg-red-600 active:scale-[0.98] text-white font-display font-700 text-sm rounded-xl py-3.5 transition-all duration-150">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  Fetch Playlist
                </button>
              )}
              {phase === "confirming" && (
                <button onClick={handleStartDownload} className="flex-1 flex items-center justify-center gap-2 bg-brand-red hover:bg-red-600 active:scale-[0.98] text-white font-display font-700 text-sm rounded-xl py-3.5 transition-all duration-150">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  Download {tracks.length} Tracks
                </button>
              )}
              {(phase === "fetching-info" || phase === "starting" || phase === "downloading") && (
                <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-2 border border-brand-border text-brand-soft hover:text-white font-display font-600 text-sm rounded-xl py-3.5 transition-all duration-150">Cancel</button>
              )}
              {phase === "done" && (
                <>
                  <button onClick={handleSaveZip} className="flex-1 flex items-center justify-center gap-2 bg-brand-red hover:bg-red-600 active:scale-[0.98] text-white font-display font-700 text-sm rounded-xl py-3.5 transition-all duration-150">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Save as ZIP
                  </button>
                  <button onClick={handleReset} className="px-4 flex items-center justify-center border border-brand-border text-brand-soft hover:text-white font-display font-600 text-sm rounded-xl transition-all duration-150">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8M3 3v5h5M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16m18 0v-5h-5"/></svg>
                  </button>
                </>
              )}
              {phase === "error" && (
                <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-2 border border-brand-border text-brand-soft hover:text-white font-display font-600 text-sm rounded-xl py-3.5 transition-all duration-150">Try Again</button>
              )}
            </div>
          </div>
        </div>

        {tracks.length > 0 && (
          <div className="mt-4 bg-brand-card border border-brand-border rounded-2xl overflow-hidden animate-fade-up">
            <div className="px-5 py-3.5 border-b border-brand-border flex items-center justify-between">
              <span className="text-xs text-brand-soft font-display font-600 tracking-wide uppercase">Tracks — {tracks.length} songs</span>
              <span className="text-xs text-brand-muted font-mono">{doneTracks}/{tracks.length} ready</span>
            </div>
            <div className="divide-y divide-brand-border max-h-72 overflow-y-auto">
              {tracks.map((track, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <StatusDot status={track.status} />
                  <span className="text-xs text-brand-muted font-mono w-5 flex-shrink-0">{String(track.index || i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-sm text-white truncate font-body">{track.title}</span>
                  {track.duration && <span className="text-xs text-brand-muted font-mono flex-shrink-0">{formatDuration(track.duration)}</span>}
                  {track.status === "done" && (
                    <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M5 13l4 4L19 7"/></svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-brand-muted mt-6 leading-relaxed max-w-md mx-auto">
          For personal use only. Downloading copyrighted content may violate YouTube's Terms of Service. Use responsibly.
        </p>
      </div>
    </section>
  );
}
