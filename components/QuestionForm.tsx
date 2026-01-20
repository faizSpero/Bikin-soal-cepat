
import React, { useState, useRef } from 'react';
import { QuestionRequest } from '../types';
import mammoth from 'mammoth';
import { 
  JENJANG_OPTIONS, 
  KELAS_OPTIONS,
  LEVEL_OPTIONS, 
  JENIS_SOAL_SEKOLAH,
  JENIS_SOAL_BIMBEL,
  COMMON_MAPEL,
  MAPEL_UMUM,
  KURIKULUM_OPTIONS, 
  SEMESTER_OPTIONS_SEKOLAH,
  SEMESTER_OPTIONS_BIMBEL,
  USER_TYPE_OPTIONS,
  GAYA_BAHASA_OPTIONS,
  JENIS_STIMULUS_OPTIONS,
  DISTRIBUSI_PRESETS,
  LANGUAGE_OPTIONS,
  JUMLAH_OPSI_OPTIONS,
  REGULASI_BASIS_OPTIONS
} from '../constants';
import { 
  School,
  X,
  Settings,
  Layers,
  CheckSquare,
  Image as ImageIcon,
  UploadCloud,
  FileText,
  Loader2,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  Zap,
  FileUp,
  ShieldCheck
} from 'lucide-react';

