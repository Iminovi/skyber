import express from "express";
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
            skillsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
            difficultyExplanation: { type: Type.STRING },
            suggestedOutline: { type: Type.ARRAY, items: { type: Type.STRING } },
            insiderTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["workloadLevel", "timeEstimate", "recommendedPriceRange", "skillsNeeded", "difficultyExplanation", "suggestedOutline", "insiderTips"],
        },
        systemInstruction: "Anda adalah Kepala Konsultan Akademik dan Estimator Harga untuk 'Joki Tugas Skyber'. Tugas Anda adalah memberikan analisis teknis, terpercaya, objektif, dan membantu klien memahami bagaimana tugas mereka akan dieksekusi dengan standar mutu terbaik (Nilai A). Bicara secara profesional, bersahabat, memberi semangat, dan akurat.",
      }
    });

    const reportJson = JSON.parse(response.text?.trim() || "{}");
    return res.json(reportJson);
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Wajib untuk Vercel: Mengekspor aplikasi express (BUKAN app.listen)
export default app;
