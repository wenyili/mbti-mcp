// MBTI Types and Dimensions
export type MBTIDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
export type MBTIType = string; // 16 types like 'INTJ', 'ESFP', etc.

// Cognitive Functions
export type CognitiveFunction = 'Ne' | 'Ni' | 'Se' | 'Si' | 'Te' | 'Ti' | 'Fe' | 'Fi';

// Test Types
export type TestType = 'simplified' | 'cognitive';

// Question Structure
export interface Question {
  id: number;
  text: string;
  dimension?: MBTIDimension; // For simplified test
  cognitiveFunction?: CognitiveFunction; // For cognitive test
  reverse?: boolean; // If true, reverse the scoring
}

// Answer Structure
export interface Answer {
  questionId: number;
  score: number; // 1-5 (Likert scale)
}

// Test Session State (passed in each call for stateless design)
export interface TestSession {
  testType: TestType;
  answers: Answer[];
  currentQuestionIndex: number;
}

// Test Result
export interface TestResult {
  mbtiType: MBTIType;
  dimensionScores?: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  cognitiveFunctionScores?: {
    Ne: number;
    Ni: number;
    Se: number;
    Si: number;
    Te: number;
    Ti: number;
    Fe: number;
    Fi: number;
  };
  functionStack?: CognitiveFunction[];
  description: string;
}

// Question Bank
export interface QuestionBank {
  simplified: Question[];
  cognitive: Question[];
}
