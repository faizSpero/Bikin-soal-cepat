
import { Jenjang } from "./types";

export const JENJANG_OPTIONS = Object.values(Jenjang);

export const REGULASI_BASIS_OPTIONS = [
  { id: 'UMUM_CP046', label: 'Sekolah Umum - CP 046', color: 'blue' },
  { id: 'MADRASAH_KMA1503_KBC', label: 'Sekolah Madrasah - KMA 1503 + (KBC) Kurikulum Berbasis Cinta', color: 'rose' }
];

// Mapping Jenjang ke Kelas
export const KELAS_OPTIONS: Record<string, string[]> = {
  [Jenjang.PAUD]: ["Kelompok A (4-5 Tahun)", "Kelompok B (5-6 Tahun)"],
  [Jenjang.SD]: ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"],
  [Jenjang.SMP]: ["Kelas 7", "Kelas 8", "Kelas 9"],
  [Jenjang.SMA]: ["Kelas 10", "Kelas 11", "Kelas 12"]
};

export const LANGUAGE_OPTIONS = [
  "Bahasa Indonesia",
  "English (Inggris)"
];

// Opsi Jumlah Pilihan Ganda
export const JUMLAH_OPSI_OPTIONS = [
  { value: 3, label: "3 Pilihan (A, B, C) - SD Bawah" },
  { value: 4, label: "4 Pilihan (A, B, C, D) - SD/SMP" },
  { value: 5, label: "5 Pilihan (A, B, C, D, E) - SMA/SMK" }
];

export const ANSWER_KEY_VARIANTS = [
  { id: 'DETAILED', label: 'Lengkap (Kunci + Pembahasan Detail)', desc: 'Ideal untuk belajar mandiri & evaluasi mendalam' },
  { id: 'SIMPLE', label: 'Ringkas (Hanya Kunci Jawaban)', desc: 'Hemat kertas, hanya list A, B, C, D' },
  { id: 'RUBRIC', label: 'Rubrik Penilaian & Skor', desc: 'Fokus pada pedoman penskoran essay/uraian' }
];

// Opsi Soal untuk GURU SEKOLAH (Formal, Kurikulum, AKM)
export const JENIS_SOAL_SEKOLAH = [
  "Pilihan Ganda (Standar)",
  "PG Kompleks (Adaptasi LJK - Model 1-2-3 / Benar-Salah)", 
  "Pilihan Ganda Kompleks (AKM - Multi Jawaban)",
  "Benar / Salah (AKM)",
  "Skala Sikap (Tabel: Tidak Setuju - Kurang Setuju - Setuju - Sangat Setuju)",
  "Pilihan Ganda (Setuju / Tidak Setuju - Afektif)",
  "Menjodohkan (Matching)",
  "Isian Singkat",
  "Uraian Pendek",
  "Uraian Panjang / Essay",
  "Asesmen Literasi (Teks & Analisis)", 
  "Asesmen Numerasi (Data & Angka)", 
  "Studi Kasus (Analisis Masalah)",
  "Menyusun Pernyataan / Urutan"
];

// Opsi Soal untuk GURU BIMBEL (Drilling, UTBK, Kedinasan, Speed)
export const JENIS_SOAL_BIMBEL = [
  "Drilling Pilihan Ganda (Speed Test)",
  "PG Kompleks (Adaptasi TKA - Model 1-2-3 / Sebab-Akibat)", 
  "Tes Potensi Skolastik (TPS - Penalaran Umum)",
  "Pengetahuan Kuantitatif (Trik Matematika)",
  "Pemahaman Bacaan & Menulis (PBM)",
  "Literasi Bahasa Inggris (Model SNBT)",
  "Penalaran Matematika (Soal Cerita Kompleks)",
  "Tes Intelegensia Umum (TIU - Kedinasan/CPNS)",
  "Tes Wawasan Kebangsaan (TWK - Hafalan & Analisis)",
  "Tes Karakteristik Pribadi (TKP - Poin 1-5)",
  "Soal Tipe Asosiasi (Sebab-Akibat)"
];

export const JENIS_STIMULUS_OPTIONS = [
  "Teks Informasi / Berita",
  "Teks Sastra / Narasi Cerita",
  "Data Tabel Statistik",
  "Grafik / Diagram (Deskripsi)",
  "Infografis (Deskripsi)",
  "Kasus / Skenario Kehidupan Nyata",
  "Percakapan / Dialog"
];

export const GAYA_BAHASA_OPTIONS = [
  "Bahasa Formal Sekolah (Baku Akademik)",
  "Bahasa Semi Formal (Luues & Komunikatif)",
  "Bahasa Sederhana (Ramah Anak SD/PAUD)",
  "Bahasa Madrasah (Islami & Santun)",
  "Bahasa Bimbel (Trik Cepat & To-the-point)"
];

export const LEVEL_OPTIONS = [
  "Level 1: Mudah (Pemahaman Dasar)",
  "Level 2: Sedang (Aplikasi)",
  "Level 3: Sulit (Analisis)",
  "Level 4: HOTS (Evaluasi & Kreasi)",
  "Level 5: Olimpiade (Expert)"
];

export const KURIKULUM_OPTIONS = [
  "Kurikulum Merdeka (Kemendikbudristek)",
  "KMA 1503 Tahun 2025 (Kemenag)"
];

