export interface Fallacy {
  name: string;
  description: string;
  exampleInText?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  trustScore: number; // 0 to 100
  verdict: 'Credible' | 'Questionable' | 'Misleading' | 'Satire' | 'Unverifiable';
  summary: string;
  manipulationTechniques: Fallacy[];
  positiveIndicators: string[];
  negativeIndicators: string[];
  educationalInsight: string; // Teaches the user a concept about media literacy based on this specific text
}

export interface FullAnalysisResponse {
  analysis: AnalysisResult | null;
  sources: GroundingSource[];
  rawText?: string;
}
