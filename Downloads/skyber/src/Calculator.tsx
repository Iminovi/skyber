import React, { useState, useEffect } from "react";
import { Check, MessageSquare, RefreshCw, CheckCircle2 } from "lucide-react";
import { SERVICES } from "./data";

interface CalculatorProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  whatsappNumber: string;
  showSimulatedBanner: boolean;
  newSimulatedId: string;
  onSimulate: (details: {
    taskTitle: string;
    selectedCategory: string;
    calculatedPrice: number;
    deadlineDays: number;
  }) => void;
}

export default function Calculator({
  selectedCategory,
  onCategorySelect,
  whatsappNumber,
  showSimulatedBanner,
  newSimulatedId,
  onSimulate,
}: CalculatorProps) {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(3);
  const [deadlineDays, setDeadlineDays] = useState<number>(3);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(150000);

  // Dynamic automatic price calculation formula
  useEffect(() => {
    let base = 50000;
    const currentService = SERVICES.find((s) => s.id === selectedCategory);
    
    if (currentService) {
      if (selectedCategory === "writing") base = 35000;
      else if (selectedCategory === "coding") base = 120000;
      else if (selectedCategory === "presentation") base = 25000;
      else if (selectedCategory === "statistics") base = 85000;
      else if (selectedCategory === "engineering") base = 65000;
      else if (selectedCategory === "business") base = 55000;
    }

    let multiplier = pageCount;
    if (selectedCategory === "coding") {
      multiplier = Math.max(1, pageCount / 1.5);
    }

    let rawPrice = base * multiplier;

    if (deadlineDays <= 1) {
      rawPrice *= 1.8;
    } else if (deadlineDays <= 2) {
      rawPrice *= 1.4;
    } else if (deadlineDays >= 7) {
      rawPrice *= 0.85;
    }

    if (isUrgent) {
      rawPrice *= 1.25;
    }

    setCalculatedPrice(Math.round(rawPrice / 1000) * 1000);
  }, [selectedCategory, pageCount, deadlineDays, isUrgent]);

  const getWhatsAppMessage = () => {
    const header = "Halo Admin Joki Tugas Skyber, saya tertarik berkonsultasi mengenai pengerjaan tugas akademik:";
    const catLabel = SERVICES.find((s) => s.id === selectedCategory)?.title || selectedCategory;
    return encodeURIComponent(
      `${header}\n\n` +
      `📝 *Detail Orderan Joki Tugas Skyber* 📝\n` +
      `• *Judul Tugas:* ${taskTitle || "Tugas Mandiri/Analisis"}\n` +
      `• *Kategori Layanan:* ${catLabel}\n` +
      `• *Estimasi Ukuran/Halaman:* ${pageCount} ${selectedCategory === "coding" ? "modul/skrip koding" : "halaman/slide"}\n` +
      `• *Deadline:* ${deadlineDays} Hari ${isUrgent ? "(Layanan Kilat-Express 12 Jam)" : ""}\n` +
      `• *Estimasi Kisaran Tarif:* Rp ${calculatedPrice.toLocaleString("id-ID")}\n\n` +
      `Mohon petunjuk kelanjutan transfer info & pengerjaan dari Kakak admin Skyber ya! Terima kasih.`
    );
  };

  return (
    <section id="calculator-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="text-brand-cyan text-xs font-mono font-bold tracking-widest uppercase">ESTIMATOR INSTANT</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Kalkulator Kelayakan Tarif Skyber</h2>
            <p className="text-slate-400 text-sm">
              Transparansi penuh adalah prioritas kami. Gunakan alat simulasi di bawah ini untuk mengukur estimasi awal kelayakan tarif yang disesuaikan dengan kuantitas, format, dan tingkat waktu.
            </p>
          </div>

          {showSimulatedBanner && (
            <div className="bg-indigo-950/80 border border-indigo-500/40 p-4 rounded-xl text-xs space-y-2 text-indigo-200 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-brand-cyan">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                KODE TRACKING SIMULASI BERHASIL DICIPTAKAN!
              </div>
              <p>
                Kami telah menyimulasikan orderan Anda dengan ID <strong className="text-white font-mono">{newSimulatedId}</strong>. Detail tracking pengerjaan telah dimuat di panel "Pantau Kemajuan Tugas" di bawah agar Anda bisa melihat cara kerja dashboard tracking kami.
              </p>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Kategori Tugas Utama</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SERVICES.map((serv) => (
                  <button
                    key={serv.id}
                    type="button"
                    onClick={() => onCategorySelect(serv.id)}
                    className={`text-left p-3 rounded-xl border text-xs font-semibold select-none transition-all ${selectedCategory === serv.id ? "bg-brand-cyan/10 border-brand-cyan text-white shadow-sm" : "bg-slate-950/60 border-slate-850 hover:bg-slate-800/60 text-slate-400"}`}
                  >
                    <span className="block font-bold">{serv.title}</span>
                    <span className="block text-[10px] text-slate-400 font-normal">Mulai {serv.basePrice}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Nama / Judul Tugas Anda</label>
              <input 
                type="text"
                placeholder="Contoh: Makalah Pengantar Hukum Tata Negara Bab 2"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-cyan text-slate-100 placeholder-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {selectedCategory === "coding" ? "Estimasi Kompleksitas" : "Jumlah Halaman / Slide"}
                  </label>
                  <span className="text-xs font-bold text-brand-cyan">{pageCount} {selectedCategory === "coding" ? "Modul / Skrip" : "Halaman / PPT"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="w-10 h-10 bg-slate-800 border border-slate-700 font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center hover:bg-slate-700" onClick={() => setPageCount(prev => Math.max(1, prev - 1))}>-</button>
                  <input type="range" min="1" max="30" value={pageCount} onChange={(e) => setPageCount(parseInt(e.target.value) || 3)} className="flex-1 accent-brand-cyan h-1.5 cursor-pointer bg-slate-950" />
                  <button type="button" className="w-10 h-10 bg-slate-800 border border-slate-700 font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center hover:bg-slate-700" onClick={() => setPageCount(prev => Math.min(30, prev + 1))}>+</button>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {selectedCategory === "coding" ? "1-2 modul cocok untuk tugas dasar pemrograman harian." : "File standard A4 Microsoft Word, spasi ganda, ukuran 12pt."}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target Batas Waktu (Deadline)</label>
                  <span className="text-xs font-bold text-brand-cyan">{deadlineDays} Hari</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="w-10 h-10 bg-slate-800 border border-slate-700 font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center hover:bg-slate-700" onClick={() => setDeadlineDays(prev => Math.max(1, prev - 1))}>-</button>
                  <input type="range" min="1" max="14" value={deadlineDays} onChange={(e) => setDeadlineDays(parseInt(e.target.value) || 3)} className="flex-1 accent-brand-cyan h-1.5 cursor-pointer bg-slate-950" />
                  <button type="button" className="w-10 h-10 bg-slate-800 border border-slate-700 font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center hover:bg-slate-700" onClick={() => setDeadlineDays(prev => Math.min(14, prev + 1))}>+</button>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {deadlineDays <= 2 ? "⚠️ Deadline mepet dikenakan tarif premium." : "Saran: Pilih >7 hari untuk mendapatkan harga termurah."}
                </span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold block text-slate-200">Garansi Layanan Super Kilat (6-12 Jam)?</span>
                <span className="text-[10px] text-slate-400 block max-w-sm">Tugas Anda langsung ditempatkan di prioritas teratas tim kami secara instan untuk diselesaikan malam ini.</span>
              </div>
              <button type="button" onClick={() => setIsUrgent(prev => !prev)} className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${isUrgent ? "bg-brand-cyan justify-end" : "bg-slate-800 justify-start"}`}>
                <span className="w-6 h-6 rounded-full bg-slate-950 block shadow-inner" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/90 border border-brand-cyan/20 p-6 rounded-2xl shadow-xl space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-slate-400">DETAIL ESTIMASI BARU</span>
                <div className="flex items-center gap-1.5 text-[10px] text-brand-cyan font-bold bg-brand-cyan/10 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                  Real-time
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs"><span className="text-slate-400">Spesialisasi</span><span className="font-semibold text-slate-200 uppercase">{SERVICES.find(s => s.id === selectedCategory)?.title}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-400">Kuantitas</span><span>{pageCount} {selectedCategory === "coding" ? "Modul / Script" : "Halaman / File"}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-400">Prioritas Antrean</span><span className={isUrgent ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>{isUrgent ? "Super Kilat Prioritas" : "Normal Akademik"}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-400">Kecepatan Pengerjaan</span><span>{deadlineDays} Hari Kerja</span></div>
              </div>
              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl text-center space-y-1">
                <span className="text-xs text-slate-400 uppercase font-mono tracking-widest block">ESTIMASI TARIF JASA</span>
                <span className="text-3xl font-extrabold text-white tracking-tight text-glow">Rp {calculatedPrice.toLocaleString("id-ID")}</span>
                <span className="text-[10px] text-emerald-400 block font-semibold">Sudah Termasuk: Revisi Seminggu + Turnitin Report</span>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-800">
              <a href={`https://wa.me/${whatsappNumber}?text=${getWhatsAppMessage()}`} target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-center text-sm active:scale-95 transition-all inline-flex items-center justify-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 fill-slate-950 stroke-none" />
                Kirim Detail ke WhatsApp Sekarang
              </a>
              <button type="button" onClick={() => onSimulate({ taskTitle, selectedCategory, calculatedPrice, deadlineDays })} className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 font-medium py-3 rounded-xl text-xs active:scale-95 transition-all text-center flex items-center justify-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin-slow" />
                Simulasikan Pengerjaan Sistem Skyber
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}