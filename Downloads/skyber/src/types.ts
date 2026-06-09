export interface Service {
  id: string;
  title: string;
  description: string;
  basePrice: string;
  deliveryTime: string;
  iconName: string;
  tags: string[];
}

export interface AnalysisResult {
  workloadLevel: string;
  timeEstimate: string;
  recommendedPriceRange: string;
  skillsNeeded: string[];
  difficultyExplanation: string;
  suggestedOutline: string[];
  insiderTips: string[];
  offlineMode?: boolean;
}

export interface Review {
  id: string;
  name: string;
  campus: string;
  major: string;
  rating: number;
  date: string;
  text: string;
  serviceCompleted: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SimulatedOrder {
  id: string;
  title: string;
  category: string;
  price: string;
  deadline: string;
  status: 'Diterima' | 'Analisis Spesifikasi' | 'Pengerjaan' | 'Review Kualitas' | 'Selesai';
  progressBar: number; // percentage
  createdAt: string;
}
