import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazily initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API Endpoints
app.post("/api/gemini/analyze", async (req, res) => {
  const { title, description, category, deadline, pageCount, isProgramming } = req.body;

  if (!title && !description) {
    return res.status(400).json({ error: "Judul atau deskripsi tugas harus disediakan." });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `
    Analisis tugas kuliah/sekolah berikut ini untuk layanan "Joki Tugas Skyber":
    Judul Tugas: ${title || "Tidak ada judul"}
    Kategori: ${category || "Umum"}
    Deskripsi/Instruksi: ${description || "Tidak ada deskripsi rinci"}
    Tenggat Waktu (Deadline Target): ${deadline || "Tidak ditentukan"}
    Jumlah Halaman/Slide/Dokumen: ${pageCount || "Tidak ditentukan"}
    Apakah ini tugas Pemrograman/Koding: ${isProgramming ? "Ya" : "Tidak"}

    Berikan hasil analisis Anda dalam format JSON terstruktur dengan kunci-kunci berikut dalam bahasa Indonesia:
    - "workloadLevel": Tingkat beban kerja (Rendah, Sedang, Tinggi, Sangat Tinggi).
    - "timeEstimate": Estimasi waktu penyelesaian (misalnya: "24-48 jam", "3-5 hari").
    - "recommendedPriceRange": Rekomendasi rentang harga kelayakan dalam mata uang Rupiah (misalnya: "Rp 150.000 - Rp 250.000").
    - "skillsNeeded": Daftar array berisi 3-4 keahlian/skill yang dibutuhkan untuk menyelesaikan ini.
    - "difficultyExplanation": Penjelasan singkat 1-2 paragraf mengapa tugas ini memiliki tingkat kesulitan tersebut dan tantangan utamanya.
    - "suggestedOutline": Daftar array berisi 4-5 poin outlines atau langkah-langkah sistematis yang akan dikerjakan untuk merampungkan tugas ini dengan kualitas nilai A.
    - "insiderTips": 2-3 tips eksklusif bagi pembuat tugas untuk mengoptimalkan hasil atau mempertahankan jawaban di depan dosen.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            workloadLevel: { type: Type.STRING },
            timeEstimate: { type: Type.STRING },
            recommendedPriceRange: { type: Type.STRING },
            skillsNeeded: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            difficultyExplanation: { type: Type.STRING },
            suggestedOutline: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            insiderTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
          },
          required: [
            "workloadLevel",
            "timeEstimate",
            "recommendedPriceRange",
            "skillsNeeded",
            "difficultyExplanation",
            "suggestedOutline",
            "insiderTips"
          ],
        },
        systemInstruction: "Anda adalah Kepala Konsultan Akademik dan Estimator Harga untuk 'Joki Tugas Skyber'. Tugas Anda adalah memberikan analisis teknis, terpercaya, objektif, dan membantu klien memahami bagaimana tugas mereka akan dieksekusi dengan standar mutu terbaik (Nilai A). Bicara secara profesional, bersahabat, memberi semangat, dan akurat.",
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Tidak ada respon dari model AI.");
    }

    const reportJson = JSON.parse(resultText.trim());
    return res.json(reportJson);
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    // Return mock analysis or empty/offline report if API key is not configured or fails
    const mockReport = {
      workloadLevel: "Sedang (Estimasi Manual)",
      timeEstimate: "1 - 3 Hari Kerja",
      recommendedPriceRange: isProgramming ? "Rp 250.000 - Rp 450.000" : "Rp 75.000 - Rp 200.000",
      skillsNeeded: [
        category || "Analisis Akademik",
        "Penulisan Ilmiah / Riset",
        "Pemeriksaan Plagiasi",
        isProgramming ? "Pemecahan Masalah Koding" : "Struktur Argumentasi"
      ],
      difficultyExplanation: `Tugas "${title || 'Tanpa Judul'}" dianalisis sebagai beban kerja Sedang secara offline. Tim spesialis di bidang ${category || 'Umum'} siap menyusun tulisan/pemecahan masalah yang orisinal, bebas plagiasi, dan lengkap dengan referensi terpercaya.`,
      suggestedOutline: [
        "Analisis pertanyaan & penyusunan hipotesis dasar",
        "Pengumpulan literatur primer (jurnal/buku ber-SINTA atau Scopus)",
        "Draf rancangan pembahasan materi utama",
        "Penyuntingan bahasa sesuai standar EYD/akademik",
        "Pengecekan turnitin mandiri (maksimal lolos di bawah 15%)"
      ],
      insiderTips: [
        "Minta revisi format sitasi spesifik (APA/MLA/IEEE/Harvard) sesuai arahan dosen Anda.",
        "Pelajari outline yang kami berikan agar saat ditanya dosen, Anda memahami alur berpikir tugas Anda."
      ],
      offlineMode: true,
      errorMessage: error.message
    };
    return res.json(mockReport);
  }
});

// Bungkus inisiasi server dalam fungsi async agar terhindar dari error top-level await
async function startServer() {
  // Vite dev server vs production static asset serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server Joki Tugas Skyber berhasil berjalan!`);
    console.log(`➜ Klik link ini untuk membuka: http://localhost:${PORT}`);
  });
}

startServer();
