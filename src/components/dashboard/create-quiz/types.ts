// types.ts

export interface AnswerOptionData {
  id: string;
  text: string;
}

export interface QuestionData {
  id: string;
  questionNumber: number;
  title: string;
  questionType: 'single-choice' | 'multiple-choice';
  questionImage?: File | string | null;
  choicesConfig: {
    isMultipleAnswer: boolean;
    isAnswerWithImageEnabled: boolean;
  };
  options: AnswerOptionData[];
  correctAnswerIds: string[];
  points: string;
  isRequired: boolean;
}

export interface Quiz {
  _id: string;
  name: string;
  questions: QuestionData[];
  createdAt?: string;
  examTitle?: string;
  totalQuestions?: number;
  duration?: string;
  progress?: number;
  imageUrl?: string;
  category?: string;
}

export interface QuestionSummary {
  id: string;
  number: number;
  textPreview: string;
  type: 'single-choice' | 'multiple-choice';
  typeIcon?: React.ReactNode;
}

// >>> THÊM HOẶC ĐẢM BẢO CÁC INTERFACE NÀY ĐƯỢC EXPORT <<<
export interface ManualCreationDetails {
  mode: 'manual';
  examTitle: string;
  duration: string;
}

export interface AICreationDetails {
  mode: 'ai';
  examTitle: string;
  documentFile?: File | null;
  difficultyLevel: string;
  topic: string;
  questionConfigs: Array<{ type: string; count: number }>;
}
// >>> -------------------------------------------------- <<<