interface QuestionFormProps {
  request: QuestionRequest;
  onChange: (field: keyof QuestionRequest, value: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  isValid: boolean;
}

export const QuestionForm: React.FC<QuestionFormProps> = React.memo(({ 
  request, onChange, onSubmit, isLoading, currentStep, onNext, onPrev, isValid 
}) => {
  const [isManualMapel, setIsManualMapel] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isBimbel = request.userType === USER_TYPE_OPTIONS[1]; 
  const currentJenisSoalOptions = isBimbel ? JENIS_SOAL_BIMBEL : JENIS_SOAL_SEKOLAH;
  const currentKelasOptions = request.jenjang ? (KELAS_OPTIONS[request.jenjang] || []) : [];
  
  const ringFocusClass = "focus:ring-purple-500 focus:border-purple-500";
  const inputClass = `w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 shadow-sm transition-all ${ringFocusClass}`;
  const labelClass = "block text-xs font-extrabold text-purple-900 mb-2 uppercase tracking-wider";

  const handleJenisSoalToggle = (opt: string) => {
    const isSelected = request.jenisSoal.includes(opt);
    let newJenisSoal = [...request.jenisSoal];
    let newJumlahPerJenis = { ...request.jumlahPerJenis };

    if (isSelected) {
      newJenisSoal = newJenisSoal.filter(item => item !== opt);
      delete newJumlahPerJenis[opt];
    } else {
      newJenisSoal.push(opt);
      newJumlahPerJenis[opt] = 5; 
    }
    onChange('jenisSoal', newJenisSoal);
    onChange('jumlahPerJenis', newJumlahPerJenis);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    setIsParsingFile(true);

    try {
      if (extension === 'txt') {
        const text = await file.text();
        onChange('uploadedFileContent', text);
        onChange('uploadedFileName', file.name);
      } else if (extension === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        onChange('uploadedFileContent', result.value);
        onChange('uploadedFileName', file.name);
      } else {
        alert("Hanya file .txt atau .docx yang didukung.");
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Gagal membaca file. Pastikan file tidak rusak.");
    } finally {
      setIsParsingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    onChange('uploadedFileContent', '');
    onChange('uploadedFileName', '');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-purple-100 border border-purple-50 h-full flex flex-col no-print">
      <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden">
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 pb-4">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-extrabold text-purple-900">Identitas & Materi</h2>
              </div>

              {/* Basis Regulasi - Paling Atas */}
              <div className="space-y-3">
                <label className={labelClass}>Basis Kurikulum & Regulasi</label>
                <div className="grid grid-cols-1 gap-2">
                  {REGULASI_BASIS_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => onChange('regulasiBasis', opt.id)}
                      className={`flex items-start gap-3 p-4 rounded-2xl text-left transition-all border-2 ${
                        request.regulasiBasis === opt.id 
                          ? "bg-purple-50 border-purple-600 shadow-md ring-2 ring-purple-100" 
                          : "bg-white border-slate-100 hover:border-purple-200"
                      }`}
                    >
                      <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        request.regulasiBasis === opt.id ? 'bg-purple-600 border-purple-600' : 'border-slate-300'
                      }`}>
                        {request.regulasiBasis === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs font-black leading-tight ${request.regulasiBasis === opt.id ? 'text-purple-900' : 'text-slate-600'}`}>
                          {opt.label}
                        </span>
                        <span className="text-[9px] font-medium text-slate-400">
                          {opt.id === 'UMUM_CP046' ? 'Sesuai standar pendidikan nasional sekolah umum.' : 'Sesuai regulasi Kemenag terbaru & filosofi KBC.'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => onChange('userType', USER_TYPE_OPTIONS[0])}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-[11px] font-extrabold transition-all border-2 ${
                    !isBimbel ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200" : "bg-white text-slate-400 border-slate-100 hover:border-purple-200"
                  }`}
                >
                  <School className="w-4 h-4" /> SEKOLAH
                </button>
                <button
                  onClick={() => onChange('userType', USER_TYPE_OPTIONS[1])}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-[11px] font-extrabold transition-all border-2 ${
                    isBimbel ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200" : "bg-white text-slate-400 border-slate-100 hover:border-purple-200"
                  }`}
                >
                  <Zap className="w-4 h-4" /> BIMBEL
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Bahasa Pengantar</label>
                    <select value={request.language} onChange={(e) => onChange('language', e.target.value)} className={inputClass}>
                      {LANGUAGE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Jenjang</label>
                    <select value={request.jenjang} onChange={(e) => { onChange('jenjang', e.target.value); onChange('kelas', ''); }} className={inputClass}>
                      <option value="" disabled>Pilih Jenjang</option>
                      {JENJANG_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Mata Pelajaran</label>
                    {isManualMapel ? (
                      <div className="flex gap-2">
                        <input type="text" value={request.mapel} onChange={(e) => onChange('mapel', e.target.value)} placeholder="Mapel..." className={inputClass} autoFocus />
                        <button onClick={() => { setIsManualMapel(false); onChange('mapel', ''); }} className="px-3 bg-slate-100 rounded-xl text-slate-400"><X className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      <select value={COMMON_MAPEL.includes(request.mapel) ? request.mapel : ''} onChange={(e) => e.target.value === 'OTHER_MANUAL' ? setIsManualMapel(true) : onChange('mapel', e.target.value)} className={inputClass}>
                        <option value="" disabled>Pilih Mapel</option>
                        {MAPEL_UMUM.map(m => <option key={m} value={m}>{m}</option>)}
                        <option value="OTHER_MANUAL" className="text-purple-600 font-bold">+ Ketik Manual...</option>
                      </select>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Kelas</label>
                    <select value={request.kelas} onChange={(e) => onChange('kelas', e.target.value)} disabled={!request.jenjang} className={inputClass}>
                      <option value="" disabled>{request.jenjang ? "Pilih Kelas" : "Pilih Jenjang Dulu"}</option>
                      {currentKelasOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-purple-50 rounded-3xl border border-purple-100 space-y-4">
                <div>
                  <label className={labelClass}>Topik / Materi Utama</label>
                  <input type="text" value={request.topik} onChange={(e) => onChange('topik', e.target.value)} placeholder="Contoh: Fotosintesis, Trigonometri..." className={inputClass} />
                </div>
                
                {/* File Upload Section */}
                <div className="mt-2">
                  <label className={labelClass}>Gunakan Referensi Materi (Opsional)</label>
                  {request.uploadedFileName ? (
                    <div className="flex items-center justify-between p-3 bg-white border border-purple-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate">{request.uploadedFileName}</span>
                      </div>
                      <button onClick={removeFile} className="p-1 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed border-purple-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 hover:border-purple-400 transition-all ${isParsingFile ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {isParsingFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                          <span className="text-[10px] font-bold text-purple-400 uppercase">Membaca File...</span>
                        </div>
                      ) : (
                        <>
                          <FileUp className="w-6 h-6 text-purple-400 mb-2" />
                          <span className="text-[10px] font-bold text-purple-400 uppercase text-center">Upload File Word / Text (.docx, .txt)</span>
                        </>
                      )}
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept=".txt,.docx" 
                    className="hidden" 
                  />
                  <p className="text-[9px] text-slate-400 font-medium mt-2 italic">* AI akan menggunakan isi file sebagai konteks utama pembuatan soal.</p>
                </div>

                <div>
                   <label className={labelClass}>Program / Semester</label>
                   <select value={request.semester} onChange={(e) => onChange('semester', e.target.value)} className={inputClass}>
                     <option value="" disabled>Pilih Program</option>
                     {(isBimbel ? SEMESTER_OPTIONS_BIMBEL : SEMESTER_OPTIONS_SEKOLAH).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
               <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-extrabold text-purple-900">Struktur Soal</h2>
              </div>

              <div className="space-y-4">
                <label className={labelClass}>Pilih Jenis Soal (Bisa lebih dari satu)</label>
                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {currentJenisSoalOptions.map((opt) => {
                    const isSelected = request.jenisSoal.includes(opt);
                    return (
                      <div key={opt} onClick={() => handleJenisSoalToggle(opt)} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${isSelected ? 'bg-purple-50 border-purple-500 shadow-md' : 'bg-white border-slate-100 hover:border-purple-200'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${isSelected ? 'text-purple-900' : 'text-slate-600'}`}>{opt}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-purple-600 border-purple-600 shadow-sm' : 'border-slate-300'}`}>
                            {isSelected && <CheckSquare className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-3 pl-2" onClick={e => e.stopPropagation()}>
                            <label className="text-[10px] font-black text-purple-400 uppercase">Jumlah:</label>
                            <input type="number" min="1" value={request.jumlahPerJenis[opt]} onChange={e => onChange('jumlahPerJenis', {...request.jumlahPerJenis, [opt]: parseInt(e.target.value) || 0})} className="w-20 p-2 bg-white border border-purple-200 rounded-lg text-xs font-bold text-center" />
                            <span className="text-[10px] font-bold text-slate-400">Butir</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-900 rounded-2xl text-center shadow-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Soal</span>
                    <span className="text-2xl font-black text-white">{request.jumlah}</span>
                 </div>
                 <div className="p-4 bg-purple-100 rounded-2xl text-center border border-purple-200">
                    <label className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block mb-1">Opsi Pilihan Ganda</label>
                    <select value={request.jumlahOpsi} onChange={e => onChange('jumlahOpsi', parseInt(e.target.value))} className="bg-transparent text-sm font-bold text-purple-900 w-full text-center outline-none">
                       {JUMLAH_OPSI_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label.split('(')[0]}</option>)}
                    </select>
                 </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
               <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-extrabold text-purple-900">Kualitas & Lanjutan</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Level Kognitif Dominan</label>
                    <select value={request.level} onChange={e => onChange('level', e.target.value)} className={inputClass}>
                      <option value="" disabled>Pilih Level</option>
                      {LEVEL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Distribusi Kesulitan</label>
                    <select value={request.distribusiMode} onChange={e => onChange('distribusiMode', e.target.value)} className={inputClass}>
                      {DISTRIBUSI_PRESETS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                   <div>
                    <label className={labelClass}>Gaya Bahasa</label>
                    <select value={request.gayaBahasa} onChange={e => onChange('gayaBahasa', e.target.value)} className={inputClass}>
                      <option value="" disabled>Pilih Gaya Bahasa</option>
                      {GAYA_BAHASA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-purple-900 uppercase">Mode Gambar</span>
                    </div>
                    <input type="checkbox" checked={request.enableImageMode} onChange={e => onChange('enableImageMode', e.target.checked)} className="w-5 h-5 accent-purple-600" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Gunakan Stimulus</span>
                  </div>
                  <input type="checkbox" checked={request.useStimulus} onChange={e => onChange('useStimulus', e.target.checked)} className="w-5 h-5 accent-purple-600" />
                </div>
                {request.useStimulus && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
                     <select value={request.jenisStimulus} onChange={e => onChange('jenisStimulus', e.target.value)} className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold">
                       <option value="">Jenis Stimulus...</option>
                       {JENIS_STIMULUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                     </select>
                     <select value={request.soalPerStimulus} onChange={e => onChange('soalPerStimulus', parseInt(e.target.value))} className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold">
                       <option value="3">3 Soal/Stimulus</option>
                       <option value="5">5 Soal/Stimulus</option>
                     </select>
                  </div>
                )}
              </div>

              <div className="bg-purple-900 p-6 rounded-3xl text-white shadow-xl shadow-purple-200 relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="text-sm font-black mb-1 uppercase tracking-[0.2em] opacity-80">Konfirmasi Akhir</h3>
                   <p className="text-[10px] font-medium text-purple-200 leading-relaxed max-w-[80%]">Sistem AI akan meracik soal sesuai kurikulum pilihan Anda dengan kedalaman materi "{request.topik || 'Topik Pilihan'}" untuk level {request.level || 'Pilihan'}.</p>
                </div>
                <div className="absolute -right-4 -bottom-4 bg-white/10 p-10 rounded-full blur-2xl"></div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 flex gap-4 mt-auto">
          {currentStep > 1 && (
            <button onClick={onPrev} className="flex-1 py-4 px-6 rounded-2xl font-black text-purple-600 border-2 border-purple-100 hover:bg-purple-50 transition-all flex justify-center items-center gap-2 text-xs uppercase tracking-widest">
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
          )}
          <button
            onClick={currentStep === 3 ? onSubmit : onNext}
            disabled={isLoading || !isValid}
            className={`flex-[2] py-4 px-6 rounded-2xl font-black text-white shadow-xl transition-all flex justify-center items-center gap-3 text-xs uppercase tracking-[0.2em]
              ${isLoading || !isValid ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-purple-600 hover:bg-purple-700 active:scale-[0.98] shadow-purple-200'}`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5"/>
            ) : currentStep === 3 ? (
              <>GENERATE SOAL <Sparkles className="w-4 h-4"/></>
            ) : (
              <>Lanjut <ChevronRight className="w-4 h-4"/></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
