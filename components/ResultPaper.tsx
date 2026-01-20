
import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Copy, 
  FileText, 
  ShieldCheck, 
  TableProperties, 
  Split, 
  TrendingUp, 
  RefreshCw, 
  BookOpen,
  GraduationCap,
  UserCheck,
  CopyCheck,
  ArrowRightLeft,
  Files,
  Microscope,
  Shuffle,
  Layers,
  MoreHorizontal,
  Square,
  CheckSquare,
  Image as ImageIcon,
  Search,
  Eye,
  FileDown,
  Table,
  Loader2,
  Wifi,
  Server,
  Layers as LayersIcon
} from 'lucide-react';
import { RefineActionType } from '../types';

interface ResultPaperProps {
  content: string | null;
  error: string | null;
  isLoading: boolean;
  onRefine: (action: RefineActionType) => void;
  isRefining: boolean;
}

type ViewMode = 'STUDENT' | 'TEACHER' | 'BLUEPRINT';

export const ResultPaper: React.FC<ResultPaperProps> = React.memo(({ content, error, isLoading, onRefine, isRefining }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState('TEACHER' as ViewMode);

  const SEPARATOR = "[---SEPARATOR_STUDENT_TEACHER---]";

  const displayContent = useMemo(() => {
    const rawContent = content || "";
    const parts = rawContent.split(SEPARATOR);
    const studentContent = parts[0] || "";
    const teacherContent = parts.length > 1 ? parts[1] : "";
    const TEACHER_HEADER_DISPLAY = "\n\n" + "--- 🔒 ANSWER KEY, BLUEPRINT & TEACHER GUIDELINES / KUNCI & KISI-KISI ---" + "\n\n";

    if (viewMode === 'TEACHER') {
      return parts.length > 1 ? studentContent + TEACHER_HEADER_DISPLAY + teacherContent : studentContent;
    } else if (viewMode === 'BLUEPRINT') {
      if (!teacherContent) return "⚠️ Maaf, kisi-kisi tidak ditemukan.";
      const answerKeyPattern = /(?:^|\n)\s*(?:[-=_*#]*\s*)?(?:KUNCI\s+JAWABAN|ANSWER\s+KEYS?|PEMBAHASAN|JAWABAN\s+DAN\s+PEMBAHASAN)/i;
      const match = teacherContent.search(answerKeyPattern);
      return `## 📋 DOKUMEN KISI-KISI PENULISAN SOAL (BLUEPRINT)\n\n${match !== -1 ? teacherContent.substring(0, match).trim() : teacherContent}`;
    } else {
      let cleanContent = studentContent;
      const forbiddenPatterns = [
        /(?:^|\n)\s*(?:[-=_*#]*\s*)?(?:TABEL\s+)?KISI[-\s]?KISI/i,
        /(?:^|\n)\s*(?:[-=_*#]*\s*)?KUNCI\s+JAWABAN/i,
        /(?:^|\n)\s*(?:[-=_*#]*\s*)?PEMBAHASAN/i,
        /(?:^|\n)\s*(?:[-=_*#]*\s*)?BLUEPRINT/i
      ];
      let minMatchIndex = -1;
      for (const pattern of forbiddenPatterns) {
        const match = cleanContent.search(pattern);
        if (match !== -1 && (minMatchIndex === -1 || match < minMatchIndex)) minMatchIndex = match;
      }
      if (minMatchIndex !== -1) cleanContent = cleanContent.substring(0, minMatchIndex);
      return cleanContent;
    }
  }, [content, viewMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleDownloadDoc = () => {
    const element = document.getElementById('result-content-area');
    if (!element) return;
    const clone = element.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('a[href^="https://www.google.com/search"], button, .no-print, svg').forEach(el => el.remove());
    const contentHtml = clone.innerHTML;
    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Dokumen Soal</title><style>@page { size: A4; margin: 2.54cm; } body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #000000; } h1, h2, h3, h4 { margin-top: 15pt; margin-bottom: 5pt; } table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; } td, th { border: 1px solid #000000; padding: 5pt; vertical-align: top; font-size: 10pt; } th { background-color: #f0f0f0; font-weight: bold; }</style></head><body>`;
    const postHtml = "</body></html>";
    const blob = new Blob(['\ufeff', preHtml + contentHtml + postHtml], { type: 'application/msword' });
    let filename = viewMode === 'STUDENT' ? 'naskah-soal-siswa.doc' : viewMode === 'BLUEPRINT' ? 'kisi-kisi.doc' : 'paket-soal-lengkap.doc';
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  const parseText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => (part.startsWith('**') && part.endsWith('**')) ? <strong key={i} className="font-bold text-purple-900">{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>);
  };

  const formattedOutput = useMemo(() => {
    if (!displayContent) return null;
    const segments = displayContent.split(/(\[---SVG_START---\][\s\S]*?\[---SVG_END---\])/g);
    return segments.map((part, partIndex) => {
        if (part.startsWith('[---SVG_START---]')) return null;
        const lines = part.split('\n');
        let inTable = false;
        let tableRows: string[][] = [];

        const renderTable = (rows: string[][], keyPrefix: string) => {
          const headerRow = rows[0] || [];
          const headerStr = headerRow.join(' ').toLowerCase();
          const isMatching = headerStr.includes('premis') || headerStr.includes('jodoh') || headerStr.includes('matching');
          const isBlueprint = headerStr.includes('cp/tp') || headerStr.includes('materi pokok') || headerStr.includes('kisi-kisi');

          return (
            <div key={keyPrefix} className="overflow-x-auto my-6">
              <table className={`min-w-full border-collapse border border-slate-300 text-sm ${isBlueprint ? 'bg-purple-50/30' : ''}`}>
                <tbody>
                  {rows.map((row, rIdx) => {
                    const isHeader = rIdx === 0;
                    return (
                      <tr key={rIdx} className={isHeader ? "bg-purple-900 text-white font-bold" : ""}>
                        {row.map((cell, cIdx) => {
                          let cellClass = "border border-slate-300 p-3"; 
                          if (!isBlueprint && isMatching && cIdx === 1 && !isHeader) cellClass += " bg-slate-50 text-center italic opacity-50"; 
                          return <td key={cIdx} className={cellClass}>{parseText(cell)}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        };

        return lines.map((line, lineIndex) => {
            const cleanLine = line.trim();
            const key = `text-${partIndex}-${lineIndex}`;
            if (cleanLine.startsWith('|')) {
                inTable = true;
                const cells = cleanLine.split('|').filter((c, i, arr) => !( (i === 0 || i === arr.length - 1) && c.trim() === '' )).map(c => c.trim());
                if (cells.some(c => c.match(/^[\s-:]+$/))) return null;
                tableRows.push(cells);
                return null;
            } else if (inTable) {
                inTable = false;
                const table = renderTable(tableRows, `table-${key}`);
                tableRows = [];
                return cleanLine === '' ? table : <div key={key}>{table}{parseText(line)}</div>;
            }
            if (cleanLine.includes('---SEPARATOR')) return <div key={key} className="py-12"><hr className="border-4 border-dashed border-purple-200"/></div>;
            const checkboxMatch = line.match(/^(\s*)(\[ ?\]|\[x\]|\( ?\))\s*(.*)/i);
            if (checkboxMatch) {
                return (
                   <div key={key} className={`flex items-start gap-3 my-2 ${checkboxMatch[1].length > 0 ? 'ml-6' : ''}`}>
                      <div className="shrink-0 mt-1 w-4 h-4 border border-purple-400 rounded bg-white" />
                      <div className="text-slate-800 leading-snug">{parseText(checkboxMatch[3])}</div>
                   </div>
                );
            }
            const imageGoogleMatch = cleanLine.match(/\[IMAGE_GOOGLE:\s*(.*?)\]/);
            if (imageGoogleMatch) {
                return (
                    <div key={key} className="my-6 p-5 border-2 border-purple-100 bg-purple-50 rounded-3xl flex items-center justify-between gap-4 no-print">
                        <div className="flex items-center gap-4">
                           <div className="bg-white p-3 rounded-2xl shadow-sm"><ImageIcon className="w-6 h-6 text-purple-600" /></div>
                           <div className="text-sm">
                              <span className="font-black text-purple-900 block text-[10px] uppercase tracking-widest mb-1">Cari Gambar Terkait</span>
                              <span className="italic font-bold text-purple-400">"{imageGoogleMatch[1]}"</span>
                           </div>
                        </div>
                        <a href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(imageGoogleMatch[1].trim())}`} target="_blank" rel="noreferrer" className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black rounded-2xl transition-all shadow-lg flex items-center gap-2 uppercase tracking-widest"><Search className="w-4 h-4" /> Cari</a>
                    </div>
                );
            }
            const isQuestionStart = line.match(/^\d+[\.\)]/);
            return <div key={key} className={`mb-3 ${line.startsWith('**') ? 'mt-6 mb-3' : ''} ${isQuestionStart ? "mt-8 pt-4 border-t border-purple-50" : ""}`}>{parseText(line)}</div>;
        });
    });
  }, [displayContent]);

  if (error) return <div className="p-8 text-center text-red-600 bg-red-50 rounded-3xl border border-red-100 shadow-xl">{error}</div>;

  if (isLoading || isRefining) return (
      <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] shadow-2xl border border-purple-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-purple-100">
           <div className="h-full bg-purple-600 animate-[loading_2s_infinite]"></div>
        </div>
        <div className="bg-purple-50 p-6 rounded-full shadow-inner mb-8"><Loader2 className="w-16 h-16 text-purple-600 animate-spin" /></div>
        <h3 className="text-2xl font-black text-purple-900 mb-4 animate-pulse">{isRefining ? 'Menganalisis Kualitas...' : 'Meracik Paket Soal...'}</h3>
        <div className="max-w-md w-full bg-purple-50/50 rounded-2xl p-6 text-left border border-purple-100">
           <p className="text-xs text-purple-700 font-bold mb-4 uppercase tracking-[0.2em]">Estimasi Parameter:</p>
           <ul className="space-y-4">
              <li className="flex items-center gap-3 text-xs font-medium text-slate-500"><Wifi className="w-4 h-4 text-emerald-500" /> Menunggu respon dari Google AI Studio</li>
              <li className="flex items-center gap-3 text-xs font-medium text-slate-500"><Server className="w-4 h-4 text-blue-500" /> Proses kalkulasi CP/TP otomatis aktif</li>
              <li className="flex items-center gap-3 text-xs font-medium text-slate-500"><LayersIcon className="w-4 h-4 text-purple-500" /> Struktur stimulus sedang dibangun</li>
           </ul>
        </div>
        <style>{`
          @keyframes loading {
            0% { width: 0; left: 0; }
            50% { width: 100%; left: 0; }
            100% { width: 0; left: 100%; }
          }
        `}</style>
      </div>
  );

  if (!content) return null;

  return (
    <div className="flex flex-col h-full relative bg-white rounded-[2rem] shadow-2xl border border-purple-100 overflow-hidden">
      <div className="flex bg-slate-100 p-1.5 gap-1.5 border-b border-slate-200 no-print">
        <button onClick={() => setViewMode('TEACHER')} className={`flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'TEACHER' ? 'bg-white text-purple-700 shadow-md' : 'text-slate-500 hover:text-purple-600'}`}>Guru (Lengkap)</button>
        <button onClick={() => setViewMode('BLUEPRINT')} className={`flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'BLUEPRINT' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>Kisi-Kisi</button>
        <button onClick={() => setViewMode('STUDENT')} className={`flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'STUDENT' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500'}`}>Siswa</button>
      </div>
      <div className="flex justify-between items-center py-4 px-8 bg-white border-b border-purple-50 no-print">
          <div className="flex gap-2">
            <button onClick={handleDownloadDoc} className="p-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl transition-all border border-purple-200 shadow-sm"><FileDown className="w-5 h-5" /></button>
            <button onClick={handleCopy} className="p-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl transition-all border border-purple-200 shadow-sm">{copySuccess ? <CopyCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"><Printer className="w-4 h-4" /> Cetak</button>
          </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
         <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar font-sans text-slate-900 leading-relaxed text-base">
            <div id="result-content-area" className="prose max-w-none">{formattedOutput}</div>
         </div>
      </div>
    </div>
  );
});
