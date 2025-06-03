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

export interface QuestionSummary {
  id: string;
  number: number;
  textPreview: string;
  type: 'single-choice' | 'multiple-choice';
  typeIcon?: React.ReactNode;
}
