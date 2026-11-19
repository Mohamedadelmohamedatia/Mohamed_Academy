export interface GlossaryTerm {
  en: string;
  ar: string;
  definition: string;
}

export interface ComparisonTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface TopicExample {
  title: string;
  code: string;
  expectedOutput: string;
  explanation?: string;
}

export interface TopicSection {
  id: string;
  titleAr: string;
  titleEn: string;
  intro: string;
  stepByStep: string[];
  importance: string;
  howItWorks: string;
  itRealWorldExamples: string[];
  codeExample: TopicExample;
  glossary: GlossaryTerm[];
  comparisonTable?: ComparisonTable;
  warningNote?: string;
}

export interface LineExplanation {
  lineNumber: number;
  code: string;
  explanation: string;
}

export interface PracticalExample {
  id: string;
  title: string;
  problemStatement: string;
  code: string;
  lineByLine: LineExplanation[];
  expectedOutput: string;
  whyItWorks: string;
  commonMistakes: string[];
}

export interface McqQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticalExercise {
  id: string;
  title: string;
  difficulty: "مبتدئ" | "متوسط" | "تطبيقي";
  prompt: string;
  starterCode: string;
  hint: string;
  expectedOutput: string;
  requiredPatterns: string[];
  solutionCode: string;
  solutionExplanation: string;
}

export type VisualLabType =
  | "colab-print"
  | "memory-variables"
  | "precedence-input"
  | "try-operators-logic"
  | "flowchart-if-else"
  | "elif-nested"
  | "while-loop"
  | "for-range"
  | "nested-break-continue"
  | "list-indexing"
  | "list-slicing-methods"
  | "string-slicing-loops"
  | "function-structure"
  | "function-arguments"
  | "return-vs-print";

export interface Lesson {
  id: string;
  chapterId: string;
  courseId: string;
  number: string;
  titleAr: string;
  titleEn: string;
  lectureRef: string;
  estimatedMinutes: number;
  overview: string;
  objectives: string[];
  visualLabType: VisualLabType;
  visualLabTitle: string;
  topics: TopicSection[];
  examples: PracticalExample[];
  mcqs: McqQuestion[];
  exercises: PracticalExercise[];
}

export interface Chapter {
  id: string;
  courseId: string;
  number: number;
  lectureNumber: number;
  titleAr: string;
  titleEn: string;
  lecturer: string;
  summary: string;
  lessonIds: string[];
  examId: string;
}

export interface Course {
  id: string;
  number: number;
  titleAr: string;
  titleEn: string;
  description: string;
  level: string;
  chapterIds: string[];
  accentFrom: string;
  accentTo: string;
}

export interface ChapterExam {
  id: string;
  chapterId: string;
  titleAr: string;
  titleEn: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  questions: McqQuestion[];
}

export interface AchievementDef {
  id: string;
  titleAr: string;
  description: string;
  metricLabel: string;
}

export interface StudentProgress {
  completedLessons: string[];
  quizScores: Record<string, { score: number; total: number; answers: Record<string, number>; completedAt: string }>;
  completedExercises: string[];
  exerciseDrafts: Record<string, string>;
  examScores: Record<string, { score: number; total: number; passed: boolean; answers: Record<string, number>; completedAt: string }>;
  lastVisitedLessonId: string;
  lastVisitedPage: string;
  studyMinutesAccumulated: number;
}

export type AppPage =
  | "home"
  | "courses"
  | "chapters"
  | "lesson"
  | "practice"
  | "exams"
  | "dashboard";
