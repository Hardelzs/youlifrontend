import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DownloadSection from "./components/DownloadSection";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

const STORAGE_KEY = "playlistdl-theme";
const getSystemTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";

export default function App() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
      return storedTheme;
    }
    return "system";
  });

  useEffect(() => {
    const root = document.documentElement;
    const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

    root.classList.toggle("dark", resolvedTheme === "dark");
    root.classList.toggle("light", resolvedTheme === "light");
    localStorage.setItem(STORAGE_KEY, theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = getSystemTheme();
        root.classList.toggle("dark", systemTheme === "dark");
        root.classList.toggle("light", systemTheme === "light");
      }
    };

    mediaQuery.addEventListener?.("change", handleChange);
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, [theme]);

  const cycleTheme = () => {
    setTheme((current) => {
      if (current === "system") return "dark";
      if (current === "dark") return "light";
      return "system";
    });
  };

  return (
    <div className="min-h-screen bg-brand-dark font-body overflow-x-hidden">
      <Navbar theme={theme} onToggleTheme={cycleTheme} />
      <Hero />
      <DownloadSection />
      <HowItWorks />
      <Footer />
    </div>
  );
}
