import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Code as CodeIcon,
  Presentation, 
  BarChart3, 
  Compass, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Check, 
  Plus, 
  Search, 
  MessageSquare, 
  ArrowRight, 
  ChevronDown, 
  Star, 
  RefreshCw, 
  AlertCircle, 
  ThumbsUp, 
  CheckCircle2, 
  HelpCircle, 
  Send 
} from "lucide-react";

import { SERVICES, REVIEWS, FAQS, INITIAL_TRACKING } from "./data";
import { Service, AnalysisResult, SimulatedOrder } from "./types";
import Calculator from "./Calculator";

export default function App() {
  // Calculator States
  const [selectedCategory, setSelectedCategory] = useState<string>("writing");

  // AI Consultation States
  const [aiTitle, setAiTitle] = useState<string>("");
  const [aiDesc, setAiDesc] = useState<string>("");
  const [aiCategory, setAiCategory] = useState<string>("writing");
  const [aiDeadline, setAiDeadline] = useState<string>("3 Hari");
  const [aiPageCount, setAiPageCount] = useState<string>("A4 (3-5 halaman)");
  const [aiIsProgramming, setAiIsProgramming] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Tracking States
  const [trackingIdInput, setTrackingIdInput] = useState<string>("");
  const [activeTrackingOrders, setActiveTrackingOrders] = useState<SimulatedOrder[]>(INITIAL_TRACKING);
  const [trackedOrder, setTrackedOrder] = useState<SimulatedOrder | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Review Filter Space
  const [activeTabCategory, setActiveTabCategory] = useState<string>("all");

  // Accordion FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Success Feedback for simulated Tracking
  const [showSimulatedBanner, setShowSimulatedBanner] = useState<boolean>(false);
  const [newSimulatedId, setNewSimulatedId] = useState<string>("");

  // Target WhatsApp Number (Indonesian code template)
  // Mengambil dari Environment Variable, jika tidak ada fallback ke nomor default
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "6282118278928";

  // Pre-filled dynamically prepared WhatsApp message based on fields
  const getWhatsAppMessage = (type: "general" | "ai") => {
    const header = "Halo Admin Joki Tugas Skyber, saya tertarik berkonsultasi mengenai pengerjaan tugas akademik:";
    
    if (type === "ai" && analysisResult) {
      return encodeURIComponent(
        `${header}\n\n` +
        `🤖 *Hasil Analisis Spesifikasi AI Joki Skyber* 🤖\n` +
        `• *Judul Tugas:* ${aiTitle || "Analisis Akademik Spesifik"}\n` +
        `• *Tingkat Beban Kerja:* ${analysisResult.workloadLevel}\n` +
        `• *Rekomendasi Tarif Skyber:* ${analysisResult.recommendedPriceRange}\n` +
        `• *Estimasi Waktu:* ${analysisResult.timeEstimate}\n` +
        `• *Outline Kerja:* ${analysisResult?.suggestedOutline?.slice(0, 3).join(", ")}...\n\n` +
        `Saya ingin memesan paket pengerjaan ini sesuai dengan saran rekomendasi Asisten AI Joki Skyber. Bagaimana alur pembayaran DP nya kak?`
      );
    }

    // Default template link message
    return encodeURIComponent(
      "Halo Joki Tugas Skyber! 👋\n\nSaya ingin berkonsultasi mengenai tugas kuliah/sekolah saya yang mendesak. Apakah ada spesialis yang siap membantu pengerjaan sekarang?"
    );
  };

  // Run server-side academic AI Analyzer
  const handleAIAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTitle.trim()) {
      alert("Masukkan nama atau deskripsi singkat tugas terlebih dahulu agar AI bisa menganalisis secara presisi!");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: aiTitle,
          description: aiDesc,
          category: aiCategory,
          deadline: aiDeadline,
          pageCount: aiPageCount,
          isProgramming: aiCategory === "coding" || aiIsProgramming
        }),
      });

      if (!response.ok) {
        // Mengambil pesan error asli dari backend Vercel / Gemini
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${response.status}: API atau Server gagal diakses.`);
      }

      const reportData = await response.json();
      setAnalysisResult(reportData);
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(`Gagal menganalisis tugas: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Perform quick simulated order tracking
  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError(null);
    setTrackedOrder(null);

    if (!trackingIdInput.trim()) return;

    const idToSearch = trackingIdInput.trim().toUpperCase();
    const found = activeTrackingOrders.find((order) => order.id === idToSearch);

    if (found) {
      setTrackedOrder(found);
    } else {
      setTrackingError(`Kode Order "${idToSearch}" tidak ditemukan di database Skyber. Pastikan Anda menginput kode eksak, contoh: SKY-1249`);
    }
  };

  // Simulated creation of user's own task order to show tracking power in action
  const handleSimulateOrder = (details: { taskTitle: string, selectedCategory: string, calculatedPrice: number, deadlineDays: number }) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `SKY-${randomSuffix}`;
    const matchedCategory = SERVICES.find(s => s.id === details.selectedCategory)?.title || "Jasa Umum";
    
    const newOrder: SimulatedOrder = {
      id: generatedId,
      title: details.taskTitle || "Analisis Mandiri Premium",
      category: matchedCategory,
      price: `Rp ${details.calculatedPrice.toLocaleString("id-ID")}`,
      deadline: `${details.deadlineDays} Hari lagi [Target]`,
      status: "Analisis Spesifikasi",
      progressBar: 15,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setActiveTrackingOrders([newOrder, ...activeTrackingOrders]);
    setTrackingIdInput(generatedId);
    setTrackedOrder(newOrder);
    setNewSimulatedId(generatedId);
    setShowSimulatedBanner(true);

    // Scroll automatically down to active tracking anchor card
    const element = document.getElementById("tracking-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      setShowSimulatedBanner(false);
    }, 8000);
  };

  // Pre-fill fields when clicking a service item directly
  const handleServiceSelect = (serviceId: string) => {
    setSelectedCategory(serviceId);
    // Smooth scroll client to calculator section
    const calculatorElem = document.getElementById("calculator-section");
    if (calculatorElem) {
      calculatorElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper icon renderer based on name
  const renderServiceIcon = (name: string, className = "w-6 h-6") => {
    switch (name) {
      case "FileText": return <FileText className={className} />;
      case "Code": return <CodeIcon className={className} />;
      case "Clapperboard": return <Presentation className={className} />;
      case "BarChart3": return <BarChart3 className={className} />;
      case "Compass": return <Compass className={className} />;
      case "TrendingUp": return <TrendingUp className={className} />;
      default: return <FileText className={className} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-brand-cyan/30 selection:text-white bg-[#0f172a] overflow-x-hidden">
      
      {/* Dynamic Background Aurora Glow effects around headers */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-gradient-to-b from-brand-cyan/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-[80vh] left-0 w-[30vw] h-[50vh] bg-gradient-to-r from-brand-indigo/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-[20vh] right-[10%] w-[35vw] h-[35vh] bg-gradient-to-t from-brand-cyan/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Top Banner Warning & Promo */}
      <div className="bg-slate-900 border-b border-sky-900/40 text-center py-2 px-4 text-xs font-mono tracking-wider text-brand-cyan flex items-center justify-center gap-2">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        PROMO HEMAT TUGAS AKHIR BULAN: DISKON 15% UNTUK PENGERJAAN DEADLINE DI ATAS 7 HARI!
      </div>

      {/* Modern Slim Navbar */}
      <nav id="navbar" className="sticky top-0 z-50 bg-[#0f172af2] backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center font-bold text-slate-900 shadow-md shadow-brand-cyan/20">
              <span className="text-xl tracking-tighter text-slate-950 font-extrabold">SK</span>
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">
                Joki Tugas Skyber
              </span>
              <span className="block text-[10px] font-mono text-slate-400 tracking-wider">CYBER ACADEMIC ASSISTANCE</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a href="#services" className="hover:text-brand-cyan transition-colors">Layanan Kami</a>
            <a href="#calculator-section" className="hover:text-brand-cyan transition-colors">Estimasi Harga</a>
            <a href="#ai-assistant" className="bg-slate-800/60 border border-slate-700/60 px-2.5 py-1 rounded-md text-xs text-brand-cyan flex items-center gap-1 hover:border-brand-cyan/50 transition-colors">
              <Sparkles className="w-3 h-3 text-brand-cyan" /> Asisten AI Joki
            </a>
            <a href="#tracking-section" className="hover:text-brand-cyan transition-colors">Pantau Tugas</a>
            <a href="#guarantees" className="hover:text-brand-cyan transition-colors">Keamanan</a>
            <a href="#reviews" className="hover:text-brand-cyan transition-colors">Testimoni</a>
          </div>

          <div>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppMessage("general")}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              id="cta_whatsapp_header"
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold shadow-md active:scale-95 transition-all duration-150 inline-flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950 stroke-none" />
              Chat Admin Joki
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Module Section */}
      <section className="relative pt-12 pb-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-cyan/10 border border-brand-cyan/20 px-3 py-1 rounded-full text-xs font-semibold text-brand-cyan w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              No. 1 Jasa Akademik Anti-Plagiasi & Bergaransi
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Tugas Menumpuk? <br />
              <span className="bg-gradient-to-r from-brand-cyan via-sky-300 to-brand-indigo bg-clip-text text-transparent">
                IPK Aman Tanpa Begadang!
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Selamat datang di <strong className="text-slate-100">Joki Tugas Skyber</strong>. Solusi penulisan karya ilmiah, esai bebas, pengolahan statistik, desain PPT, hingga koding pemrograman dengan pengerjaan orisinal, laporan Turnitin, dan jaminan keamanan rahasia 100%. Master S1 & S2 siap membantu Anda!
            </p>

            {/* Quick Badges Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex flex-col items-center text-center">
                <ShieldCheck className="w-5 h-5 text-brand-cyan mb-1.5" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Kerahasiaan</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5">Aman Penuh</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex flex-col items-center text-center">
                <Clock className="w-5 h-5 text-brand-cyan mb-1.5" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Waktu</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5">Kilat Express</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex flex-col items-center text-center">
                <Check className="w-5 h-5 text-brand-cyan mb-1.5" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Plagiasi</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5">Turnitin Gratis</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex flex-col items-center text-center">
                <ThumbsUp className="w-5 h-5 text-brand-cyan mb-1.5" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Mutu</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5">Garansi Revisi</span>
              </div>
            </div>

            {/* CTA Buttons row */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="#calculator-section" 
                className="bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl text-center shadow-lg shadow-brand-cyan/20 active:scale-95 transition-all text-sm "
              >
                Hitung Estimasi Harga & Order
              </a>
              <a 
                href="#ai-assistant" 
                className="bg-slate-800 hover:bg-slate-700 text-brand-cyan border border-brand-cyan/30 px-6 py-3.5 rounded-xl text-center font-bold active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                Analisis Spesifikasi Tugas (AI)
              </a>
            </div>

            {/* Quick Trust statement */}
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Sedang online: <strong>14 Spesialis Skyber</strong> siap mengeroyok tugas sulit Anda hari ini.</span>
            </div>
          </div>

          {/* Right Banner Showcase (interactive preview mockup inside) */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-indigo/20 to-brand-cyan/20 rounded-3xl blur-2xl pointer-events-none" />
            
            <div id="hero-interactive-card" className="relative bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl glow-cyan space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">LIVE STATUS PEMESANAN</span>
              </div>

              {/* Simulated active stats */}
              <div className="space-y-4">
                <div className="p-3 bg-slate-950/70 border border-sky-950/50 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono text-brand-cyan font-bold">SKY-1249</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">95% Sukses</span>
                  </div>
                  <p className="text-xs font-bold truncate">Sentimen Analisis Python ddst.</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-cyan to-brand-indigo h-full rounded-full transition-all duration-1000" style={{ width: "95%" }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Selesai - File Draft Terkirim</span>
                    <span>16 Mnt Lalu</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-900 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono text-yellow-400 font-bold">SKY-1253</span>
                    <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded text-[10px]">Sedang Dikerjakan</span>
                  </div>
                  <p className="text-xs font-bold truncate">Analisis Essay Sosiologi Konflik Rakyat</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full animate-pulse transition-all duration-1000" style={{ width: "55%" }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Tim Master Sastra Sedang Menulis Draf</span>
                    <span>1 Jam Lalu</span>
                  </div>
                </div>
              </div>

              {/* Fast Track form in widget layout */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-300">Punya JokiID Anda? Pantau Cepat:</h4>
                <form onSubmit={handleSearchTracking} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Contoh: SKY-1249" 
                    value={trackingIdInput}
                    onChange={(e) => setTrackingIdInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-100 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-cyan placeholder-slate-500 font-mono"
                  />
                  <button 
                    type="submit" 
                    className="bg-brand-indigo/80 hover:bg-brand-indigo text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" /> Pelacak
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="bg-slate-900/50 py-20 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-brand-cyan text-xs font-mono font-bold tracking-widest uppercase">DOMISILI KATEGORI</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Keahlian Akademik Yang Kami Selesaikan</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Setiap kategori ditangani secara profesional oleh spesialis terbaik lulusan kampus terkemuka di Indonesia dan luar negeri. Klik salah satu untuk menghitung harga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const isActiveInCalc = selectedCategory === service.id;
              return (
                <div 
                  key={service.id}
                  id={`service_card_${service.id}`}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`bg-slate-950/80 border border-slate-800/80 p-6 rounded-2xl cursor-pointer hover:border-brand-cyan/40 transition-all duration-300 group flex flex-col justify-between ${isActiveInCalc ? "ring-2 ring-brand-cyan/60 scale-[1.01] bg-slate-900/90" : ""}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 group-hover:bg-brand-cyan/10 flex items-center justify-center text-brand-cyan transition-colors">
                        {renderServiceIcon(service.iconName)}
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        Mulai {service.basePrice}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-brand-cyan transition-colors pb-1">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {service.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-brand-cyan font-bold pt-6 border-t border-slate-900 mt-5">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Estimasi pengerjaan: {service.deliveryTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      Estimasi Cepat <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Interactive Pricing Estimator Section */}
      <Calculator 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        whatsappNumber={WHATSAPP_NUMBER}
        showSimulatedBanner={showSimulatedBanner}
        newSimulatedId={newSimulatedId}
        onSimulate={handleSimulateOrder}
      />

      {/* AI Assistant Section (Asisten AI Skyber) */}
      <section id="ai-assistant" className="bg-slate-950 py-20 border-y border-slate-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-brand-cyan text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> ASISTEN TEKNIS INTELEKTUAL
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Analisis Tugas AI Joki Skyber
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Punya instruksi tugas kuliah yang panjang, rumit, atau bingung menentukan rentang tarif kelayakan?
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Asisten AI kami yang terlatih menggunakan model <strong className="text-slate-200">Gemini 3.5</strong> akan mengurai beban kerja, merumuskan rentang harga pas, mendraft poin outline pengerjaan, dan membongkar tips jitu agar Anda bisa menjawab pertanyaan dosen saat diuji!
                </p>
              </div>

              <form onSubmit={handleAIAnalyze} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Inti / Tema Tugas</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Pembuatan Algoritma Enkripsi Sandi AES-128 di Flutter"
                    value={aiTitle}
                    onChange={(e) => setAiTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-cyan"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Kategori Kajian</label>
                    <select 
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="writing">Esai & Karya Ilmiah</option>
                      <option value="coding">Pemrograman & Koding</option>
                      <option value="presentation">PPT & Desain Bahan Ajar</option>
                      <option value="statistics">Olah Data & Stats</option>
                      <option value="engineering">Laporan & Teknik/Matematika</option>
                      <option value="business">Bisnis & Akuntansi</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Kuantitas Output</label>
                    <select 
                      value={aiPageCount}
                      onChange={(e) => setAiPageCount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="1-2 halaman saja">Pratonton / 1-2 Hlm</option>
                      <option value="A4 (3-5 halaman)">Standar (3-5 Hlm)</option>
                      <option value="Makalah (6-10 halaman)">Menengah (6-10 Hlm)</option>
                      <option value="Skripsi/Laporan Besar (>15 halaman)">Besar / Skripsi (&gt;15 Hlm)</option>
                    </select>
                  </div>

                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Target Masa Tunggu (Deadline)</label>
                  <select 
                    value={aiDeadline}
                    onChange={(e) => setAiDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="Kilat (Di bawah 24 jam)">Express Ultra Kilat (&lt;24 Jam)</option>
                    <option value="2-3 Hari">Standar Cepat (2-3 Hari)</option>
                    <option value="1 Minggu">Sabar Hemat (1 Minggu)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Detail Instruksi / Soal</label>
                  <textarea 
                    rows={3}
                    placeholder="Tempel soal, petunjuk dosen, atau link pustaka rujukan opsional jika ada..."
                    value={aiDesc}
                    onChange={(e) => setAiDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-brand-cyan placeholder-slate-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-brand-cyan to-brand-indigo text-slate-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Menganalisis Spesifikasi Tugas...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                      Mulai Analisis Instan AI Joki Skyber
                    </>
                  )}
                </button>

              </form>
            </div>

            <div className="lg:col-span-7">
              {analysisResult ? (
                <div className="bg-slate-900 border border-brand-cyan/20 rounded-3xl p-6 space-y-6 animate-fadeIn shadow-2xl">
                  
                  {/* Analysis Result Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-1.5">
                        <Sparkles className="w-5 h-5 text-brand-cyan" />
                        Laporan Analisis Asisten AI Skyber
                      </h3>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Hasil evaluasi sistematis AI terhadap judul: &quot;{aiTitle || 'Umum'}&quot;
                      </span>
                    </div>

                    {analysisResult.offlineMode && (
                      <span className="text-[10px] font-mono bg-yellow-500/10 border border-yellow-550/40 text-yellow-400 px-2 py-1 rounded">
                        Offline Engine Mode Modus
                      </span>
                    )}
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Tingkat Workload</span>
                      <span className="text-sm font-extrabold text-brand-cyan mt-1 block">
                        {analysisResult.workloadLevel}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Waktu Estimasi</span>
                      <span className="text-sm font-extrabold text-slate-200 mt-1 block">
                        {analysisResult.timeEstimate}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Rentang Harga</span>
                      <span className="text-sm font-extrabold text-emerald-400 mt-1 block">
                        {analysisResult.recommendedPriceRange}
                      </span>
                    </div>
                  </div>

                  {/* Difficulty assessment */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">Penjelasan Teknis & Kesulitan:</h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-850/80">
                      {analysisResult.difficultyExplanation}
                    </p>
                  </div>

                  {/* Skills needed badges */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">Spesialisasi Skill Yang Dibutuhkan Skyber:</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.skillsNeeded?.map((sk, idx) => (
                        <span key={idx} className="bg-blue-950/40 border border-blue-900/40 text-blue-300 text-xs px-3 py-1 rounded-full font-semibold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Outlines of work plan */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">Rancangan Langkah Pengerjaan (Garansi Nilai A):</h4>
                    <ul className="space-y-1.5">
                      {analysisResult.suggestedOutline?.map((ot, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-400">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-cyan/25 font-mono text-[9px] font-bold text-brand-cyan">
                            {idx + 1}
                          </span>
                          <span>{ot}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examiner insider tips */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">🕵️ Tips Eksklusif Persiapan Menghadapi Dosen:</h4>
                    <ul className="space-y-1.5">
                      {analysisResult.insiderTips?.map((tip, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-400">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-indigo-950 text-brand-indigo font-bold text-[10px]">
                            ★
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Forward spec to WhatsApp admin */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="text-center sm:text-left">
                      <span className="text-xs font-bold block text-slate-200">Bawa Analisis Presisi Ini ke WhatsApp Admin?</span>
                      <span className="text-[10px] text-slate-400 block">Dapatkan persetujuan penugasan Instan sesuai dengan draf outline AI di atas.</span>
                    </div>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppMessage("ai")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all w-full sm:w-auto justify-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                      Kirim ke Admin Skyber
                    </a>
                  </div>

                </div>
              ) : (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 h-full min-h-[400px]">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-2">
                    <Sparkles className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-300">Belum Ada Analisis yang Berjalan</h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Isi form Asisten AI di samping kirinya dengan tema joki tugas Anda, lalu klik tombol analisis untuk menghasilkan blueprint pengerjaan terperinci secara otomatis.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Tracker Segment: Pantau Tugas (Order Tracking Engine) */}
      <section id="tracking-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-5">
            <span className="text-brand-cyan text-xs font-mono font-bold tracking-widest uppercase">SKYBER DASHBOARD ENGINE</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Kawal Kemajuan Penugasan Anda</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Kami memahami kepanikan Anda menunggu tugas selesai. Gunakan ID referensi joki Anda untuk melacak progres secara real-time.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tim Skyber mengunggah transisi kemajuan tahap demi tahap mulai dari <strong>Spesifikasi</strong>, <strong>Pengerjaan draf</strong>, hingga <strong>Quality Control QA</strong> untuk memastikannya bebas plagiarisme sebelum dikirim.
            </p>

            <form onSubmit={handleSearchTracking} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Masukkan JokiID Pelacakan Anda</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Contoh: SKY-1249"
                  value={trackingIdInput}
                  onChange={(e) => setTrackingIdInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 text-sm text-slate-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-cyan placeholder-slate-600 font-mono"
                />
                <button
                  type="submit"
                  className="bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-bold px-4 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block">
                Petunjuk: Jika Anda mensimulasikan orderan baru di atas, gunakan kode yang digenerate tadi atau coba kode bawaan: <strong className="text-slate-300">SKY-1249</strong> untuk demo progres.
              </span>
            </form>
          </div>

          <div className="lg:col-span-8">
            {trackedOrder ? (
              <div className="bg-slate-900 border border-brand-cyan/20 rounded-3xl p-6 space-y-6 shadow-2xl animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-brand-cyan font-bold">{trackedOrder.id}</span>
                    <h3 className="text-lg font-bold text-slate-100">{trackedOrder.title}</h3>
                  </div>
                  <div className="bg-slate-950 text-right p-3 rounded-xl border border-slate-800 self-start sm:self-auto">
                    <span className="text-[10px] block text-slate-500 uppercase font-mono">Estimasi Tarif</span>
                    <span className="text-sm font-extrabold text-emerald-400">{trackedOrder.price}</span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Kemajuan Kerja Keseluruhan</span>
                    <span className="text-brand-cyan">{trackedOrder.progressBar}%</span>
                  </div>
                  <div className="w-full bg-slate-950 border border-slate-850 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-cyan via-sky-400 to-brand-indigo h-full rounded-full transition-all duration-700" style={{ width: `${trackedOrder.progressBar}%` }} />
                  </div>
                </div>

                {/* Tracking Milestones step display */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">Sejarah & Tahap Eksekusi:</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    
                    <div className={`p-3 rounded-xl text-center border text-xs flex flex-col items-center justify-between ${trackedOrder.progressBar >= 15 ? "bg-slate-950 border-brand-indigo text-slate-100" : "bg-slate-950/20 border-slate-900 text-slate-600"}`}>
                      <span className="font-mono text-[10px] mb-1">Step 1</span>
                      <span className="font-bold block text-[11px]">Analisis Spek</span>
                      {trackedOrder.progressBar >= 15 && <Check className="w-3.5 h-3.5 text-brand-cyan mt-1" />}
                    </div>

                    <div className={`p-3 rounded-xl text-center border text-xs flex flex-col items-center justify-between ${trackedOrder.progressBar >= 40 ? "bg-slate-950 border-brand-indigo text-slate-100" : "bg-slate-950/20 border-slate-900 text-slate-600"}`}>
                      <span className="font-mono text-[10px] mb-1">Step 2</span>
                      <span className="font-bold block text-[11px]">Pencarian Ref</span>
                      {trackedOrder.progressBar >= 40 && <Check className="w-3.5 h-3.5 text-brand-cyan mt-1" />}
                    </div>

                    <div className={`p-3 rounded-xl text-center border text-xs flex flex-col items-center justify-between ${trackedOrder.progressBar >= 60 ? "bg-slate-950 border-brand-indigo text-slate-100" : "bg-slate-950/20 border-slate-900 text-slate-600"}`}>
                      <span className="font-mono text-[10px] mb-1">Step 3</span>
                      <span className="font-bold block text-[11px]">Pengerjaan Drf</span>
                      {trackedOrder.progressBar >= 60 && <Check className="w-3.5 h-3.5 text-brand-cyan mt-1" />}
                    </div>

                    <div className={`p-3 rounded-xl text-center border text-xs flex flex-col items-center justify-between ${trackedOrder.progressBar >= 80 ? "bg-slate-950 border-brand-indigo text-slate-100" : "bg-slate-950/20 border-slate-900 text-slate-600"}`}>
                      <span className="font-mono text-[10px] mb-1">Step 4</span>
                      <span className="font-bold block text-[11px]">Cek Plagiasi/QC</span>
                      {trackedOrder.progressBar >= 80 && <Check className="w-3.5 h-3.5 text-brand-cyan mt-1" />}
                    </div>

                    <div className={`p-3 rounded-xl text-center border text-xs flex flex-col items-center justify-between ${trackedOrder.progressBar >= 100 ? "bg-slate-950 border-brand-indigo text-slate-100" : "bg-slate-950/20 border-slate-900 text-slate-600"}`}>
                      <span className="font-mono text-[10px] mb-1">Step 5</span>
                      <span className="font-bold block text-[11px]">Selesai Kirim</span>
                      {trackedOrder.progressBar >= 100 && <Check className="w-3.5 h-3.5 text-brand-cyan mt-1" />}
                    </div>

                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Log Catatan Spesialis:</span>
                  <p className="text-xs text-slate-300">
                    {trackedOrder.status === "Review Kualitas" && "✓ Dokumen pengerjaan utama sudah rampung, saat ini masuk dalam sistem Turnitin Check & pemeriksaan pematuhan format sitasi oleh Tim QA Skyber."}
                    {trackedOrder.status === "Pengerjaan" && "🕒 Spesifikator di bidang Terkait sedang merangkai draf koding/esai. Bagian analisis awal sudah divalidasi aman."}
                    {trackedOrder.status === "Analisis Spesifikasi" && "✓ Order diverifikasi. Pengalokasian tim master lulusan S1 Spesialis yang tepat sedang berlangsung."}
                    {trackedOrder.status === "Selesai" && "✓ Tugas tuntas penuh tanpa plagiasi. File draf siap dikirimkan melalui platform berkas/Google Drive."}
                  </p>
                </div>

                {/* CTA WhatsApp specific tracking */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-3 border-t border-slate-800">
                  <span>Ada pertanyaan mengenai progres joki tugas <strong className="text-slate-200">{trackedOrder.id}</strong>?</span>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Admin%20Skyber!%20Mau%20tanya%20bagaimana%20progres%20tugas%20dengan%20JokiID%20${trackedOrder.id}%20terkait%20${encodeURIComponent(trackedOrder.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-cyan hover:underline font-bold inline-flex items-center gap-1.5"
                  >
                    Tanyakan langsung di WhatsApp Admin →
                  </a>
                </div>

              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-10 space-y-6">
                <h3 className="text-lg font-bold text-slate-300">Cari JokiID di Atas atau Melacak Order Demo Bawaan:</h3>
                
                {trackingError && (
                  <div className="bg-rose-950/40 border border-rose-800 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{trackingError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeTrackingOrders.map((order) => (
                    <div 
                      key={order.id}
                      onClick={() => {
                        setTrackedOrder(order);
                        setTrackingIdInput(order.id);
                      }}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-brand-cyan/40 cursor-pointer space-y-3 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono text-brand-cyan font-bold">{order.id}</span>
                          <span className="text-[10px] text-slate-500">{order.createdAt}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 mt-1 truncate group-hover:text-brand-cyan transition-colors">{order.title}</h4>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                          <span>Status: {order.status}</span>
                          <span>{order.progressBar}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                          <div className="bg-brand-indigo h-full" style={{ width: `${order.progressBar}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Trust & Guarantee Shield Section */}
      <section id="guarantees" className="bg-slate-900/50 py-20 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-brand-cyan text-xs font-mono font-bold tracking-widest uppercase">PROSEDUR SAFEGUARD SKYBER</span>
            <h2 className="text-3xl font-extrabold tracking-tight">4 Pilar Keamanan Mahasiswa Indonesia</h2>
            <p className="text-slate-400 text-sm">
              Kami berdiri di atas kepuasan dan keselamatan akademis klien. Berikut adalah jaminan operasional yang wajib dipatuhi spesialis kami:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="flex gap-4 p-5 bg-slate-950 rounded-2xl border border-slate-850/80">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-brand-cyan flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-200">100% Non-Disclosure Policy (Rahasia Aman)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Identitas aseli, modul tugas, nama kampus, hingga nomor kontak Anda dijamin dirahasiakan penuh. Kami tidak membagikan, mempublish, atau melas publikasikan file Anda di mana pun. File draf tugas akan otomatis terhapus permanen dari basis jaringan kami dalam 14 hari pasca selesai.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-slate-950 rounded-2xl border border-slate-850/80">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-brand-cyan flex items-center justify-center shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-200">Turnitin Check Gratis (Bebas Plagiat)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tiap esai, jurnal, laporan sosiologi/bisnis yang kami kemas diketik dari nol secara orisinal oleh tim spesialis. Kami menyertakan lampiran file PDF Laporan Bukti Cek Turnitin Premium secara gratis untuk mematikan kemurnian konten di bawah batas kesepakatan Anda.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-slate-950 rounded-2xl border border-slate-850/80">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-brand-cyan flex items-center justify-center shrink-0">
                <ThumbsUp className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-200">Sistem Revisi Gratis Selama 7 Hari</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Jika ada detail pengerjaan atau formula yang tidak sesuai dengan instruksi file referensi awal pendaftaran, Anda berhak mendaftarkan revisi gratis tanpa batas selama 7 hari penuh pasca transfer serah terima berkas selesai.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-slate-950 rounded-2xl border border-slate-850/80">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-brand-cyan flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-200">DP 50% Fleksibel & Garansi Refund</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cukup bayar DP 50% untuk memesan kuota spesialis kerja. Sisanya dilunasi setelah kami menunjukkan bukti draf tangkapan layar/rekaman video pengerjaan tugas Anda. Jika tugas terbukti gagal dikirim sesuai tenggat waktu sepakat, uang DP kami kembalikan 100%!
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Reviews & Testimonials Section */}
      <section id="reviews" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="text-brand-cyan text-xs font-mono font-bold tracking-widest uppercase">TESTIMONI ASLI MAHASISWA</span>
              <h2 className="text-3xl font-extrabold tracking-tight">Kisah Sukses Bersama Skyber</h2>
              <p className="text-slate-400 text-sm max-w-xl">
                Tanggapan jujur dari klien kami yang berasal dari kalangan mahasiswa di berbagai kampus bergengsi nusantara.
              </p>
            </div>

            {/* Simple tab headers to filter reviews */}
            <div className="flex flex-wrap gap-1.5 self-start">
              <button 
                onClick={() => setActiveTabCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTabCategory === "all" ? "bg-brand-cyan text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"}`}
              >
                Semua Review
              </button>
              <button 
                onClick={() => setActiveTabCategory("writing")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTabCategory === "writing" ? "bg-brand-cyan text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"}`}
              >
                Esai/Ilmiah
              </button>
              <button 
                onClick={() => setActiveTabCategory("coding")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTabCategory === "coding" ? "bg-brand-cyan text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"}`}
              >
                Pemrograman
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.filter(rev => {
              if (activeTabCategory === "all") return true;
              if (activeTabCategory === "writing") return rev.serviceCompleted.includes("Esai") || rev.serviceCompleted.includes("Karya");
              if (activeTabCategory === "coding") return rev.serviceCompleted.includes("Pemrograman") || rev.serviceCompleted.includes("Koding");
              return true;
            }).map((rev) => (
              <div key={rev.id} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{rev.name}</h4>
                      <span className="text-[11px] text-slate-400 block">{rev.campus}</span>
                      <span className="text-[10px] text-slate-500 block">{rev.major}</span>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 fill-current ${i < Math.floor(rev.rating) ? "opacity-100" : "opacity-30"}`} 
                          />
                        ))}
                        <span className="text-slate-300 font-bold ml-1">{rev.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">{rev.date}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    &quot;{rev.text}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900 mt-2">
                  <span className="text-[10px] bg-sky-950/40 text-sky-400 px-2 py-0.5 rounded border border-sky-900/40 font-semibold uppercase">
                    Order Terkait: {rev.serviceCompleted}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Terverifikasi Aman
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions (Accordion FAQs) */}
      <section className="bg-slate-900/50 py-20 border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-brand-cyan text-xs font-mono font-bold tracking-widest uppercase">FAQ DAN TANYA JAWAB</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Menjawab Kebimbangan Anda</h2>
            <p className="text-slate-400 text-sm">
              Masih ragu memesan joki tugas secara online? Baca kumpulan informasi penting ini untuk meningkatkan kenyamanan Anda berkolaborasi dengan Joki Tugas Skyber:
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-200 hover:bg-slate-900/30 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-brand-cyan shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-brand-cyan" : ""}`} />
                  </button>

                  <div 
                    className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] border-t border-slate-900/70" : "max-h-0"}`}
                  >
                    <div className="p-5 text-xs sm:text-sm text-slate-400 leading-relaxed bg-[#0a0f1d]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer Design */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs text-center border-b-[8px] border-brand-cyan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-900">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center font-bold text-slate-900 shadow-md">
                <span className="text-md font-black">SK</span>
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-white block">Joki Tugas Skyber</span>
                <span className="text-[10px] font-mono text-slate-500 block">CYBER ACADEMIC ASSISTANCE</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-slate-300 text-[11px]">
              <a href="#services" className="hover:text-brand-cyan transition-colors">Layanan</a>
              <a href="#calculator-section" className="hover:text-brand-cyan transition-colors">Kalkulator</a>
              <a href="#ai-assistant" className="hover:text-brand-cyan transition-colors">Asisten AI</a>
              <a href="#tracking-section" className="hover:text-brand-cyan transition-colors">Lacak Joki</a>
              <a href="#guarantees" className="hover:text-brand-cyan transition-colors">Ketentuan Lisensi</a>
            </div>

          </div>

          <p className="max-w-xl mx-auto text-[11px] leading-relaxed text-slate-500">
            Layanan <strong>Joki Tugas Skyber</strong> membantu penyusunan draf kerangka berpikir ilmiah, bantuan debug bahasa pemrograman, dan draf infografis pengetikan yang ditujukan untuk kepentingan referensi, belajar mandiri, dan kelayakan presentasi personal mahasiswa. Seluruh file diproses secara mandiri oleh tim Skyber.
          </p>

          <p className="text-slate-600">
            © {new Date().getFullYear()} Joki Tugas Skyber. Seluruh hak cipta dilindungi undang-undang.
          </p>
        </div>
      </footer>


      {/* THE SPECIAL REQUESTED FLOATING ACTION BUTTON (WhatsApp Floating Button) */}
      <div className="fixed bottom-6 right-6 z-55 group flex flex-col items-end">
        
        {/* On hover hint banner */}
        <div className="mb-2 bg-gradient-to-r from-slate-900 to-emerald-950 text-white border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs shadow-xl scale-0 group-hover:scale-100 origin-bottom-right transition-all duration-200 pointer-events-none max-w-xs text-right">
          <span className="font-extrabold text-emerald-400 block text-[10px] uppercase font-mono tracking-wider">Fast-Response Admin Skyber</span>
          <span className="text-slate-300 font-bold block text-[11px] mt-0.5">Tanya Joki via WhatsApp (Respons 5 Mnt)</span>
        </div>

        {/* Floating Button element */}
        <a 
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppMessage("general")}`}
          target="_blank" 
          rel="noopener noreferrer"
          id="whatsapp_floating_button"
          aria-label="Direct WhatsApp Chat with Skyber Admin"
          className="relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-90 hover:scale-105 hover:rotate-3 transition-all duration-150 animate-bounce-slow"
        >
          {/* Online green indicator badge */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-slate-950 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-green-500 relative" />
          </span>

          <MessageSquare className="w-6 h-6 fill-slate-950 stroke-none" />
        </a>

      </div>

    </div>
  );
}
