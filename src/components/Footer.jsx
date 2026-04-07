export default function Footer() {
  return (
    <footer className="border-t border-brand-border px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-red flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <span className="font-display font-700 text-sm text-white">
            Playlist<span className="text-brand-red">DL</span>
          </span>
        </div>

        <p className="text-xs text-brand-muted text-center">
          Built with yt-dlp · For personal use only ·{" "}
          <a
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noreferrer"
            className="text-brand-soft hover:text-white transition-colors underline underline-offset-2"
          >
            YouTube ToS
          </a>
        </p>

        <p className="text-xs text-brand-muted">
          © {new Date().getFullYear()} PlaylistDL
        </p>
      </div>
    </footer>
  );
}
