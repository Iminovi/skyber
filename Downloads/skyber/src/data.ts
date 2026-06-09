import { Service, Review, FAQItem, SimulatedOrder } from "./types";

export const SERVICES: Service[] = [
  {
    id: "writing",
    title: "Esai & Karya Ilmiah",
    description: "Pembuatan karya ilmiah, rancangan esai, review jurnal, dan artikel akademik dengan sitasi standar internasional (APA, MLA, IEEE, dll.). Termasuk Turnitin Check.",
    basePrice: "Rp 50.000",
    deliveryTime: "1-3 Hari",
    iconName: "FileText",
    tags: ["Turnitin Gratis", "Bebas Plagiasi", "Format Sitasi"]
  },
  {
    id: "coding",
    title: "Pemrograman & Koding",
    description: "Pembuatan aplikasi web, skrip otomasi, basis data, kecerdasan buatan, atau tugas koding (Python, Java, C++, JS, PHP, SQL, HTML/CSS). Dilengkapi penjelasan baris kode.",
    basePrice: "Rp 150.000",
    deliveryTime: "2-4 Hari",
    iconName: "Code",
    tags: ["Python", "Web Dev", "Full Code Explanation"]
  },
  {
    id: "presentation",
    title: "PPT & Desain Bahan Ajar",
    description: "Desain presentasi PowerPoint, Google Slides, atau Canva premium yang komprehensif, komunikatif, visual atraktif, dan siap dipresentasikan di depan dosen.",
    basePrice: "Rp 40.000",
    deliveryTime: "1-2 Hari",
    iconName: "Clapperboard",
    tags: ["Desain Custom", "Visual Premium", "Speaker Notes"]
  },
  {
    id: "statistics",
    title: "Olah Data & Statistik",
    description: "Analisis statistik untuk skripsi, kuesioner, laporan praktikum, atau tugas riset kuantitatif menggunakan SPSS, R-Studio, Python (Pandas/NumPy), atau Microsoft Excel.",
    basePrice: "Rp 100.000",
    deliveryTime: "2-3 Hari",
    iconName: "BarChart3",
    tags: ["SPSS", "R-Studio", "Interpretasi Data"]
  },
  {
    id: "engineering",
    title: "Laporan & Matematika/Sains",
    description: "Penyelesaian analisis kasus teknik, laporan praktikum laboratorium, kalkulus, statistika dasar, fisika, kimia, hingga rancangan CAD detail.",
    basePrice: "Rp 75.000",
    deliveryTime: "1-3 Hari",
    iconName: "Compass",
    tags: ["Rumus Rinci", "Langkah Lengkap", "CAD & Fisika"]
  },
  {
    id: "business",
    title: "Studi Kasus Bisnis & Akuntansi",
    description: "Laporan keuangan, analisis SWOT bisnis, studi kelayakan pasar, manajemen strategi, atau akuntansi biaya terperinci dengan spreadsheet pembantu.",
    basePrice: "Rp 80.000",
    deliveryTime: "2-3 Hari",
    iconName: "TrendingUp",
    tags: ["Analisis Finansial", "SWOT & Porter", "S1 Spesialis"]
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev1",
    name: "Arya Setiawan",
    campus: "Universitas Indonesia (UI)",
    major: "Ilmu Komputer",
    rating: 5,
    date: "Kemarin",
    text: "Membantu banget pas dapet tugas koding Python Machine Learning yang numpuk bareng ujian praktikum lain. Penjelasannya lengkap, dikasih komen di tiap baris kodenya jadi gampang pas ditanya dosen pembimbing. Terbaik Skyber!",
    serviceCompleted: "Pemrograman & Koding"
  },
  {
    id: "rev2",
    name: "Nabila Putri",
    campus: "Universitas Gadjah Mada (UGM)",
    major: "Sosiologi",
    rating: 5,
    date: "3 hari lalu",
    text: "Bikin essay sosiologi 8 halaman pakai referensi jurnal internasional SINTA 2 beres hanya dalam 2 hari. Nilainya dapet A, dan pas dicek Turnitin cuma lolos 8%. Rahasia aman banget, makasih min!",
    serviceCompleted: "Esai & Karya Ilmiah"
  },
  {
    id: "rev3",
    name: "Fahri Ramadhan",
    campus: "Institut Teknologi Bandung (ITB)",
    major: "Teknik Sipil",
    rating: 4.8,
    date: "1 minggu lalu",
    text: "Penghitungan mekanika tekniknya teliti banget dikasih step-by-step PDF rapi. Sempet ada revisi soalnya parameternya diganti dosen tengah jalan, tapi dapet gratis revisi langsung dikerjakan malam itu juga.",
    serviceCompleted: "Laporan & Matematika/Sains"
  },
  {
    id: "rev4",
    name: "Jessica Lauren",
    campus: "BINUS University",
    major: "Manajemen Bisnis",
    rating: 5,
    date: "2 minggu lalu",
    text: "Slide deck PPT untuk ujian bisnis bener-bener bagus banget, desainnya clean gak alay kayak template gratisan. Speaker notes-nya juga detail jadi tinggal baca pas presentasi. Rekomen banget buat anak magang sambil kuliah.",
    serviceCompleted: "PPT & Desain"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Apakah identitas data diri saya aman dan rahasia?",
    answer: "100% DIJAMIN AMAN. Kami menerapkan enkripsi ketat pada data pesanan Anda. Seluruh tim ahli kami diikat komitmen kerahasiaan. Hubungan kami dengan klien bersifat konfidensial penuh, file hasil tugas akan dihapus dari server kami setelah 14 hari pesanan selesai."
  },
  {
    question: "Bagaimana jika hasil tugas terbukti plagiat atau di atas batas Turnitin?",
    answer: "Tugas jenis tertulis selalu kami lengkapi dengan melampirkan file Laporan Turnitin Check gratis. Batas aman plagiasi standar kami adalah di bawah 15%. Jika hasil melebihi kesepakatan awal, kami revisi gratis sampai aman."
  },
  {
    question: "Apakah saya bisa meminta revisi jika ada kesalahan?",
    answer: "Tentu saja. Anda mendapatkan fasilitas Gratis Revisi tanpa batas selama 7 hari setelah tugas diserahkan, asalkan revisi tidak keluar dari instruksi tugas atau dokumen awal yang Anda kirimkan saat pertama memesan."
  },
  {
    question: "Berapa lama estimasi pengerjaan tersingkat?",
    answer: "Sistem kilat kami mendukung pengerjaan Express dalam jangka waktu 6 hingga 12 jam (tergantung tingkat kesulitan dan ketersediaan spesialis Skyber). Tentu ada penyesuaian biaya untuk layanan kilat."
  },
  {
    question: "Bagaimana sistem pembayarannya?",
    answer: "Kami mendukung skema pembayaran fleksibel. Bisa DP (Uang Muka) sebesar 50% di awal sebagai tanda komitmen kerja, lalu sisa pengetikan/koding dilunasi setelah kami menunjukkan bukti draf pengerjaan setengah/penuh dalam bentuk tangkapan layar/video."
  }
];

export const INITIAL_TRACKING: SimulatedOrder[] = [
  {
    id: "SKY-1249",
    title: "Skrip Analisis Sentimen Twitter Python",
    category: "Pemrograman & Koding",
    price: "Rp 350.000",
    deadline: "Besok pukul 17:00",
    status: "Review Kualitas",
    progressBar: 85,
    createdAt: "2026-06-01"
  },
  {
    id: "SKY-1253",
    title: "Essay Analisis Kebijakan Moneter BI",
    category: "Studi Kasus Bisnis & Akuntansi",
    price: "Rp 180.000",
    deadline: "3 Juni 2026",
    status: "Pengerjaan",
    progressBar: 55,
    createdAt: "2026-06-02"
  },
  {
    id: "SKY-1255",
    title: "PPT Presentasi Hukum Internasional",
    category: "PPT & Desain Bahan Ajar",
    price: "Rp 90.000",
    deadline: "5 Juni 2026",
    status: "Analisis Spesifikasi",
    progressBar: 20,
    createdAt: "2026-06-02"
  }
];
