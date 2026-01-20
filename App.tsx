
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { QuestionRequest, GenerateState, RefineActionType, HistoryItem } from './types';
import { generateQuestions, refineContent } from './services/geminiService';
import { BookOpenCheck, Settings2, FileText, History, Loader2, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';

const QuestionForm = lazy(() => import('./components/QuestionForm').then(module => ({ default: module.QuestionForm })));
const ResultPaper = lazy(() => import('./components/ResultPaper').then(module => ({ default: module.ResultPaper })));
const HistoryModal = lazy(() => import('./components/HistoryModal').then(module => ({ default: module.HistoryModal })));

const HISTORY_KEY = 'bikin-soal-history-v1';

const PageLoader = () => (
  <div className="w-full h-full flex flex-col items-center justify-center p-12 opacity-75">
    <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
    <span className="text-xs font-medium text-slate-500">Memuat Komponen...</span>
  </div>
);

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [request, setRequest] = useState<QuestionRequest>({
    regulasiBasis: 'UMUM_CP046',
    language: 'Bahasa Indonesia',
    jenjang: '',
    kelas: '', 
    kurikulum: 'Kurikulum Merdeka (Kemendikbudristek)',
    mapel: '',
    semester: '',
    jenisSoal: [], 
    jumlahPerJenis: {},
    jumlahOpsi: 4,
    topik: '',
    answerKeyDetail: 'DETAILED',
    uploadedFileContent: '',
    uploadedFileName: '',
    kompetensiMode: 'AUTO',
    useStimulus: false,
    enableImageMode: false,
    imageQuantity: 1,
    imageStyle: 'GOOGLE',
    distribusiMode: 'PROPORTIONAL', 
    gayaBahasa: 'Bahasa Formal Sekolah (Baku Akademik)',
    level: '',
    jumlah: 0,
    userType: 'Guru Sekolah (Formal & Terstruktur)'
  });

  const [state, setState] = useState<GenerateState>({
    isLoading: false,
    result: null,
    error: null
  });

  const [isRefining, setIsRefining] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const handleChange = (field: keyof QuestionRequest, value: any) => {
    setRequest(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'jumlahPerJenis') {
        const total = Object.values(value as Record<string, number>).reduce((a, b) => a + b, 0);
        updated.jumlah = total;
      }
      return updated;
    });
  };

  const saveToHistory = (req: QuestionRequest, res: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      request: req,
      result: res
    };
    let tempHistory = [newItem, ...history].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(tempHistory));
    setHistory(tempHistory);
  };

  const handleSubmit = async () => {
    setState({ isLoading: true, result: null, error: null });
    setCurrentStep(4);
    
    try {
      const generatedText = await generateQuestions(request);
      setState({ isLoading: false, result: generatedText, error: null });
      saveToHistory(request, generatedText);
    } catch (error) {
      setState({ 
        isLoading: false, 
        result: null, 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan' 
      });
    }
  };

  const handleRefine = async (action: RefineActionType) => {
    if (!state.result) return;
    setIsRefining(true);
    try {
      const refinedText = await refineContent(state.result, action);
      setState(prev => ({ ...prev, result: refinedText }));
    } catch (error) {
      alert("Gagal memproses perbaikan.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setRequest(item.request);
    setState({ isLoading: false, result: item.result, error: null });
    setShowHistory(false);
    setCurrentStep(4);
  };

  const isStepValid = (step: number) => {
    if (step === 1) return request.jenjang && request.kelas && request.mapel && request.semester && request.topik;
    if (step === 2) return request.jenisSoal.length > 0 && request.jumlah > 0;
    if (step === 3) return request.level && request.gayaBahasa;
    return true;
  };

  return (
    <div className="h-[100dvh] bg-slate-50 flex flex-col font-sans overflow-hidden">
      <header className="bg-white shadow-sm border-b border-purple-100 shrink-0 z-50 no-print h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-1.5 rounded-lg shadow-lg shadow-purple-200">
              <BookOpenCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-purple-900 tracking-tight leading-none">Bikin Soal Cepat</h1>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider hidden sm:block mt-0.5">Wizard System v2.1</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50 rounded-xl transition-all font-bold text-xs"
             >
                <History className="w-4 h-4" />
                <span className="hidden md:block">Riwayat</span>
             </button>
             {currentStep === 4 && (
               <button 
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition-all font-bold text-xs"
               >
                  <Settings2 className="w-4 h-4" />
                  Konfigurasi Baru
               </button>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto md:px-6 py-4 md:py-8 overflow-hidden flex flex-col">
        {currentStep < 4 && (
          <div className="mb-8 px-4 no-print">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-purple-600 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
              {[1, 2, 3].map((s) => (
                <div key={s} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                    currentStep === s 
                      ? 'bg-purple-600 text-white border-purple-600 scale-110 shadow-lg shadow-purple-200' 
                      : currentStep > s 
                        ? 'bg-purple-100 text-purple-600 border-purple-200' 
                        : 'bg-white text-slate-400 border-slate-200'
                  }`}>
                    {s}
                  </div>
                  <span className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${currentStep === s ? 'text-purple-700' : 'text-slate-400'}`}>
                    {s === 1 ? 'Materi' : s === 2 ? 'Struktur' : 'Kualitas'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              {currentStep < 4 ? (
                <div className="h-full max-w-3xl mx-auto">
                  <QuestionForm 
                    request={request}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    isLoading={state.isLoading}
                    currentStep={currentStep}
                    onNext={() => setCurrentStep(prev => prev + 1)}
                    onPrev={() => setCurrentStep(prev => prev - 1)}
                    isValid={isStepValid(currentStep)}
                  />
                </div>
              ) : (
                <div className="h-full animate-in fade-in zoom-in-95 duration-500">
                  <ResultPaper 
                    content={state.result}
                    error={state.error}
                    isLoading={state.isLoading}
                    isRefining={isRefining}
                    onRefine={handleRefine}
                  />
                </div>
              )}
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      <Suspense fallback={null}>
        <HistoryModal 
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={history}
          onSelect={handleLoadHistory}
          onDelete={(id) => {
            const newH = history.filter(h => h.id !== id);
            setHistory(newH);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newH));
          }}
          onClearAll={() => {
            setHistory([]);
            localStorage.removeItem(HISTORY_KEY);
          }}
        />
      </Suspense>
    </div>
  );
};

export default App;
