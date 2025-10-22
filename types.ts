export type AppStep = 'welcome' | 'form' | 'analysis' | 'chat' | 'appointment';

export interface FormData {
  age: string;
  gender: 'male' | 'female' | 'other';
  hairLossLevel: string;
  previousOperation: 'yes' | 'no';
  goals: string[];
  photo?: {
    base64: string;
    mimeType: string;
  };
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface AnalysisResponse {
    graft: string;
    recoveryTime: string;
    suggestedMethod: string;
    summary: string;
}