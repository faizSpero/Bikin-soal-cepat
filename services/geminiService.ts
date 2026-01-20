
import { GoogleGenAI } from "@google/genai";
import { QuestionRequest, RefineActionType } from "../types";
import { SYSTEM_INSTRUCTION, DISTRIBUSI_PRESETS, IMAGE_SUPPORTED_MAPELS, REGULASI_BASIS_OPTIONS } from "../constants";

export const generateQuestions = async (request: QuestionRequest): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const isEnglish = request.language.toLowerCase().includes("english") || request.language.toLowerCase().includes("inggris");

  // Get Regulation Context
  const regulasiLabel = REGULASI_BASIS_OPTIONS.find(r => r.id === request.regulasiBasis)?.label || "Sekolah Umum";
  const regulasiInstruction = `**BASIS REGULASI & KURIKULUM (WAJIB DIIKUTI):** ${regulasiLabel}. 
  ${request.regulasiBasis === 'MADRASAH_KMA1503_KBC' 
    ? 'Anda wajib menyisipkan nilai-nilai "Kurikulum Berbasis Cinta" (KBC) yang menekankan kasih sayang, karakter santun, dan nilai religius moderat dalam stimulus atau soal.' 
    : 'Anda wajib mengikuti standar kompetensi nasional CP 046 secara ketat.'}`;

  // Build Breakdown String from jumlahPerJenis
  const breakdownList = request.jenisSoal.map(jenis => {
    const qty = request.jumlahPerJenis[jenis] || 5; 
    return `${qty} ${isEnglish ? 'items' : 'butir'} ${jenis}`;
  });
  const breakdownString = breakdownList.join(', ');

  // Logic Distribusi
  const distLabel = DISTRIBUSI_PRESETS.find(d => d.id === request.distribusiMode)?.label || "Proporsional";
  
  // Logic Kompetensi
  let kompetensiInstruction = "";
  if (isEnglish) {
    kompetensiInstruction = request.kompetensiMode === 'MANUAL'
      ? `adhering to these specific Competency Standards (CP/TP): "${request.kompetensiManual}"`
      : `automatically using the most relevant Learning Objectives (CP/TP) for this grade level.`;
  } else {
    kompetensiInstruction = request.kompetensiMode === 'MANUAL'
      ? `berdasarkan Capaian Pembelajaran (CP) / Tujuan Pembelajaran (TP) spesifik ini: "${request.kompetensiManual}"`
      : `menentukan secara otomatis Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) yang paling relevan dengan kurikulum nasional.`;
  }

  // Logic Opsi Jawaban
  const numOptions = request.jumlahOpsi || 4; 
  const getLetters = (n: number) => {
    return Array.from({length: n}, (_, i) => String.fromCharCode(65 + i)).join(', ');
  };
  const optionLetters = getLetters(numOptions);

  let optionsInstruction = "";
  if (isEnglish) {
    optionsInstruction = `**ANSWER OPTIONS RULE:** For Multiple Choice questions, you MUST provide **${numOptions} OPTIONS (${optionLetters})**.`; 
  } else {
    optionsInstruction = `**ATURAN OPSI JAWABAN:** Untuk soal Pilihan Ganda, WAJIB sediakan **${numOptions} OPSI (${optionLetters})**.`;
  }

  // LOGIC GAMBAR
  let imageInstruction = "";
  if (request.enableImageMode && request.imageQuantity > 0) {
    const qtyImg = request.imageQuantity;
    imageInstruction = isEnglish ? `
    **MANDATORY IMAGE MODE (GOOGLE SEARCH):**
    For ${qtyImg} questions, you MUST provide optimized Google Search Keywords in this format: [IMAGE_GOOGLE: Keyword]
    ` : `
    **WAJIB MODE GAMBAR (PENCARIAN GOOGLE):**
    Untuk ${qtyImg} soal, Anda WAJIB menyediakan kata kunci pencarian Google yang efektif dengan format: [IMAGE_GOOGLE: Kata Kunci]
    `;
  }

  // MATH FORMAT & TOPIC STRICTNESS
  const isNumerasi = request.jenisSoal.some(j => j.toLowerCase().includes("numerasi"));
  const isMath = request.mapel.toLowerCase().includes("matematika") || request.mapel.toLowerCase().includes("math") || isNumerasi;
  
  const mathInstruction = isMath ? (isEnglish ? `
    **STRICT MATH TOPIC RULE:** 
    You MUST focus ONLY on "${request.topik}" and "${request.subElemen}". 
    DO NOT generate unrelated math topics (e.g., if the topic is Statistics, DO NOT generate Geometry/Algebra). 
    Use plain text only (no LaTeX).
  ` : `
    **ATURAN KETAT MATERI MATEMATIKA:** 
    Anda WAJIB fokus HANYA pada materi "${request.topik}" dan "${request.subElemen}". 
    DILARANG KERAS membuat soal di luar topik tersebut (Misal: jika topik adalah STATISTIKA/DATA, dilarang membuat soal Aljabar, Geometri, atau Akar).
    Gunakan TEKS BIASA (Plain Text), jangan gunakan LaTeX.
  `) : "";
  
  // Logic Stimulus
  let stimulusInstruction = request.useStimulus
    ? (isEnglish ? `MANDATORY STIMULUS USE. Every ${request.soalPerStimulus || 3} questions must be preceded by ONE Stimulus.` : `WAJIB GUNAKAN STIMULUS. Setiap ${request.soalPerStimulus || 3} soal harus didahului oleh SATU Stimulus.`)
    : "";

  // INSTRUKSI VISUAL
  const visualInstructions = isEnglish ? `
    **VISUAL FORMAT RULES (FOR STUDENT SECTION):**
    - **MATCHING (MATCHING)**: Use a 3-column Markdown Table.
      HEADERS: | Premise / Question | Matching Area | Answer Options |
      CELLS: | 1. [Text] | ......... | A. [Text] |
  ` : `
    **ATURAN FORMAT VISUAL (WAJIB DI BAGIAN SISWA):**
    - **MENJODOHKAN (MATCHING)**: Gunakan Tabel Markdown 3 kolom.
      HEADER: | Pernyataan / Premis | Area Menjodohkan | Pilihan Jawaban |
      ISI: | 1. [Teks] | ......... | A. [Teks] |
    - **BENAR / SALAH**: Tabel Markdown | Pernyataan | Benar | Salah |.
  `;

  const answerKeyInstruction = request.answerKeyDetail === 'SIMPLE' 
    ? (isEnglish ? "Provide ONLY a simple list of Answer Keys." : "Hanya sediakan Tabel Kunci Jawaban Ringkas.")
    : (isEnglish ? "Provide Comprehensive Answer Keys and Explanations." : "Sertakan Kunci Jawaban lengkap dengan Pembahasan.");

  // Build the Core Material Context
  let materialContext = isEnglish 
    ? `**STRICT SUBJECT CONTEXT (TOP PRIORITY):**
       Subject: ${request.mapel}
       Core Topic: ${request.topik.toUpperCase()}
       Sub-topic/Element: ${request.subElemen?.toUpperCase() || 'Focus on Core Topic'}
       
       **CRITICAL RULE:** Do NOT deviate from this topic. Every single question must be related to this topic.`
    : `**KONTEKS MATERI WAJIB (PRIORITAS UTAMA):**
       Mata Pelajaran: ${request.mapel}
       Topik Utama: ${request.topik.toUpperCase()}
       Sub-materi/Elemen: ${request.subElemen?.toUpperCase() || 'Sesuai dengan Topik Utama'}
       
       **PERINTAH KETAT:** DILARANG melenceng dari topik di atas. Seluruh butir soal WAJIB relevan dengan topik ini.`;

  if (request.uploadedFileContent) {
    materialContext += `\n**REFERENCE TEXT (MUST USE CONTENT FROM HERE):** ${request.uploadedFileContent.slice(0, 15000)}`;
  }
  
  const promptText = isEnglish ? `
    Create a **PROFESSIONAL EXAM PAPER** based on this specific context:
    
    ${regulasiInstruction}
    ${materialContext}
    
    Competency: ${kompetensiInstruction}
    Language: ${request.language} | Level: ${request.jenjang} (${request.kelas})
    Breakdown: ${breakdownString} | Difficulty Distribution: ${distLabel} | Target Level: ${request.level}
    
    ${optionsInstruction}
    ${stimulusInstruction}
    ${mathInstruction}
    ${imageInstruction}
    ${visualInstructions}

    **STRICT OUTPUT STRUCTURE:**
    1. **PART 1: STUDENT SECTION** -> Questions ONLY. Check again: Do they match the core topic?
    2. **SEPARATOR**: "[---SEPARATOR_STUDENT_TEACHER---]"
    3. **PART 2: TEACHER SECTION** -> Detailed Blueprint (First) then Answer Keys (${answerKeyInstruction}).
  ` : `
    Buatkan **PAKET SOAL UJIAN PROFESIONAL** dengan konteks spesifik berikut:
    
    ${regulasiInstruction}
    ${materialContext}
    
    Kompetensi: ${kompetensiInstruction}
    Bahasa: ${request.language} | Jenjang: ${request.jenjang} (${request.kelas})
    Rincian: ${breakdownString} | Distribusi Kesulitan: ${distLabel} | Target Level: ${request.level}
    
    ${optionsInstruction}
    ${stimulusInstruction}
    ${mathInstruction}
    ${imageInstruction}
    ${visualInstructions}

    **STRUKTUR OUTPUT (WAJIB):**
    1. **BAGIAN 1: VERSI SISWA** -> HANYA naskah soal. Pastikan kembali: Apakah semua soal sudah sesuai topik utama di atas?
    2. **SEPARATOR**: "[---SEPARATOR_STUDENT_TEACHER---]"
    3. **BAGIAN 2: VERSI GURU** -> Kisi-kisi (Blueprint) Detail paling atas, lalu Kunci Jawaban & Pembahasan (${answerKeyInstruction}).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      }
    });

    return response.text || "AI tidak memberikan respons.";
  } catch (error) {
    throw new Error(`Gagal membuat soal: ${error instanceof Error ? error.message : "Kesalahan AI"}`);
  }
};

export const refineContent = async (originalContent: string, action: RefineActionType): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Refine this content based on: ${action}.\n\nOriginal: ${originalContent}\n\nMaintain [Student Section] [Separator] [Teacher Section] structure.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { temperature: 0.65 }
    });
    return response.text || "";
  } catch (e) { throw new Error("Refinement failed."); }
};