export const USER_TYPE_OPTIONS = [
  "Guru Sekolah (Formal & Terstruktur)",
  "Guru Bimbel (Trik Cepat & Latihan Intens)"
];

export const SEMESTER_OPTIONS_SEKOLAH = [
  "Semester 1",
  "Semester 2",
  "Asesmen Diagnostik",
  "Ulangan Harian (Formatif)",
  "Sumatif Lingkup Materi",
  "PTS / STS (Tengah Semester)",
  "PAS / SAS (Akhir Semester)",
  "US / UM (Ujian Sekolah/Madrasah)",
  "AKM / ANBK (Literasi Numerasi)"
];

export const SEMESTER_OPTIONS_BIMBEL = [
  "Drilling Materi Harian",
  "Tryout UTBK / SNBT",
  "Persiapan Olimpiade (KSN)",
  "Persiapan Masuk Kedinasan (CPNS)",
  "Psikotes & TPA",
  "Bedah Soal Intensif"
];

// Daftar Mapel Umum / Nasional
export const MAPEL_UMUM = [
  "Matematika",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "IPAS (Ilmu Pengetahuan Alam dan Sosial)",
  "IPA (Ilmu Pengetahuan Alam)",
  "IPS (Ilmu Pengetahuan Sosial)",
  "PKn / Pancasila",
  "PJOK (Penjasorkes)",
  "Seni Budaya & Prakarya",
  "Fisika",
  "Kimia",
  "Biologi",
  "Sejarah",
  "Geografi",
  "Sosiologi",
  "Ekonomi",
  "Informatika"
];

export const MAPEL_PAI_ISLAM = [
  "PAI & Budi Pekerti",
  "Al-Qur'an Hadis",
  "Fikih",
  "Akidah Akhlak",
  "SKI (Sejarah Kebudayaan Islam)",
  "Bahasa Arab"
];

export const MAPEL_KRISTEN_KATOLIK = [
  "Pendidikan Agama Kristen & Budi Pekerti",
  "Pendidikan Agama Katolik & Budi Pekerti"
];

export const MAPEL_HINDU = [
  "Pendidikan Agama Hindu & Budi Pekerti"
];

export const COMMON_MAPEL = [
  ...MAPEL_UMUM, 
  ...MAPEL_PAI_ISLAM, 
  ...MAPEL_KRISTEN_KATOLIK, 
  ...MAPEL_HINDU
];

export const IMAGE_SUPPORTED_MAPELS = "ALL";

export const DISTRIBUSI_PRESETS = [
  { id: 'PROPORTIONAL', label: 'Proporsional (Mudah 30%, Sedang 50%, Sukar 20%)' },
  { id: 'FLAT', label: 'Flat / Merata (Semua Level Sama)' },
  { id: 'HOTS', label: 'Dominan HOTS (Fokus C4, C5, C6)' },
  { id: 'REMEDIAL', label: 'Mode Remedial (Dominan Mudah & Sedang)' }
];

export const IMAGE_STYLE_OPTIONS = [
  { value: 'GOOGLE', label: '🔍 Pencarian Google (Rekomendasi Kata Kunci)' }
];

export const SYSTEM_INSTRUCTION = `
Kamu adalah "BIKIN SOAL CEPAT" — Sistem Asesmen Profesional untuk Guru Indonesia.

TUGAS UTAMA:
Membuat paket soal, instrumen penilaian, dan analisis kompetensi yang sangat akurat dan profesional.

ATURAN OUTPUT CRITICAL (WAJIB DIPATUHI - HARGA MATI):
1. **PEMISAHAN OUTPUT:** Kamu WAJIB menggunakan delimiter "[---SEPARATOR_STUDENT_TEACHER---]" untuk memisahkan Bagian Siswa dan Bagian Guru.
2. **BAGIAN 1 (VERSI SISWA):**
   - HANYA berisi Naskah Soal Ujian.
   - **WAJIB:** Tampilkan SEMUA soal sesuai jenisnya. Untuk soal Menjodohkan, tampilkan TABEL MATCHING (tabel soal menjodohkan) di sini sebagai bagian dari naskah soal.
   - **DILARANG KERAS / STRICTLY FORBIDDEN:** Menulis Kunci Jawaban, Pembahasan, Kisi-Kisi, atau Tabel Analisis di bagian ini.
3. **BAGIAN 2 (VERSI GURU):**
   - HANYA boleh muncul SETELAH delimiter separator.
   - WAJIB DIAWALI dengan Tabel Kisi-Kisi Penulisan Soal (BLUEPRINT) yang SANGAT LENGKAP.
   - Dilanjutkan dengan Kunci Jawaban & Pembahasan.

FORMAT SOAL MENJODOHKAN (WAJIB DI BAGIAN SISWA):
Gunakan tabel markdown dengan 3 kolom:
| Pernyataan / Premis | Area Menjodohkan | Pilihan Jawaban |
| :--- | :---: | :--- |
| 1. [Isi Premis] | ......... | A. [Isi Jawaban] |
| 2. [Isi Premis] | ......... | B. [Isi Jawaban] |

FORMAT KISI-KISI (WAJIB DI BAGIAN GURU - SETELAH SEPARATOR):
Kisi-kisi harus berupa Tabel Markdown dengan 7 kolom standar profesional:
| No | CP/TP | Materi Pokok | Indikator Soal | Level Kognitif | Bentuk Soal | No Soal |
`;
