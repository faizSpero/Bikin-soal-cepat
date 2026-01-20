
export enum Jenjang {
  PAUD = 'PAUD / TK / RA',
  SD = 'SD / MI',
  SMP = 'SMP / MTs',
  SMA = 'SMA / MA / SMK'
}

export enum LevelKesulitan {
  LEVEL_1 = 'Level 1: Mudah (C1-C2)',
  LEVEL_2 = 'Level 2: Sedang (C3)',
  LEVEL_3 = 'Level 3: Sulit (C4)',
  LEVEL_4 = 'Level 4: HOTS (C5-C6)',
  LEVEL_5 = 'Level 5: Olimpiade'
}

export interface QuestionRequest {
  regulasiBasis: string;   // New: Basis Regulasi/Aturan
  language: string;       
  jenjang: string;
  kelas: string;          
  kurikulum: string;
  mapel: string;
  topik: string;          
  subElemen?: string;     
  kompetensiMode: 'AUTO' | 'MANUAL';
  kompetensiManual?: string;
  semester: string;
  jenisSoal: string[];    
  
  jumlahPerJenis: Record<string, number>; 
  jumlahOpsi: number;
  answerKeyDetail: 'DETAILED' | 'SIMPLE' | 'RUBRIC';
  uploadedFileContent?: string;
  uploadedFileName?: string;
  useStimulus: boolean;
  jenisStimulus?: string;
  soalPerStimulus?: number;
  enableImageMode: boolean;
  imageQuantity: number;
  imageStyle: 'REALISTIC' | 'GOOGLE'; 
  distribusiMode: 'FLAT' | 'PROPORTIONAL' | 'HOTS' | 'REMEDIAL';
  gayaBahasa: string;
  level: string; 
  jumlah: number;
  userType: string; 
}

export interface GenerateState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  request: QuestionRequest;
  result: string;
}

export type RefineActionType = 
  | 'AUDIT'       
  | 'SIMILARITY'  
  | 'KISI_KISI'   
  | 'ANALYSIS'    
  | 'VARIASI_A'   
  | 'VARIASI_B'   
  | 'MULTI_PACKET' 
  | 'SHUFFLE_Q'    
  | 'SHUFFLE_OPT'  
  | 'CONVERT_PG'  
  | 'CONVERT_AKM' 
  | 'CONVERT_ESSAY'
  | 'LEVEL_UP'    
  | 'FIX_LANG';
