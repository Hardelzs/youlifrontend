import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DownloadSection from "./components/DownloadSection";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-brand-dark font-body overflow-x-hidden">
      <Navbar />
      <Hero />
      <DownloadSection />
      <HowItWorks />
      <Footer />
    </div>
  );
}
