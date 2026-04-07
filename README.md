# PlaylistDL

A sleek React + Vite frontend for downloading YouTube and YouTube Music playlists as MP3, WAV, MP4, or 720p HD video.

Built with a dark, modern UI, animated waveform visuals, and a fast playlist workflow:
- Paste playlist URL
- Choose export format
- Start download
- Save the playlist ZIP

---

## 🚀 Features

- Beautiful responsive UI with Tailwind CSS
- Playlist URL validation for YouTube and YouTube Music
- Format options: `MP3`, `WAV`, `MP4`, `720p`
- Real-time progress feedback and playlist preview
- ZIP download support for completed jobs
- No sign-up required (frontend only)

## 🧩 App structure

- `src/App.jsx` — main layout and page sections
- `src/components/Navbar.jsx` — header and branding
- `src/components/Hero.jsx` — landing hero with animated waveform
- `src/components/DownloadSection.jsx` — playlist input, format selector, download flow
- `src/components/HowItWorks.jsx` — simple step-by-step onboarding
- `src/components/Footer.jsx` — footer with attribution

## 🛠️ Tech stack

- React 19
- Vite
- Tailwind CSS
- ESLint
- Modern JavaScript + environment variables

## ⚡ Getting started

1. Install dependencies

```bash
npm install
```

2. Add your API backend URL

Create a `.env` file at the project root with:

```env
VITE_API_URL=https://your-backend.example.com
```

3. Start the development server

```bash
npm run dev
```

4. Open the app in your browser

Visit the local URL shown by Vite (usually `http://localhost:5173`).

## 📦 Available scripts

- `npm run dev` — start the dev server
- `npm run build` — create a production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint on the project

## 🔧 Notes

- This frontend expects a backend API exposing endpoints like `/info`, `/start`, `/status/:job_id`, and `/file/:job_id`.
- Purchase or licensing of YouTube content is governed by YouTube terms of service.
- The app is ideal for local use, testing, or extending into a complete playlist downloader platform.

---

## 💡 Want to improve it?

- Add user authentication
- Show track thumbnails and durations
- Add playlist history / saved downloads
- Build a backend service with yt-dlp to power the API




Playlist : https://music.youtube.com/playlist?list=PLzHqiqNINo03bNm7LKS8jkGkKVnZ3w74u&si=LZj1kTJQfzVHmkHS

